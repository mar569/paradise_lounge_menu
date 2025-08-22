import type { JSX } from 'react';

// types.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  level: number;
  cashback: number;
  visitsRequired: number;
  amountRequired: number;
  bonusPoints: number;
  icon: JSX.Element;
  gradientColors: string;
  achieved: boolean;
  achievedAt?: string;
}
