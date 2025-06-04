// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "forge-std/console.sol"; // 테스트 중 로그 출력에 유용

contract Roulette {
    string[] public currentRouletteItems; // 현재 스핀에 사용된 아이템 목록
    address public lastSpinner;          // 마지막으로 룰렛을 돌린 사용자

    // 이벤트 정의
    event ItemsSetForSpin(address indexed user, uint256 itemCount, uint256 timestamp);
    event RouletteSpun(
        address indexed user,
        string selectedItem,
        uint256 winningIndex,
        string[] itemsUsedInSpin, // 스핀에 사용된 전체 아이템 목록
        uint256 timestamp
    );

    constructor() {
        // console.log("Roulette contract deployed by:", msg.sender);
    }

    /**
     * @notice 새로운 아이템 목록을 설정하고 즉시 룰렛을 돌립니다.
     * @param _newItems 이번 스핀에 사용할 아이템들의 배열
     * @return selectedItem 선택된 아이템
     * @return winningIndex 선택된 아이템의 인덱스
     */
    function setItemsAndSpin(string[] memory _newItems)
        public
        returns (string memory selectedItem, uint256 winningIndex)
    {
        require(_newItems.length > 0, "Cannot spin with an empty list of items.");
        // 간단한 아이템 수 제한 (가스비 및 블록 가스 한도 고려)
        require(_newItems.length < 100, "Item limit (99) exceeded for this spin."); 

        currentRouletteItems = _newItems; // 새 아이템 목록으로 덮어쓰기
        lastSpinner = msg.sender;

        emit ItemsSetForSpin(msg.sender, _newItems.length, block.timestamp);

        // 간단한 랜덤 로직 (테스트넷용, 실제 운영 환경에서는 Chainlink VRF 권장)
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, currentRouletteItems.length))
        ) % currentRouletteItems.length;

        selectedItem = currentRouletteItems[randomIndex];
        winningIndex = randomIndex;

        // 스핀 결과 이벤트 발생
        emit RouletteSpun(msg.sender, selectedItem, winningIndex, currentRouletteItems, block.timestamp);

        return (selectedItem, winningIndex);
    }

    /**
     * @notice 마지막 스핀에 사용된 아이템 목록을 반환합니다.
     */
    function getLastSpunItems() public view returns (string[] memory) {
        return currentRouletteItems;
    }
}
