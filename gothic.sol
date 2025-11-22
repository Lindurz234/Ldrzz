// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract GothicToken {
    // Basic token information
    string public constant name = "Gothic Token";
    string public constant symbol = "GOTH";
    uint8 public constant decimals = 18;
    uint256 public constant totalSupply = 1_110_000_000 * 10**18;

    // Balances and allowances
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address spender, uint256 value);
    event NativeReceived(address indexed from, uint256 value);
    event NativeSent(address indexed to, uint256 value);

    // Owner address (deployer)
    address public owner;

    // ==================== REENTRANCY GUARD ====================
    bool private _reentrancyLock;

    modifier nonReentrant() {
        require(!_reentrancyLock, "VANS: REENTRANCY_DETECTED");
        _reentrancyLock = true;
        _;
        _reentrancyLock = false;
    }

    // Constructor - deploy dengan semua supply ke deployer
    constructor() {
        owner = msg.sender;
        _balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // Modifier untuk owner-only functions
    modifier onlyOwner() {
        require(msg.sender == owner, "GOTH: NOT_OWNER");
        _;
    }

    // === STANDARD ERC20 FUNCTIONS ===

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 value) public returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        address owner_ = msg.sender;
        _allowances[owner_][spender] = value;
        emit Approval(owner_, spender, value);
        return true;
    }

    function allowance(address owner_, address spender) public view returns (uint256) {
        return _allowances[owner_][spender];
    }

    // === NATIVE TOKEN SUPPORT ===

    // Receive native token (ETH) - dengan reentrancy guard
    receive() external payable {
        emit NativeReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit NativeReceived(msg.sender, msg.value);
    }

    // Kirim native token dari contract - dengan reentrancy guard
    function sendNative(address payable to, uint256 amount) public onlyOwner nonReentrant {
        require(address(this).balance >= amount, "VANS: INSUFFICIENT_NATIVE");
        (bool success, ) = to.call{value: amount}("");
        require(success, "GOTH: NATIVE_TRANSFER_FAILED");
        emit NativeSent(to, amount);
    }

    // Cek native balance contract
    function nativeBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // === ERC20 TOKEN SUPPORT ===

    // Transfer ERC20 token dari contract - dengan reentrancy guard
    function transferERC20(address tokenAddress, address to, uint256 amount) public onlyOwner nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        bool success = token.transfer(to, amount);
        require(success, "GOTH: ERC20_TRANSFER_FAILED");
    }

    // Transfer semua ERC20 token dari contract - dengan reentrancy guard
    function transferAllERC20(address tokenAddress, address to) public onlyOwner nonReentrant {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "GOTH: NO_ERC20_BALANCE");
        bool success = token.transfer(to, balance);
        require(success, "GOTH: ERC20_TRANSFER_FAILED");
    }

    // === INTERNAL FUNCTIONS ===

    function _transfer(address from, address to, uint256 value) internal {
        require(from != address(0), "GOTH: FROM_ZERO_ADDRESS");
        require(to != address(0), "GOTH: TO_ZERO_ADDRESS");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= value, "VANS: INSUFFICIENT_BALANCE");

        unchecked {
            _balances[from] = fromBalance - value;
            _balances[to] += value;
        }

        emit Transfer(from, to, value);
    }

    function _spendAllowance(address owner_, address spender, uint256 value) internal {
        uint256 currentAllowance = allowance(owner_, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= value, "VANS: INSUFFICIENT_ALLOWANCE");
            unchecked {
                _approve(owner_, spender, currentAllowance - value);
            }
        }
    }

    function _approve(address owner_, address spender, uint256 value) internal {
        require(owner_ != address(0), "VANS: APPROVE_FROM_ZERO");
        require(spender != address(0), "VANS: APPROVE_TO_ZERO");

        _allowances[owner_][spender] = value;
        emit Approval(owner_, spender, value);
    }

    // === OWNER FUNCTIONS ===

    // Transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "VANS: NEW_OWNER_ZERO");
        owner = newOwner;
    }

    // Renounce ownership
    function renounceOwnership() public onlyOwner {
        owner = address(0);
    }
}

// Minimal ERC20 interface untuk transfer token
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}