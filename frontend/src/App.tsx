import { useState, useEffect, useRef } from "react"; // useEffect와 useRef를 import 합니다.
import ItemInput from "./components/ItemInput";
import ItemList from "./components/ItemList";
import SpinButton from "./components/SpinButton";
import ResultDisplay from "./components/ResultDisplay";
import type { RouletteItem } from "./types";
import "./App.css";
import { AuthButton } from "./components/AuthButton";

function App() {
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null); // 애니메이션 프레임 ID를 저장하기 위한 ref

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

  // 컴포넌트가 언마운트될 때 진행 중인 애니메이션 프레임 요청을 정리합니다.
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-0 sm:p-8">
      <header className="pt-10 sm:pt-0 w-full max-w-4xl flex justify-around sm:justify-between my-6 md:my-8 items-center">
        <h1 className="pl-4 md:pl-6 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          할일 정하기 룰렛! 뭘 할지 고민된다면..
        </h1>
        <h1 className="hidden absolute pl-4 md:pl-6 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          투두리스트 룰렛, 투두 룰렛
        </h1>
        <div className="sm:w-32 w-20 mr-2 md:mr-4 h-10 hover:scale-101 transition transform bg-slate-700 hover:cursor-pointer rounded-md flex flex-row items-center justify-center text-sm text-slate-400">
          <AuthButton />
        </div>
      </header>

      <main className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-3 sm:p-8 mt-6">
        <div className="mb-6 md:mb-10">
          <ItemInput onAddItem={handleAddItem} disabled={isSpinning} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-slate-700 py-4 p-3 sm:p-4 rounded-md min-h-40">
            <ItemList
              items={items}
              onDeleteItem={handleDeleteItem}
              isSpinning={isSpinning}
              highlightedItemId={highlightedItemId}
            />
          </div>
          <div className="flex bg-slate-700 p-3 rounded-md">
            <SpinButton
              onSpin={handleSpin}
              disabled={isSpinning || items.length === 0}
            />
          </div>
        </div>

        {isSpinning && (
          <div className="mt-8 text-center text-purple-500">
            <p className="text-lg md:text-xl font-semibold animate-pulse">
              돌아가는 중...
            </p>
          </div>
        )}
        {selectedItem && !isSpinning && (
          <div className="mt-8">
            <ResultDisplay selectedItem={selectedItem} />
          </div>
        )}
      </main>

      <footer className="absolute w-full bottom-8 max-w-3xl text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} My Roulette DApp. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
