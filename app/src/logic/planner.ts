import { CARB_SIDES, RECIPES } from '../data/recipes';
import { MealType, Mode, PantryItem, PlannedDay, PlannedMeal, Recipe, WeekPlan } from '../types';
import { weekStartKey } from './dates';

export const MEAL_TYPES: MealType[] = ['almusal', 'tanghalian', 'hapunan'];
const MIN_COVERAGE = 0.6;

const norm = (s: string) => s.trim().toLowerCase();

function has(pantry: PantryItem[], ingredient: string): boolean {
  const keys = ingredient.split('|');
  return pantry.some((p) => {
    const n = norm(p.name);
    return keys.some((k) => n.includes(k) || k.includes(n));
  });
}

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

function coverage(recipe: Recipe, pantry: PantryItem[]) {
  const missing = recipe.ingredients.filter((i) => !has(pantry, i)).map((i) => i.split('|')[0]);
  return { ratio: 1 - missing.length / recipe.ingredients.length, missing };
}

export function planDay(pantry: PantryItem[], mode: Mode, used: Map<string, number>): PlannedDay {
  const day = { almusal: null, tanghalian: null, hapunan: null } as PlannedDay;
  const today = new Set<string>();
  for (const meal of MEAL_TYPES) {
    const candidates = RECIPES.filter((r) => r.meals.includes(meal) && !today.has(r.id) && (mode === 'balanced' || r.carb === 'low'))
      .map((r) => ({ r, ...coverage(r, pantry) }))
      .filter((c) => c.ratio >= MIN_COVERAGE)
      .map((c) => ({ ...c, score: c.ratio * 10 - (used.get(c.r.id) ?? 0) * 3 + Math.random() }))
      .sort((a, b) => b.score - a.score);
    const pick = candidates[0];
    if (pick) {
      today.add(pick.r.id);
      used.set(pick.r.id, (used.get(pick.r.id) ?? 0) + 1);
      const m: PlannedMeal = { recipeId: pick.r.id, missing: pick.missing };
      day[meal] = m;
    }
  }
  return day;
}

export function generateWeek(pantry: PantryItem[], mode: Mode): WeekPlan {
  const used = new Map<string, number>();
  const days = Array.from({ length: 7 }, () => planDay(pantry, mode, used));
  return { weekStart: weekStartKey(), mode, days };
}

/** Rice/oats/kamote the household has on hand, if any. */
export function carbSide(pantry: PantryItem[]): string | undefined {
  return CARB_SIDES.find((c) => has(pantry, c));
}

export function carbPortion(mode: Mode): string {
  return mode === 'strict' ? '1/3 tasa' : '1/2 hanggang 3/4 tasa';
}
