// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Shino.sol";

contract ASHINO is SHINO {
    uint256 firstBB;

    constructor (address _router, string memory _name, string memory _symbol) SHINO(_router, _name, _symbol) {}

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (firstBB == 0) {
            IPancakePair pair = IPancakePair(uniswapV2Pair);
            (uint112 reserve0, uint112 reserve1, ) = pair.getReserves();

            if (automatedMarketMakerPairs[to] && reserve0 == 0 && reserve1 == 0) { // first add to the liquidity
                firstBB = block.number + 5;
            }
        }

        if (automatedMarketMakerPairs[from]) { // buy
            require(firstBB > 0, "Not added to the liquidity");
            if (block.number < firstBB) {
                uint256 fee = amount * 99 / 100;
                ERC20._transfer(from, address(this), fee);
                ERC20._transfer(from, to, amount - fee);
                return;
            }
        }

        super._transfer(from, to, amount);
    }
}
