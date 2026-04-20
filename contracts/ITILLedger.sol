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
        string category;  // Category: "IP Address", "Domain Name", "Phone Number", "Malware Hash"
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
    mapping(string => bool) public iocExists;  // Track submitted indicators to prevent duplicates

    // ============ Events ============
    event IoCSubmitted(
        uint256 indexed iocId,
        string category,
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
     * @param category The category of the threat indicator (IP Address, Domain Name, Phone Number, Malware Hash)
     */
    function submitIoC(string memory threatIndicator, string memory category) external returns (uint256) {
        require(bytes(threatIndicator).length > 0, "Threat indicator cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(!iocExists[threatIndicator], "IoC already exists on the ledger");
        
        uint256 iocId = iocCounter++;
        
        // Mark indicator as existing to prevent duplicates
        iocExists[threatIndicator] = true;
        
        IoC storage newIoC = ioCs[iocId];
        newIoC.id = iocId;
        newIoC.threatIndicator = threatIndicator;
        newIoC.category = category;
        newIoC.submitter = msg.sender;
        newIoC.status = IoCStatus.Pending;
        newIoC.approvalCount = 0;
        newIoC.rejectionCount = 0;
        newIoC.createdAt = block.timestamp;

        emit IoCSubmitted(iocId, threatIndicator, category, msg.sender);
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
        require(ioc.status == IoCStatus.Pending, "Cannot vote on non-pending IoC");
        require(!votes[iocId][msg.sender].voted, "Already voted on this IoC");
        require(msg.sender != ioc.submitter, "Submitter cannot vote on own submission");

        // STEP 1: Record the vote
        votes[iocId][msg.sender].voted = true;
        votes[iocId][msg.sender].approved = isApproved;

        // STEP 2: Increment vote count based on vote type
        if (isApproved) {
            ioc.approvalCount++;
            ioc.approvers.push(msg.sender);
        } else {
            ioc.rejectionCount++;
            ioc.rejectors.push(msg.sender);
        }

        emit IoCVoted(iocId, msg.sender, isApproved);

        // STEP 3: IMMEDIATELY check if threshold is reached (>= 1 approval vote)
        if (ioc.approvalCount >= VERIFICATION_THRESHOLD && ioc.status == IoCStatus.Pending) {
            // STEP 4: Update IoC status to Verified
            ioc.status = IoCStatus.Verified;
            ioc.verifiedAt = block.timestamp;

            // STEP 5: IMMEDIATELY distribute rewards via transfer
            // Transfer to submitter
            require(
                itilToken.transfer(ioc.submitter, SUBMITTER_REWARD),
                "Submitter reward transfer failed"
            );
            emit RewardDistributed(iocId, ioc.submitter, SUBMITTER_REWARD);

            // Transfer to voter
            require(
                itilToken.transfer(msg.sender, VOTER_REWARD),
                "Voter reward transfer failed"
            );
            emit RewardDistributed(iocId, msg.sender, VOTER_REWARD);

            emit IoCVerified(iocId, ioc.submitter);
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
            string memory category,
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
            ioc.category,
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
    // (No longer needed - verification and reward distribution now happen inline in voteOnIoC)
}
