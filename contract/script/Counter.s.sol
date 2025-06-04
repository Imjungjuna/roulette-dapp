// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Roulette} from "../src/Roulette.sol";

contract CounterScript is Script {
    Roulette public roulette;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        roulette = new Roulette();

        vm.stopBroadcast();
    }
}
