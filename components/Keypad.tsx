
import React from 'react';
import { Delete, Check, Plus, Minus, X, Divide } from 'lucide-react';

interface KeypadProps {
  onInput: (val: number | string) => void;
  onDelete: () => void;
  onValidate: () => void;
  disabled?: boolean;
  mode?: 'number' | 'operator';
  compact?: boolean;
  centered?: boolean;
  children?: React.ReactNode;
}

const Keypad: React.FC<KeypadProps> = ({ 
  onInput, 
  onDelete, 
  onValidate, 
  disabled, 
  mode = 'number',
  compact = false,
  centered = false,
  children
}) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const getButtonClass = (baseColor: string) => `
    ${compact ? 'h-14 text-2xl' : 'h-20 text-3xl'} 
    font-serif font-bold rounded-lg shadow-md transition-all
    ${baseColor} active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    border-2
  `;

  const renderButtons = () => {
      if (mode === 'operator') {
        return (
          <>
            <button
              onClick={() => { onInput('+'); setTimeout(onValidate, 100); }}
              disabled={disabled}
              className={`${compact ? 'h-[128px]' : 'h-[172px]'} bg-emerald-200 text-emerald-900 border-emerald-600 rounded-lg text-4xl flex items-center justify-center hover:bg-emerald-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <Plus className={compact ? "w-12 h-12" : "w-16 h-16"} />
            </button>
            <button
               onClick={() => { onInput('-'); setTimeout(onValidate, 100); }}
               disabled={disabled}
               className={`${compact ? 'h-[128px]' : 'h-[172px]'} bg-rose-200 text-rose-900 border-rose-600 rounded-lg text-4xl flex items-center justify-center hover:bg-rose-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <Minus className={compact ? "w-12 h-12" : "w-16 h-16"} />
            </button>
            <button
               onClick={() => { onInput('×'); setTimeout(onValidate, 100); }}
               disabled={disabled}
               className={`${compact ? 'h-[128px]' : 'h-[172px]'} bg-sky-200 text-sky-900 border-sky-600 rounded-lg text-4xl flex items-center justify-center hover:bg-sky-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <X className={compact ? "w-12 h-12" : "w-16 h-16"} />
            </button>
            <button
               onClick={() => { onInput('÷'); setTimeout(onValidate, 100); }}
               disabled={disabled}
               className={`${compact ? 'h-[128px]' : 'h-[172px]'} bg-amber-200 text-amber-900 border-amber-600 rounded-lg text-4xl flex items-center justify-center hover:bg-amber-100 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <Divide className={compact ? "w-12 h-12" : "w-16 h-16"} />
            </button>
          </>
        );
      }

      return (
        <>
          {keys.map((num) => (
            <button
              key={num}
              onClick={() => onInput(num)}
              disabled={disabled}
              className={`
                ${getButtonClass('bg-parchment-300 text-parchment-900 hover:bg-parchment-200 border-parchment-800')}
                ${num === 0 ? 'col-start-2' : ''}
              `}
            >
              {num}
            </button>
          ))}
          <button
            onClick={onDelete}
            disabled={disabled}
            className={`col-start-1 row-start-4 flex items-center justify-center ${getButtonClass('bg-red-800/90 text-parchment-100 border-red-900 hover:bg-red-700')}`}
          >
            <Delete className={compact ? "w-6 h-6" : "w-8 h-8"} />
          </button>
          <button
            onClick={onValidate}
            disabled={disabled}
            className={`col-start-3 row-start-4 flex items-center justify-center ${getButtonClass('bg-green-700 text-parchment-100 border-green-900 hover:bg-green-600')}`}
          >
            <Check className={compact ? "w-8 h-8" : "w-10 h-10"} />
          </button>
        </>
      );
  };

  const scaleClass = compact 
    ? (centered ? 'scale-[0.8] origin-center' : 'scale-[0.8] origin-bottom') 
    : '';

  if (centered) {
      return (
        <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-parchment-900/95 p-6 rounded-2xl border-4 border-amber-600 shadow-[0_0_50px_rgba(0,0,0,0.9)] w-full max-w-sm flex flex-col gap-6 transition-all duration-300 ${scaleClass}`}>
            {children && (
                <div className="w-full">
                    {children}
                </div>
            )}
            <div className={`grid gap-3 w-full ${mode === 'operator' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {renderButtons()}
            </div>
        </div>
      );
  }

  return (
    <div className={`grid gap-3 w-full max-w-sm mx-auto mt-6 ${scaleClass} ${mode === 'operator' ? 'grid-cols-2' : 'grid-cols-3'}`}>
      {renderButtons()}
    </div>
  );
};

export default Keypad;
