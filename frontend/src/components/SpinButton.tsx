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
      className="w-full h-full px-8 py-12 text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-md shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      룰렛 돌리기!
    </button>
  );
};

export default SpinButton;
