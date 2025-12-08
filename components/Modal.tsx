import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  isOpen: boolean;
  colorClass?: string;
  isButtonOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, children, actionLabel, onAction, isOpen, colorClass = "bg-parchment-200", isButtonOutside = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className={`relative w-full p-6 rounded-lg shadow-2xl border-4 border-parchment-800 ${colorClass} text-parchment-900`}>
          <h2 className="text-3xl font-serif font-bold text-center mb-4 border-b-2 border-parchment-800 pb-2">
            {title}
          </h2>
          <div className="mb-4 text-center text-lg font-serif">
            {children}
          </div>
          
          {!isButtonOutside && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onAction}
                className="px-8 py-3 bg-parchment-800 text-parchment-100 font-serif font-bold text-xl rounded hover:bg-parchment-900 transition-colors border-2 border-yellow-600 shadow-md"
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>

        {isButtonOutside && (
          <div className="mt-8">
             <button
                onClick={onAction}
                className="px-12 py-4 bg-parchment-200 text-parchment-900 font-serif font-bold text-2xl rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95 border-4 border-parchment-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                {actionLabel}
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;