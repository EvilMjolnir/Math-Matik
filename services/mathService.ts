import { MathProblem } from '../types';

export const generateAdditionSubtraction = (min: number, max: number): MathProblem => {
  const isAddition = Math.random() > 0.5;
  let a = Math.floor(Math.random() * (max - min + 1)) + min;
  let b = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!isAddition) {
    // Ensure positive result for simplicity in this RPG setting
    if (a < b) [a, b] = [b, a];
    return {
      question: `${a} - ${b} = ?`,
      answer: a - b,
    };
  }
  
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  };
};

export const generateMultiplication = (maxFactor: number): MathProblem => {
  const a = Math.floor(Math.random() * maxFactor) + 1;
  const b = Math.floor(Math.random() * maxFactor) + 1;
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
  };
};

export const generateDivision = (maxDividend: number): MathProblem => {
  // Ensure clean division
  const divisor = Math.floor(Math.random() * 9) + 2; // Divisor between 2 and 10
  const maxMultiplier = Math.floor(maxDividend / divisor);
  const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
  const dividend = divisor * multiplier;

  return {
    question: `${dividend} ÷ ${divisor} = ?`,
    answer: multiplier,
  };
};
