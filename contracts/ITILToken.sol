// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ITILToken
 * @dev ERC-20 utility token for the Immutable Threat Intelligence Ledger
 * Token is minted as a reward for threat intelligence submissions and voting
 */
contract ITILToken is ERC20, Ownable {
    // ITIL Ledger contract address (allowed to mint tokens)
    address public itilLedger;

    // Constants
    uint8 public constant TOKEN_DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** TOKEN_DECIMALS;

    // Events
    event ItilLedgerUpdated(address indexed newLedger);

    /**
     * @dev Constructor - Initializes the token with initial supply
     */
    constructor() ERC20("ITIL Token", "ITIL") Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Sets the ITIL Ledger contract address (only owner)
     * @param _ledger Address of the ITIL Ledger contract
     */
    function setItilLedger(address _ledger) external onlyOwner {
        require(_ledger != address(0), "Ledger address cannot be zero");
        itilLedger = _ledger;
        emit ItilLedgerUpdated(_ledger);
    }

    /**
     * @dev Mints tokens to a recipient (only ITIL Ledger can call)
     * @param to Recipient address
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == itilLedger, "Only ITIL Ledger can mint");
        require(to != address(0), "Cannot mint to zero address");
        _mint(to, amount);
    }

    /**
     * @dev Returns the number of decimals used by the token
     */
    function decimals() public pure override returns (uint8) {
        return TOKEN_DECIMALS;
    }
}
