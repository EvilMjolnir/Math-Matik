import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  isOpen: boolean;
  colorClass?: string;
}

const Modal: React.FC<ModalProps> = ({ title, children, actionLabel, onAction, isOpen, colorClass = "bg-parchment-200" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-2xl border-4 border-parchment-800 ${colorClass} text-parchment-900`}>
        <h2 className="text-3xl font-serif font-bold text-center mb-4 border-b-2 border-parchment-800 pb-2">
          {title}
        </h2>
        <div className="mb-8 text-center text-lg font-serif">
          {children}
        </div>
        <div className="flex justify-center">
          <button
            onClick={onAction}
            className="px-8 py-3 bg-parchment-800 text-parchment-100 font-serif font-bold text-xl rounded hover:bg-parchment-900 transition-colors border-2 border-yellow-600"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
