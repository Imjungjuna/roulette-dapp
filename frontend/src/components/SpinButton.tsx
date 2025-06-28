import React from "react";

interface SpinButtonProps {
  onSpin: () => void;
  disabled?: boolean;
  isSpun: boolean;
  isSpinning: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({
  onSpin,
  disabled,
  isSpinning,
  isSpun,
}) => {
  const buttonText = isSpun ? "다시 돌리기" : "겁나 돌리기";

  return (
    <button
      onClick={onSpin}
      disabled={disabled}
      className="w-45 h-full text-[20px] font-bold bg-[#6A9BF7] text-white rounded-full shadow-lg"
    >
      {isSpinning ? "당신의 운명은?" : buttonText}
    </button>
  );
};

export default SpinButton;
