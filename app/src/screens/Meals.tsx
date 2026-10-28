import React from 'react';
import { Text, View } from 'react-native';
import { DAYS } from '../logic/dates';
import { carbPortion, carbSide, MEAL_TYPES, recipeById } from '../logic/planner';
import { Mode, PantryItem, PlannedDay, WeekPlan } from '../types';
import { Btn, C, Card, H, s } from '../ui';

const LABEL = { almusal: 'Almusal', tanghalian: 'Tanghalian', hapunan: 'Hapunan' };

export function DayMeals({ day, pantry, mode }: { day: PlannedDay; pantry: PantryItem[]; mode: Mode }) {
  const side = carbSide(pantry);
  return (
    <View>
      {MEAL_TYPES.map((m) => {
        const p = day[m];
        const r = p && recipeById(p.recipeId);
        return (
          <View key={m} style={{ marginBottom: 10 }}>
            <Text style={[s.muted, { fontWeight: '700' }]}>{LABEL[m].toUpperCase()}</Text>
            {r && p ? (
              <>
                <Text style={s.body}>{r.name}</Text>
                {r.carb === 'medium' && <Text style={s.muted}>Medium-carb · hinay sa kanin/carbs</Text>}
                {!!r.tip && <Text style={s.muted}>{r.tip}</Text>}
                {p.missing.length > 0 && <Text style={{ color: C.warn, fontSize: 13 }}>Kulang: {p.missing.join(', ')}</Text>}
              </>
            ) : (
              <Text style={s.muted}>Walang swak sa stock ninyo. Dagdagan ang pantry.</Text>
            )}
          </View>
        );
      })}
      {side && <Text style={s.muted}>Carb portion kada kain: {carbPortion(mode)} ({side}).</Text>}
    </View>
  );
}

export default function Meals({ plan, pantry, onGenerate, today }: { plan: WeekPlan | null; pantry: PantryItem[]; onGenerate: () => void; today: number }) {
  return (
    <View>
      <H>Weekly Meal Plan</H>
      <Btn title={plan ? 'Gumawa ulit ng plan' : 'Gumawa ng plan'} onPress={onGenerate} disabled={pantry.length === 0} />
      {pantry.length === 0 && <Text style={[s.muted, { marginTop: 8 }]}>Magdagdag muna ng laman sa Pantry.</Text>}
      <View style={{ height: 12 }} />
      {plan?.days.map((d, i) => (
        <Card key={i} style={i === today ? { borderColor: C.primary, borderWidth: 2 } : undefined}>
          <Text style={[s.body, { fontWeight: '800', marginBottom: 8 }]}>{DAYS[i]}{i === today ? ' (ngayon)' : ''}</Text>
          <DayMeals day={d} pantry={pantry} mode={plan.mode} />
        </Card>
      ))}
    </View>
  );
}
