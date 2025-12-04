
import React, { useRef, useEffect, useState } from 'react';
import { Eraser } from 'lucide-react';
import { useLocalization } from '../localization';

const DrawingCanvas: React.FC = () => {
  const { t } = useLocalization();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // We need to set the internal resolution to match the display size
    // to prevent blurriness and allow proper drawing coordinates
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (context) {
      context.lineCap = 'round';
      context.strokeStyle = '#4a4a4a'; // Pencil Gray
      context.lineWidth = 3;
      contextRef.current = context;
    }
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    // Prevent scrolling on touch devices
    if(nativeEvent.type === 'touchstart') {
       // Note: preventDefault might block scroll entirely in the modal, which is desired for the canvas area
       // But we handle coordinates manually below.
    }

    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
    }
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) {
      return;
    }
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const getCoordinates = (event: MouseEvent | TouchEvent): { offsetX: number; offsetY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    if (event instanceof MouseEvent) {
      return {
        offsetX: event.offsetX,
        offsetY: event.offsetY
      };
    } else if (window.TouchEvent && event instanceof TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }
    return { offsetX: 0, offsetY: 0 };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 border-2 border-dashed border-parchment-400 bg-white/50 rounded-lg overflow-hidden touch-none relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
          className="w-full h-full block"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button 
          onClick={clearCanvas}
          className="flex items-center px-4 py-2 bg-parchment-300 hover:bg-parchment-400 text-parchment-800 rounded font-serif font-bold shadow-sm transition-colors"
        >
          <Eraser className="w-5 h-5 mr-2" />
          {t.buttons.clear}
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
