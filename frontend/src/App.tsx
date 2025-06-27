import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import ItemInput from "./components/ItemInput";
import ItemList from "./components/ItemList";
import SpinButton from "./components/SpinButton";
import ResultDisplay from "./components/ResultDisplay";
import SpinResultCard from "./components/SpinResultCard";
import type { RouletteItem } from "./types";
import "./App.css";

function App() {
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null); // 애니메이션 프레임 ID를 저장하기 위한 ref

  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (text: string) => {
    if (!text.trim()) return;
    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleSpin = () => {
    if (items.length === 0) {
      alert("룰렛에 아이템을 추가해주세요!");
      return;
    }

    setIsSpinning(true);
    setSelectedItem(null);
    // highlightedItemId는 애니메이션 첫 프레임에서 설정됩니다.

    const totalDuration = 5000; // 총 애니메이션 시간: 5초
    const finalWinnerIndex = Math.floor(Math.random() * items.length);
    const finalWinnerItem = items[finalWinnerIndex]; // 최종 선택될 아이템 객체

    const animationStartTime = Date.now();

    // 이징 함수 (t: 진행률 0~1, 끝으로 갈수록 느려짐)
    const easeOutQuad = (t: number): number => 1 - Math.pow(1 - t, 2);

    function animate() {
      const timeElapsed = Date.now() - animationStartTime;
      let progress = timeElapsed / totalDuration;

      if (progress >= 1) {
        progress = 1; // 애니메이션 종료 시점에서는 진행률을 1로 고정
      }

      // 아이템 수에 따라 최소 회전 수를 동적으로 조절 (예시)
      // 아이템이 1개일 때는 의미가 없지만, 최소 2개부터 동작합니다.
      // items.length가 0인 경우는 함수 시작 시점에서 이미 처리됩니다.
      let baseSpins;
      if (items.length <= 3) {
        baseSpins = 10;
      } else if (items.length <= 5) {
        baseSpins = 8;
      } else if (items.length <= 8) {
        baseSpins = 6;
      } else if (items.length <= 12) {
        baseSpins = 4;
      } else {
        baseSpins = 2;
      }
      // 아이템 5개당 약 0.5바퀴 추가
      const dynamicSpins = Math.floor(items.length / 10);
      const numberOfFullSpins = baseSpins + dynamicSpins;

      // virtualTotalSteps % items.length = finalWinnerIndex
      const virtualTotalSteps =
        items.length * numberOfFullSpins + finalWinnerIndex;

      const easedProgress = easeOutQuad(progress);
      const currentVirtualStep = easedProgress * virtualTotalSteps;

      const currentHighlightArrayIndex =
        Math.floor(currentVirtualStep) % items.length;

      if (items[currentHighlightArrayIndex]) {
        setHighlightedItemId(items[currentHighlightArrayIndex].id);
      }

      if (progress === 1) {
        setHighlightedItemId(finalWinnerItem.id);
        setSelectedItem(finalWinnerItem);
        setIsSpinning(false);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
        return;
      }

      // 다음 프레임 요청
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    // 만약 이전 애니메이션 프레임 요청이 있었다면 취소합니다 (안전 장치).
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animate();
  };

  const handleMouseEnterSidebar = () => {
    document.body.style.overflow = "hidden";
    console.log(
      "HTMLDivElement looks like this: ",
      sidebarContainerRef.current
    );
    if (sidebarContainerRef.current) {
      console.log(
        "Sidebar container wibdth:",
        sidebarContainerRef.current.offsetWidth
      );
    }
  };

  const handleMouseLeaveSidebar = () => {
    document.body.style.overflow = "unset";
    if (sidebarContainerRef.current) {
      console.log(
        "Sidebar container width:",
        sidebarContainerRef.current.offsetWidth
      );
    }
  };

  const handleSidebarTransitionEnd = () => {
    if (sidebarContainerRef.current) {
      console.log(
        "Sidebar container TRANSITION ENDED. Final width:",
        sidebarContainerRef.current.offsetWidth
      );
    }
  };

  // 컴포넌트가 언마운트될 때 진행 중인 애니메이션 프레임 요청을 정리합니다.
  useEffect(() => {
    // if (sidebarContainerRef.current) {
    //   console.log(
    //     "Sidebar container width:",
    //     sidebarContainerRef.current.offsetWidth
    //   );
    // }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="min-h-screen fixed bg-white text-slate-100 flex flex-col items-center p-0">
      {/* 사이드바 컨테이너: 메뉴 버튼 포함, 구조 개선 안되나? */}
      <div className="fixed top-6 left-4 size-11 z-1000 peer/menuicon group hover:cursor-pointer bg-transparent">
        <div
          onMouseEnter={handleMouseEnterSidebar}
          className="absolute flex size-full  bg-transparent items-center justify-center z-200"
        >
          <Menu size="20" strokeWidth={2} color="black" />
        </div>
        <div className="absolute size-full z-100 rounded-full group-hover:opacity-60 opacity-0 bg-gray-300  duration-200 transform transition"></div>
      </div>
      <div
        key={"wrapper-for-scroll-ref"}
        ref={sidebarContainerRef}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
        onTransitionEnd={handleSidebarTransitionEnd}
        className="transition-all -translate-x-full md:translate-x-0 fixed top-0 bottom-0 left-0 hidden md:block delay-100 duration-300 ease-out h-screen w-18 md:peer-hover/menuicon:w-[272px] md:hover:w-[272px] bg-gray-200 "
      ></div>

      {/* 헤더 영역: 메뉴 버튼은 사이드바에 포함 */}
      <header className="w-[100vw] items-start flex max-w-4xl h-15">
        <h1 className="pt-7 pl-15 w-fit text-2xl font-bold text-black">
          할 일 정하기 룰렛
        </h1>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="relative w-screen h-[calc(100vh-60px)] bg-white p-5 sm:p-8 mt-6">
        {/* 목록 입력 전에 보여주는 안내 문구 */}
        {items.length === 0 && (
          <div className="fixed inset-0">
            <div className="w-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[32px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              뭘 할지 고민된다면..
            </div>
          </div>
        )}

        {/* 아이템 리스트 */}
        <div className="w-full min-h-40 max-h-124 overflow-y-auto overflow-x-visible">
          <ItemList
            items={items}
            onDeleteItem={handleDeleteItem}
            isSpinning={isSpinning}
            highlightedItemId={highlightedItemId}
          />
        </div>

        {/* 룰렛 돌리기 버튼. 돌리기 전, 돌리는 중, 돌린 이후 3가지 상태에 따라 다른 ui가 보여져야 함 */}
        <div className="absolute bottom-42 left-0 right-0 bg-transparent rounded-md flex justify-center">
          {/* w-full 하면 인접한 relative 부모 기준으로 100%의 너비가 설정되어야 하는 것 아닌가? 실제로는 오른쪽으로 삐져나감 */}

          {items.length > 0 && (
            <SpinButton
              onSpin={handleSpin}
              disabled={isSpinning || items.length === 0}
            />
          )}
        </div>

        {/* {selectedItem && !isSpinning && (
          <div className="mt-8">
            <ResultDisplay selectedItem={selectedItem} />
          </div>
        )} */}
        {/* <div className="mt-8">
          <SpinResultCard />
        </div> */}

        {/* 아이템 입력 인풋 */}
        <div className="absolute bottom-16 w-full left-0 right-0 px-5">
          <ItemInput onAddItem={handleAddItem} disabled={isSpinning} />
        </div>
      </main>
      {/* <footer className="absolute w-full bottom-8 max-w-3xl text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} My Roulette DApp. All rights
          reserved.
        </p>
      </footer> */}
    </div>
  );
}

export default App;
