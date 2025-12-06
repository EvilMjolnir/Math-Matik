
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
      type: 'number'
    };
  }
  
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
    type: 'number'
  };
};

export const generateMultiplication = (maxFactor: number): MathProblem => {
  const a = Math.floor(Math.random() * maxFactor) + 1;
  const b = Math.floor(Math.random() * maxFactor) + 1;
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
    type: 'number'
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
    type: 'number'
  };
};

export const generateBossProblem = (difficulty: number): MathProblem => {
  const types = ['addition', 'subtraction', 'multiplication', 'division'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  // Decide what to hide: 0 = operand A, 1 = operand B, 2 = operator
  const hiddenPart = Math.floor(Math.random() * 3); 
  
  let a = 0, b = 0, result = 0, opSymbol = '';
  
  // Setup numbers based on operation
  if (type === 'addition') {
    a = Math.floor(Math.random() * (difficulty * 2)) + 1;
    b = Math.floor(Math.random() * (difficulty * 2)) + 1;
    result = a + b;
    opSymbol = '+';
  } else if (type === 'subtraction') {
    b = Math.floor(Math.random() * (difficulty * 2)) + 1;
    result = Math.floor(Math.random() * (difficulty * 2)) + 1;
    a = result + b;
    opSymbol = '-';
  } else if (type === 'multiplication') {
    a = Math.floor(Math.random() * difficulty) + 1;
    b = Math.floor(Math.random() * difficulty) + 1;
    result = a * b;
    opSymbol = '×';
  } else if (type === 'division') {
    b = Math.floor(Math.random() * 9) + 2;
    result = Math.floor(Math.random() * difficulty) + 1;
    a = b * result;
    opSymbol = '÷';
  }

  // Construct Question
  if (hiddenPart === 0) {
    return {
      question: `? ${opSymbol} ${b} = ${result}`,
      answer: a,
      type: 'number'
    };
  } else if (hiddenPart === 1) {
     return {
      question: `${a} ${opSymbol} ? = ${result}`,
      answer: b,
      type: 'number'
    };
  } else {
    // Hidden Operator
    return {
      question: `${a} ? ${b} = ${result}`,
      answer: opSymbol,
      type: 'operator'
    };
  }
};
