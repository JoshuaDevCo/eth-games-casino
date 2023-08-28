// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Game.sol";

contract GameRPS is Game {
    uint256 constant ROCK = 1;
    uint256 constant PAPER = 2;
    uint256 constant SCISSORS = 3;

    uint256 constant WIN = 2;
    uint256 constant DRAW = 1;
    uint256 constant LOSE = 0;


    error InvalidBet(uint256 bet);

    constructor (address _usdt, address _vault, address _console, address _house, address _rng, uint256 _id, uint256 _numbersPerRoll)
        Game(_usdt, _vault, _console, _house, _rng, _id, _numbersPerRoll)
    {}

    function decide(uint256 p1Choice, uint256 p2Choice) internal pure returns (uint256) {
        if (p1Choice == ROCK && p2Choice == PAPER) {
            return LOSE;
        } else if (p1Choice == ROCK && p2Choice == SCISSORS) {
            return WIN;
        } else if (p1Choice == PAPER && p2Choice == ROCK) {
            return WIN;
        } else if (p1Choice == PAPER && p2Choice == SCISSORS) {
            return LOSE;
        } else if (p1Choice == SCISSORS && p2Choice == PAPER) {
            return WIN;
        } else if (p1Choice == SCISSORS && p2Choice == ROCK) {
            return LOSE;
        }

        return DRAW;
    }
    
    function finalize(uint256 _betId, uint256[] memory _randomNumbers) internal virtual override returns (uint256) {
        Types.Bet memory _bet = house.getBet(_betId);
        uint256 _betNum = _bet.betNum;
        uint256 _payout = 0;
        uint256[] memory _rolls = new uint256[](_bet.rolls);

        emit GameStart(_betId, _betNum, _bet.data);

        uint256 payoutRatio = getMaxPayout(_betNum, _bet.data);
        uint256 wins = 0;
        uint256 draws = 0;
        uint256 losses = 0;

        for (uint256 _i = 0; _i < _bet.rolls; _i++) {
            uint256 _roll = rng.getModulo(_randomNumbers[_i], 1, 3); // To avoid 0 (not used)
            uint256 result = decide(_betNum, _roll);

            if (result == WIN) {
                _payout += _bet.stake * payoutRatio * 2 / PAYOUT_AMPLIFIER;
                wins ++;
            } else if (result == DRAW) {
                _payout += _bet.stake * payoutRatio * 1 / PAYOUT_AMPLIFIER;
                draws ++;
            } else if (result == LOSE) {
                losses ++;
            }

            _rolls[_i] = _roll;
        }
        
        emit GameEnd(_betId, _randomNumbers, _rolls, _betNum, _bet.stake, wins, /*draws,*/ losses, _payout, _bet.player, block.timestamp);

        return _payout;
    }

    function getMaxPayout(uint256, uint256[50] memory) public virtual override view returns (uint256) {
        Types.Game memory ga = consoleInst.getGame(id);
        return ((100 - ga.edge) * PAYOUT_AMPLIFIER) / 100;
    }
}
