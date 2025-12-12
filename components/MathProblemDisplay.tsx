
import React from 'react';
import { MathProblem } from '../types';

interface MathProblemDisplayProps {
  problem: MathProblem;
  userInput: string;
  isVertical?: boolean;
}

const MathProblemDisplay: React.FC<MathProblemDisplayProps> = ({ problem, userInput, isVertical = false }) => {
  // If not vertical, or if it's a fraction/operator type that we don't handle vertically nicely yet
  if (!isVertical || problem.type === 'fraction') {
    return (
      <div className="text-5xl font-serif font-bold text-parchment-900 mb-4 text-center">
        {problem.question}
      </div>
    );
  }

  // Parse the question string: "5 + 3 = ?" or "? + 3 = 8"
  // Regex to capture operands, operator, and result
  const match = problem.question.match(/^(\?|[\d]+)\s*([+\-×÷])\s*(\?|[\d]+)\s*=\s*(\?|[\d]+)$/);

  if (!match) {
    // Fallback if regex fails (shouldn't happen with standard generation)
    return (
        <div className="text-5xl font-serif font-bold text-parchment-900 mb-4 text-center">
          {problem.question}
        </div>
    );
  }

  const [_, top, op, bottom, result] = match;

  // Determine what to display in each slot.
  // If a slot is '?', we replace it with userInput (or empty if userInput is empty).
  // Otherwise we show the number.
  
  const displayTop = top === '?' ? (userInput || '?') : top;
  const displayBottom = bottom === '?' ? (userInput || '?') : bottom;
  // Operator Mode: If op is missing (not captured well or special case), we might need logic, but current regex expects op.
  // Note: Boss operator questions might be "5 ? 3 = 8". The regex above expects an op char.
  // Let's adjust for Operator Mode "5 ? 3 = 8".
  
  const displayOp = op; // If op is '?', handled below? Actually generateBossProblem returns '?' as symbol in string.
  
  // Special check for Hidden Operator mode: "5 ? 3 = 8"
  const opMatch = problem.question.match(/^(\?|[\d]+)\s*(\?|[+\-×÷])\s*(\?|[\d]+)\s*=\s*(\?|[\d]+)$/);
  
  let finalTop = top;
  let finalOp = op;
  let finalBottom = bottom;
  let finalResult = result;

  if (opMatch) {
      [, finalTop, finalOp, finalBottom, finalResult] = opMatch;
  }

  const renderValue = (val: string, isOp: boolean = false) => {
      const isInputSlot = val === '?';
      const content = isInputSlot ? (userInput || '?') : val;
      
      return (
          <span className={`${isInputSlot ? 'text-parchment-600 border-b-2 border-dashed border-parchment-500 min-w-[1ch] inline-block text-center' : ''}`}>
              {content}
          </span>
      );
  };

  return (
    <div className="flex flex-col items-end text-6xl font-serif font-bold text-parchment-900 mb-4 mx-auto w-fit">
        {/* Top Number */}
        <div className="mb-2 pr-4">
            {renderValue(finalTop)}
        </div>
        
        {/* Operator + Bottom Number */}
        <div className="flex items-center justify-end w-full border-b-4 border-parchment-900 pb-2 mb-2">
            <span className="mr-6">{renderValue(finalOp, true)}</span>
            <span className="pr-4">{renderValue(finalBottom)}</span>
        </div>

        {/* Result */}
        <div className="pr-4">
            {renderValue(finalResult)}
        </div>
    </div>
  );
};

export default MathProblemDisplay;
