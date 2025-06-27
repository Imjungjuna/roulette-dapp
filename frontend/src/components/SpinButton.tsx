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
      className="size-full w-50 h-17 text-[20px] font-bold bg-[#6A9BF7] text-white rounded-full shadow-lg"
    >
      {disabled ? "당신의 운명은?" : "존나 돌리기"}
    </button>
  );
};

export default SpinButton;
