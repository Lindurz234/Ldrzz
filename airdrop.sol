// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SplashAirdrop is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public airdropAmount;
    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public whitelist;
    
    event AirdropClaimed(address indexed user, uint256 amount);
    event WhitelistUpdated(address[] users, bool status);

    constructor(address _token, uint256 _airdropAmount) {
        token = IERC20(_token);
        airdropAmount = _airdropAmount;
    }

    function claimAirdrop() external nonReentrant {
        require(whitelist[msg.sender], "Not eligible for airdrop");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(token.balanceOf(address(this)) >= airdropAmount, "Insufficient tokens");

        hasClaimed[msg.sender] = true;
        require(token.transfer(msg.sender, airdropAmount), "Transfer failed");

        emit AirdropClaimed(msg.sender, airdropAmount);
    }

    function setWhitelist(address[] calldata users, bool status) external onlyOwner {
        for (uint i = 0; i < users.length; i++) {
            whitelist[users[i]] = status;
        }
        emit WhitelistUpdated(users, status);
    }

    function withdrawTokens() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Withdrawal failed");
    }
}