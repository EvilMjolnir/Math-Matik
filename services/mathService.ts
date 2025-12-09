
import { MathProblem, GameConfig } from '../types';

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

// --- FRACTION HELPERS ---

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const generateFractionProblem = (config: GameConfig['alchimie']): MathProblem => {
  // Use config to determine allowed types and max values
  const { numeratorMax, denominatorMax, ops } = config;
  
  // Pick random allowed op
  const type = ops[Math.floor(Math.random() * ops.length)];
  
  // Helpers
  const randDen = () => Math.floor(Math.random() * (denominatorMax - 1)) + 2; // Min 2
  const randNum = (max: number) => Math.floor(Math.random() * max) + 1;
  
  if (type === 'reduce') {
    // a/b = ?/?
    const den = randDen(); 
    const num = randNum(den - 1); // < den
    const factor = Math.floor(Math.random() * 3) + 2; // multiplier 2 to 4
    
    const bigNum = num * factor;
    const bigDen = den * factor;
    
    // Ensure it's reducible
    const divisor = gcd(bigNum, bigDen);
    const finalNum = bigNum / divisor;
    const finalDen = bigDen / divisor;

    return {
      question: `${bigNum}/${bigDen} = ?`,
      answer: `${finalNum}/${finalDen}`,
      type: 'fraction',
      fractionAnswer: { num: finalNum, den: finalDen }
    };
  }
  
  if (type === 'add' || type === 'sub') {
    // Simple common denominator or easy cross
    const den = randDen();
    const num1 = randNum(den * 2);
    const num2 = randNum(den * 2);
    
    if (type === 'add') {
      const resNum = num1 + num2;
      const divisor = gcd(resNum, den);
      return {
        question: `${num1}/${den} + ${num2}/${den} = ?`,
        answer: `${resNum/divisor}/${den/divisor}`,
        type: 'fraction',
        fractionAnswer: { num: resNum/divisor, den: den/divisor }
      };
    } else {
      // Subtraction (ensure positive)
      const n1 = Math.max(num1, num2);
      const n2 = Math.min(num1, num2);
      const resNum = n1 - n2;
      const divisor = gcd(resNum, den);
      return {
        question: `${n1}/${den} - ${n2}/${den} = ?`,
        answer: `${resNum/divisor}/${den/divisor}`,
        type: 'fraction',
        fractionAnswer: { num: resNum/divisor, den: den/divisor }
      };
    }
  }

  if (type === 'mult') {
    // Fraction * Whole Number
    const den = randDen();
    const num = 1; 
    
    const whole = Math.floor(Math.random() * 3 + 1) * den; // Multiples of den so it cancels out cleanly
    
    const res = (num * whole) / den;
    
    return {
      question: `${num}/${den} × ${whole} = ?`,
      answer: res, // Whole number answer
      type: 'number'
    };
  }
  
  // Default fallback if logic slips or 'compare' selected but not impl yet
  // Impl compare: > < =
  if (type === 'compare') {
      // Just generate two simple fractions
      const den = randDen();
      const num1 = randNum(den);
      const num2 = randNum(den);
      // Make sure they aren't equal for simplicity unless we want =
      // Actually let's assume answer is 1 (left bigger) or 2 (right bigger) for keypad input? 
      // Current system expects exact number or fraction. 
      // Let's fallback to reduction for now to be safe until UI supports < > =
      return generateFractionProblem({...config, ops: ['reduce']});
  }

  return generateFractionProblem({...config, ops: ['reduce']});
};
