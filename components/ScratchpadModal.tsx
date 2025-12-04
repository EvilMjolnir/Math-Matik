
import React from 'react';
import DrawingCanvas from './DrawingCanvas';
import { useLocalization } from '../localization';
import { PencilLine, X } from 'lucide-react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLocalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl h-[80vh] bg-parchment-100 rounded-lg shadow-2xl border-4 border-parchment-800 flex flex-col">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguZxCB_ZgeWOwZbDYUIYGWD-jzW-y4X1V_0RXy6fKJdbOOSbAGu7DsGaE2nPXN3aEbD1oVPJsZbjZZE7aIAE7eJ0rzQGoA2ssK8UHkFhqg4y-Pc_PUaBTGnajfBqLNVBX43xORYIh4vQ/s1600/Seamless+white+crease+paper+texture.jpg')] mix-blend-multiply rounded-lg"></div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-parchment-300 relative z-10">
          <h2 className="text-2xl font-serif font-bold text-parchment-900 flex items-center">
            <PencilLine className="w-6 h-6 mr-2 text-parchment-700" />
            {t.titles.scratchpad}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-parchment-300 rounded-full transition-colors text-parchment-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Canvas Body */}
        <div className="flex-1 p-4 relative z-10">
           <DrawingCanvas />
        </div>
      </div>
    </div>
  );
};

export default ScratchpadModal;
