export type MealType = 'almusal' | 'tanghalian' | 'hapunan';
export type Carb = 'low' | 'medium';
export type Mode = 'strict' | 'balanced';

export interface PantryItem {
  id: string;
  name: string;
  qty: string;
}

export interface GlucoseReading {
  id: string;
  value: number; // mg/dL
  context: 'fasting' | 'after-meal' | 'random';
  at: number; // epoch ms
}

export interface ExerciseEntry {
  id: string;
  activity: string;
  minutes: number;
  date: string; // YYYY-MM-DD
}

export interface Recipe {
  id: string;
  name: string;
  meals: MealType[];
  // Each ingredient is a "|"-separated list of keywords; any keyword matches.
  ingredients: string[];
  carb: Carb;
  tip?: string;
}

export interface PlannedMeal {
  recipeId: string;
  missing: string[];
}

export type PlannedDay = Record<MealType, PlannedMeal | null>;

export interface WeekPlan {
  weekStart: string;
  mode: Mode;
  days: PlannedDay[];
}
