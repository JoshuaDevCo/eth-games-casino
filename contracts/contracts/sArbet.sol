// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Reflection.sol";
import "./interfaces/IERC20Burnable.sol";

contract sArbet is Reflection {
    error InsufficientArbetBalance(uint256 _amount, uint256 _balance);
    error InsufficientArbetAllowance(uint256 _amount, uint256 _allowance);
    error InsufficientsArbetBalance(uint256 _amount, uint256 _balance);
    error InsufficientsArbetAllowance(uint256 _amount, uint256 _allowance);
    error ClaimPostponed(address _account);
    error InvalidVault(address vault);

    IERC20 public usdtToken;
    IERC20Burnable public arbetToken;

    constructor(address _arbetAddress, address _usdt, string memory _name, string memory _symbol) Reflection(_name, _symbol) {
        arbetToken = IERC20Burnable(_arbetAddress);
        usdtToken = IERC20(_usdt);
    }

    function stake(uint256 _amount) external {
        address snder = msg.sender;

        require(_amount > 0, "Nothing to stake");

        if(_amount > arbetToken.balanceOf(snder)) {
            revert InsufficientArbetBalance(_amount, arbetToken.balanceOf(snder));
        }

        if(_amount > arbetToken.allowance(snder, address(this))) {
            revert InsufficientArbetAllowance(_amount, arbetToken.allowance(snder, address(this)));
        }

        uint256 oldb = arbetToken.balanceOf(address(this));
        arbetToken.transferFrom(snder, address(this), _amount);
        uint256 newb = arbetToken.balanceOf(address(this));

        require(newb > oldb, "Zero to stake");
        deposit(snder, newb - oldb);
    }

    function unstake(uint256 _amount) external {
        address snder = msg.sender;
        if (_amount > balanceOf(snder)) {
            revert InsufficientsArbetBalance(_amount, balanceOf(snder));
        }

        arbetToken.transfer(snder, _amount);
        withdraw(snder, _amount);
    }

    function addReward(uint256 _reward) external onlyProvider {
        usdtToken.transferFrom(msg.sender, address(this), _reward);
        provide(_reward);
    }

    function claimReward() external {
        uint256 amount = _claimProvision(msg.sender);
        if (amount == 0) {
            revert ClaimNull(msg.sender);
        }
    }

    function _claimProvision(address user) internal virtual override returns (uint256) {
        uint256 amount = super._claimProvision(user);
        if (amount > 0) {
            usdtToken.transfer(user, amount);
        }
        return amount;
    }

    function setStakingContract(address _newContract) external onlyOwner {
        require(address(arbetToken) != _newContract, "Already Set");
        require(totalSupply() == 0, "Still Staked");
        arbetToken = IERC20Burnable(_newContract);
    }

    function setUSDTToken(address _newUSDT) external onlyOwner {
        require(address(usdtToken) != _newUSDT, "Already Set");
        require(totalSupply() == 0, "Still Staked");
        usdtToken = IERC20(_newUSDT);
    }
}
