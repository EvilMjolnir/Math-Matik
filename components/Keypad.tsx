import React from 'react';
import { Delete, Check } from 'lucide-react';

interface KeypadProps {
  onInput: (val: number) => void;
  onDelete: () => void;
  onValidate: () => void;
  disabled?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onInput, onDelete, onValidate, disabled }) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto mt-6">
      {keys.map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          disabled={disabled}
          className={`
            h-20 text-3xl font-serif font-bold rounded-lg shadow-md transition-all
            ${num === 0 ? 'col-start-2' : ''}
            bg-parchment-300 text-parchment-900 hover:bg-parchment-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
            border-2 border-parchment-800
          `}
        >
          {num}
        </button>
      ))}
      <button
        onClick={onDelete}
        disabled={disabled}
        className="col-start-1 row-start-4 h-20 flex items-center justify-center bg-red-800/90 text-parchment-100 rounded-lg border-2 border-red-900 hover:bg-red-700 active:scale-95 disabled:opacity-50"
      >
        <Delete className="w-8 h-8" />
      </button>
      <button
        onClick={onValidate}
        disabled={disabled}
        className="col-start-3 row-start-4 h-20 flex items-center justify-center bg-green-700 text-parchment-100 rounded-lg border-2 border-green-900 hover:bg-green-600 active:scale-95 disabled:opacity-50"
      >
        <Check className="w-10 h-10" />
      </button>
    </div>
  );
};

export default Keypad;