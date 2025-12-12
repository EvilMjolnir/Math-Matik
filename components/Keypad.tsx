
import React from 'react';
import { Delete, Check, Plus, Minus, X, Divide } from 'lucide-react';

interface KeypadProps {
  onInput: (val: number | string) => void;
  onDelete: () => void;
  onValidate: () => void;
  disabled?: boolean;
  mode?: 'number' | 'operator';
}

const Keypad: React.FC<KeypadProps> = ({ onInput, onDelete, onValidate, disabled, mode = 'number' }) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  if (mode === 'operator') {
    return (
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto mt-6">
        <button
          onClick={() => { onInput('+'); setTimeout(onValidate, 100); }}
          disabled={disabled}
          className="h-[172px] bg-emerald-200 text-emerald-900 border-2 border-emerald-600 rounded-lg text-4xl flex items-center justify-center hover:bg-emerald-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-16 h-16" />
        </button>
        <button
           onClick={() => { onInput('-'); setTimeout(onValidate, 100); }}
           disabled={disabled}
           className="h-[172px] bg-rose-200 text-rose-900 border-2 border-rose-600 rounded-lg text-4xl flex items-center justify-center hover:bg-rose-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-16 h-16" />
        </button>
        <button
           onClick={() => { onInput('×'); setTimeout(onValidate, 100); }}
           disabled={disabled}
           className="h-[172px] bg-sky-200 text-sky-900 border-2 border-sky-600 rounded-lg text-4xl flex items-center justify-center hover:bg-sky-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <X className="w-16 h-16" />
        </button>
        <button
           onClick={() => { onInput('÷'); setTimeout(onValidate, 100); }}
           disabled={disabled}
           className="h-[172px] bg-amber-200 text-amber-900 border-2 border-amber-600 rounded-lg text-4xl flex items-center justify-center hover:bg-amber-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Divide className="w-16 h-16" />
        </button>
      </div>
    );
  }

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
