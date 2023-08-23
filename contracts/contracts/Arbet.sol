// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IUniswapV2Pair.sol";

contract Arbet is ERC20, Ownable {
    using SafeMath for uint256;

    error SetFeeError(uint256 sell, uint256 buy);

    uint256 constant private RESOLUTION = 10000;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;

    address public treasuryWallet;
    address public devWallet;

    uint256 public buyFee = 0;
    uint256 public sellFee = 400; // 4%
    uint256 public devFee = 2500; // 25% of total fee

    mapping (address => bool) private _isExcludedFromFees;
    mapping (address => bool) public automatedMarketMakerPairs;

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);
    event TreasuryWalletUpdated(address indexed newWallet);
    event DevWalletUpdated(address indexed newWallet);
    event FeeUpdated(uint256 newSellFee, uint256 newBuyFee);
    event DevFeeUpdated(uint256 newDevFee);
    event FeeExcluded(address user, bool set);

    constructor (address _router, string memory name, string memory symbol) ERC20(name, symbol) {
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(_router);
        uniswapV2Router = _uniswapV2Router;
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory()).createPair(address(this), _uniswapV2Router.WETH());
        _setAutomatedMarketMakerPair(uniswapV2Pair, true);

        treasuryWallet = 0xa6289561a9EFcd87b7eF88fc49B48aD478aE4Ad7;
        devWallet = 0x92208Bff3a44d2B0978c963bBA07879467000Ae2;

        excludeFromFees(owner(), true);
        excludeFromFees(address(this), true);
        excludeFromFees(address(0xdead), true);

        _mint(_msgSender(), 100_000_000 * (10 ** 18));
    }

    function setFee(uint256 newSellFee, uint256 newBuyFee) external onlyOwner {
        if (newSellFee > 50 * RESOLUTION / 100 || newBuyFee > 50 * RESOLUTION / 100) {
            revert SetFeeError(newSellFee, newBuyFee);
        }

        sellFee = newSellFee;
        buyFee = newBuyFee;

        emit FeeUpdated(sellFee, buyFee);
    }

    function updateTreasuryWallet(address newTreasuryWallet) external onlyOwner {
        treasuryWallet = newTreasuryWallet;
        emit TreasuryWalletUpdated(treasuryWallet);
    }

    function setDevFee(uint256 newDevFee) public onlyOwner {
        require(newDevFee <= RESOLUTION, "Dev Fee <= 100% Of Total Fee");
        devFee = newDevFee;

        emit DevFeeUpdated(devFee);
    }

    function updateDevWallet(address newDevWallet) external onlyOwner {
        devWallet = newDevWallet;
        emit DevWalletUpdated(devWallet);
    }

    function excludeFromFees(address _account, bool _excluded) public onlyOwner {
        _isExcludedFromFees[_account] = _excluded;
        emit FeeExcluded(_account, _excluded);
    }

    function isExcludedFromFees(address _account) public view returns(bool) {
        return _isExcludedFromFees[_account];
    }

    function setAutomatedMarketMakerPair(address pair, bool value) public onlyOwner {
        require(pair != uniswapV2Pair, "The pair cannot be removed from automatedMarketMakerPairs");
        _setAutomatedMarketMakerPair(pair, value);
    }

    function _setAutomatedMarketMakerPair(address pair, bool value) private {
        automatedMarketMakerPairs[pair] = value;

        emit SetAutomatedMarketMakerPair(pair, value);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if(amount == 0) {
            super._transfer(from, to, 0);
            return;
        }

        bool takeFee = !(_isExcludedFromFees[from] || _isExcludedFromFees[to]);
        uint256 fees = 0;

        if(takeFee) {
            // on sell
            if(automatedMarketMakerPairs[to] && sellFee > 0) {
                fees = fees.add(amount.mul(sellFee).div(RESOLUTION));
            }
            // on buy
            else if(automatedMarketMakerPairs[from] && buyFee > 0) {
                fees = fees.add(amount.mul(buyFee).div(RESOLUTION));
            }

            if(fees > 0) {
                uint256 _devFeeAmount = 0;
                if (devFee > 0) {
                    _devFeeAmount = fees.mul(devFee).div(RESOLUTION);
                    super._transfer(from, devWallet, _devFeeAmount);
                }
                super._transfer(from, treasuryWallet, fees.sub(_devFeeAmount));
            }

            amount = amount.sub(fees);
        }
        super._transfer(from, to, amount);
    }
}
