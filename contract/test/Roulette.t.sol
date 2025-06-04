// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Roulette} from "../src/Roulette.sol";

contract RouletteTest is Test {
    Roulette public roulette;
    address alice = address(0x1CE); // 테스트용 사용자 주소 예시

    function setUp() public {
        roulette = new Roulette();
    }

    function testDeployment() public {
        assertTrue(address(roulette) != address(0), "Contract should be deployed");
    }

    function testSetItemsAndSpin_Basic() public {
        string[] memory itemsToSpin = new string[](3);
        itemsToSpin[0] = "Apple";
        itemsToSpin[1] = "Banana";
        itemsToSpin[2] = "Cherry";

        // 특정 사용자로 함수 호출 흉내 (선택 사항)
        // vm.prank(alice); 

        (string memory selectedItem, uint256 winningIndex) = roulette.setItemsAndSpin(itemsToSpin);

        assertTrue(bytes(selectedItem).length > 0, "Selected item should not be empty");
        assertTrue(winningIndex < itemsToSpin.length, "Winning index should be within bounds");

        string[] memory lastSpunItems = roulette.getLastSpunItems();
        assertEq(lastSpunItems.length, itemsToSpin.length, "Item count mismatch after spin");
        assertEq(lastSpunItems[0], itemsToSpin[0], "First item content mismatch"); // 순서 보장 확인
    }

    function testSetItemsAndSpin_EmptyList_ShouldFail() public {
        string[] memory emptyItems = new string[](0);
        
        // 예외 발생을 예상하는 테스트 (revert)
        vm.expectRevert("Cannot spin with an empty list of items.");
        roulette.setItemsAndSpin(emptyItems);
    }

    function testSetItemsAndSpin_Event_ItemsSetForSpin() public {
        string[] memory itemsToSpin = new string[](2);
        itemsToSpin[0] = "EventTest1";
        itemsToSpin[1] = "EventTest2";

        // ItemsSetForSpin 이벤트 발생 예상
        // vm.expectEmit(인덱싱된 파라미터 확인 여부..., 컨트랙트 주소);
        // address user, uint256 itemCount, uint256 timestamp
        vm.expectEmit(true, false, false, address(roulette)); 
        emit Roulette.ItemsSetForSpin(address(this), itemsToSpin.length, block.timestamp); // block.timestamp는 테스트 시점과 다를 수 있어 주의

        roulette.setItemsAndSpin(itemsToSpin);
        // 이벤트 테스트는 block.timestamp 때문에 정확한 값 매칭이 어려울 수 있습니다.
        // vm.recordLogs() 와 vm.getRecordedLogs() 를 사용하여 더 상세하게 확인할 수도 있습니다.
    }
    
    function testSetItemsAndSpin_Event_RouletteSpun() public {
        string[] memory itemsToSpin = new string[](1);
        itemsToSpin[0] = "SingleItem";

        // RouletteSpun 이벤트 발생 예상
        // address user, string selectedItem, uint256 winningIndex, string[] itemsUsedInSpin, uint256 timestamp
        // selectedItem, winningIndex는 랜덤이므로 정확한 값 예측 어려움
        // 여기서는 이벤트 발생 자체와 일부 예측 가능한 값(user, itemsUsedInSpin)에 초점
        vm.recordLogs(); // 로그 기록 시작
        roulette.setItemsAndSpin(itemsToSpin);
        Vm.Log[] memory entries = vm.getRecordedLogs();

        bool eventFound = false;
        bytes32 expectedTopic0 = keccak256("RouletteSpun(address,string,uint256,string[],uint256)");
        bytes32 expectedTopic1_user = bytes32(uint256(uint160(address(this)))); // msg.sender (test contract itself)

        for (uint i = 0; i < entries.length; i++) {
            if (entries[i].emitter == address(roulette) && entries[i].topics[0] == expectedTopic0 && entries[i].topics[1] == expectedTopic1_user) {
                // 추가적으로 data 디코딩하여 itemsUsedInSpin 검증 가능
                eventFound = true;
                break;
            }
        }
        assertTrue(eventFound, "RouletteSpun event not emitted or not found with correct signature/user.");
    }
}
