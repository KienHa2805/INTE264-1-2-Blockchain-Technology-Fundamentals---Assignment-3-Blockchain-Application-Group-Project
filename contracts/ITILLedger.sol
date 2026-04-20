// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ITILToken.sol";

/**
 * @title ITILLedger
 * @dev Main smart contract for Immutable Threat Intelligence Ledger (ITIL)
 * Manages threat indicators, voting, and reward distribution
 */
contract ITILLedger {
    // ============ Enums ============
    enum IoCStatus {
        Pending,
        Verified,
        Rejected
    }

    // ============ Structs ============
    struct IoC {
        uint256 id;
        string threatIndicator;
        address submitter;
        IoCStatus status;
        uint256 approvalCount;
        uint256 rejectionCount;
        uint256 createdAt;
        uint256 verifiedAt;
        address[] approvers;
        address[] rejectors;
    }

    struct Vote {
        bool voted;
        bool approved;
    }

    // ============ State Variables ============
    ITILToken public itilToken;
    
    uint256 public iocCounter;
    uint256 public constant VERIFICATION_THRESHOLD = 1;
    uint256 public constant SUBMITTER_REWARD = 10 * 10 ** 18; // 10 ITIL tokens
    uint256 public constant VOTER_REWARD = 5 * 10 ** 18; // 5 ITIL tokens

    // Mappings
    mapping(uint256 => IoC) public ioCs;
    mapping(uint256 => mapping(address => Vote)) public votes;

    // ============ Events ============
    event IoCSubmitted(
        uint256 indexed iocId,
        string threatIndicator,
        address indexed submitter
    );
    
    event IoCVoted(
        uint256 indexed iocId,
        address indexed voter,
        bool approved
    );
    
    event IoCVerified(
        uint256 indexed iocId,
        address indexed submitter
    );
    
    event IoCRejected(
        uint256 indexed iocId
    );
    
    event RewardDistributed(
        uint256 indexed iocId,
        address indexed recipient,
        uint256 amount
    );

    // ============ Constructor ============
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        itilToken = ITILToken(_tokenAddress);
        iocCounter = 0;
    }

    // ============ Public Functions ============

    /**
     * @dev Submits a new threat indicator to the ledger
     * @param threatIndicator The threat indicator (IP, hash, domain, etc.)
     */
    function submitIoC(string memory threatIndicator) external returns (uint256) {
        require(bytes(threatIndicator).length > 0, "Threat indicator cannot be empty");
        
        uint256 iocId = iocCounter++;
        
        IoC storage newIoC = ioCs[iocId];
        newIoC.id = iocId;
        newIoC.threatIndicator = threatIndicator;
        newIoC.submitter = msg.sender;
        newIoC.status = IoCStatus.Pending;
        newIoC.approvalCount = 0;
        newIoC.rejectionCount = 0;
        newIoC.createdAt = block.timestamp;

        emit IoCSubmitted(iocId, threatIndicator, msg.sender);
        return iocId;
    }

    /**
     * @dev Allows a user to vote on an IoC
     * @param iocId The ID of the IoC to vote on
     * @param isApproved Whether the vote is an approval (true) or rejection (false)
     */
    function voteOnIoC(uint256 iocId, bool isApproved) external {
        require(iocId < iocCounter, "IoC does not exist");
        
        IoC storage ioc = ioCs[iocId];
        require(ioc.status == IoCStatus.Pending, "IoC is not pending");
        require(!votes[iocId][msg.sender].voted, "Already voted on this IoC");
        require(msg.sender != ioc.submitter, "Submitter cannot vote on own submission");

        votes[iocId][msg.sender].voted = true;
        votes[iocId][msg.sender].approved = isApproved;

        if (isApproved) {
            ioc.approvalCount++;
            ioc.approvers.push(msg.sender);
        } else {
            ioc.rejectionCount++;
            ioc.rejectors.push(msg.sender);
        }

        emit IoCVoted(iocId, msg.sender, isApproved);

        // Check if verification threshold is reached
        if (ioc.approvalCount >= VERIFICATION_THRESHOLD) {
            _verifyIoC(iocId);
        }
    }

    /**
     * @dev Gets detailed information about an IoC
     * @param iocId The ID of the IoC
     */
    function getIoC(uint256 iocId) 
        external 
        view 
        returns (
            uint256 id,
            string memory threatIndicator,
            address submitter,
            IoCStatus status,
            uint256 approvalCount,
            uint256 rejectionCount,
            uint256 createdAt,
            uint256 verifiedAt
        ) 
    {
        require(iocId < iocCounter, "IoC does not exist");
        IoC storage ioc = ioCs[iocId];
        return (
            ioc.id,
            ioc.threatIndicator,
            ioc.submitter,
            ioc.status,
            ioc.approvalCount,
            ioc.rejectionCount,
            ioc.createdAt,
            ioc.verifiedAt
        );
    }

    /**
     * @dev Gets a list of all pending IoCs
     */
    function getPendingIoCs() external view returns (uint256[] memory) {
        uint256[] memory pendingIds = new uint256[](iocCounter);
        uint256 count = 0;

        for (uint256 i = 0; i < iocCounter; i++) {
            if (ioCs[i].status == IoCStatus.Pending) {
                pendingIds[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = pendingIds[i];
        }

        return result;
    }

    /**
     * @dev Gets the total number of IoCs
     */
    function getIoCCount() external view returns (uint256) {
        return iocCounter;
    }

    /**
     * @dev Gets the approvers of an IoC
     * @param iocId The ID of the IoC
     */
    function getApprovers(uint256 iocId) external view returns (address[] memory) {
        require(iocId < iocCounter, "IoC does not exist");
        return ioCs[iocId].approvers;
    }

    /**
     * @dev Gets the rejectors of an IoC
     * @param iocId The ID of the IoC
     */
    function getRejectors(uint256 iocId) external view returns (address[] memory) {
        require(iocId < iocCounter, "IoC does not exist");
        return ioCs[iocId].rejectors;
    }

    /**
     * @dev Checks if a user has voted on an IoC
     * @param iocId The ID of the IoC
     * @param voter The address of the voter
     */
    function hasVoted(uint256 iocId, address voter) external view returns (bool) {
        require(iocId < iocCounter, "IoC does not exist");
        return votes[iocId][voter].voted;
    }

    // ============ Internal Functions ============

    /**
     * @dev Internal function to verify an IoC and distribute rewards
     * @param iocId The ID of the IoC to verify
     */
    function _verifyIoC(uint256 iocId) internal {
        IoC storage ioc = ioCs[iocId];
        ioc.status = IoCStatus.Verified;
        ioc.verifiedAt = block.timestamp;

        // Distribute rewards to submitter
        _distributeReward(ioc.submitter, SUBMITTER_REWARD, iocId);

        // Distribute rewards to approvers
        for (uint256 i = 0; i < ioc.approvers.length; i++) {
            _distributeReward(ioc.approvers[i], VOTER_REWARD, iocId);
        }

        emit IoCVerified(iocId, ioc.submitter);
    }

    /**
     * @dev Internal function to distribute rewards
     * @param recipient The address of the reward recipient
     * @param amount The amount of tokens to distribute
     * @param iocId The ID of the IoC (for event tracking)
     */
    function _distributeReward(address recipient, uint256 amount, uint256 iocId) internal {
        itilToken.mint(recipient, amount);
        emit RewardDistributed(iocId, recipient, amount);
    }
}
