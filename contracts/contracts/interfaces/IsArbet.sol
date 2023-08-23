// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IsArbet {
    function addReward(uint256 _reward) external;
    function claimReward() external;
}