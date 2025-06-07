import React from "react";

interface SpinButtonProps {
  onSpin: () => void;
  disabled?: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onSpin, disabled }) => {
  return (
    <button
      onClick={onSpin}
      disabled={disabled}
      className="size-full px-4 py-8 text-lg sm:text-xl font-bold bg-black/90 bg-gradient-to-r hover:from-purple-700 hover:to-red-800 text-white rounded-md shadow-lg transform transition-all hover:scale-102 focus:outline-none focus:ring-4 disabled:opacity-50"
    >
      룰렛 돌리기
    </button>
  );
};

export default SpinButton;
