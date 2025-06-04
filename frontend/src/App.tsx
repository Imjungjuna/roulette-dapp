import { useState } from "react";
import ItemInput from "./components/ItemInput";
import ItemList from "./components/ItemList";
import SpinButton from "./components/SpinButton";
import ResultDisplay from "./components/ResultDisplay";
import type { RouletteItem } from "./types"; // Import the type
import "./App.css";

import WalletUIButton from "./components/useWalletUI";
import { type IUseWalletUI } from "@web3auth/modal/react";
import { AuthButton } from "./components/AuthButton";

function App() {
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [newItemText, setNewItemText] = useState<string>(""); // For controlled input if needed, or manage in ItemInput
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false); // For UI feedback during spin

  const handleAddItem = (text: string) => {
    if (!text.trim()) return;
    const newItem: RouletteItem = {
      id: crypto.randomUUID(), // Simple unique ID
      text: text.trim(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    // If the deleted item was the selected one, clear selection
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
    setSelectedItem(null); // Clear previous selection

    // Simple local spin simulation with animation effect
    const spinDuration = 1000; // Total spin duration in ms
    const intervalTime = 100; // Highlight change interval in ms
    let iterations = spinDuration / intervalTime;
    let currentIndex = 0;

    const highlightInterval = setInterval(() => {
      // For now, we won't visually highlight in ItemList, just simulate the delay
      // In a real UI, you'd update a 'highlightedItemId' state and pass it to ItemList
      currentIndex = (currentIndex + 1) % items.length;
      iterations--;

      if (iterations <= 0) {
        clearInterval(highlightInterval);
        const randomIndex = Math.floor(Math.random() * items.length);
        setSelectedItem(items[randomIndex]);
        setIsSpinning(false);
      }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-3xl mb-8 flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Spin My DApp! (Local Mode)
        </h1>
        {/* Placeholder for WalletConnector or user info later */}
        <div className="w-32 h-10 bg-slate-700 rounded-md flex-row items-center justify-center text-sm text-slate-400">
          {/* <WalletUIButton/> */}
          <AuthButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        {/* Item Input */}
        <div className="mb-6">
          <ItemInput onAddItem={handleAddItem} disabled={isSpinning} />
        </div>

        {/* Item List & Spin Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-slate-700 p-4 rounded-md max-h-96 overflow-y-auto">
            <ItemList
              items={items}
              onDeleteItem={handleDeleteItem}
              isSpinning={isSpinning}
            />
          </div>
          <div className="flex flex-col justify-center items-center bg-slate-700 p-4 rounded-md">
            <SpinButton
              onSpin={handleSpin}
              disabled={isSpinning || items.length === 0}
            />
          </div>
        </div>

        {/* Result Display */}
        {isSpinning && (
          <div className="mt-8 text-center text-sky-400">
            <p className="text-xl animate-pulse">돌아가는 중...</p>
          </div>
        )}
        {selectedItem && !isSpinning && (
          <div className="mt-8">
            <ResultDisplay selectedItem={selectedItem} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mt-12 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} My Roulette DApp. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
