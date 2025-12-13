
import { useEffect } from 'react';

interface UseKeyboardInputProps {
  onInput: (val: number | string) => void;
  onDelete: () => void;
  onValidate: () => void;
  disabled?: boolean;
}

export const useKeyboardInput = ({ onInput, onDelete, onValidate, disabled = false }: UseKeyboardInputProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      // Numbers 0-9
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault(); // Prevent scrolling if space is hit (though regex excludes space)
        onInput(parseInt(e.key));
        return;
      }

      // Operators (for Boss Mode) - Normalize to game symbols
      if (e.key === '+') { onInput('+'); return; }
      if (e.key === '-') { onInput('-'); return; }
      if (e.key === '*' || e.key === 'x' || e.key === 'X') { onInput('×'); return; }
      if (e.key === '/') { e.preventDefault(); onInput('÷'); return; }

      // Controls
      if (e.key === 'Enter') {
        e.preventDefault();
        onValidate();
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault(); // Prevent browser back navigation in some contexts
        onDelete();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput, onDelete, onValidate, disabled]);
};
