import React from 'react';
import { Text, View } from 'react-native';
import { assess, latest } from '../logic/glucose';
import { DAYS } from '../logic/dates';
import { ExerciseEntry, GlucoseReading, Mode, PantryItem, WeekPlan } from '../types';
import { Bar, C, Card, H, s } from '../ui';
import { DayMeals } from './Meals';
import { minutesToday } from './Exercise';

export default function Today({ plan, pantry, readings, entries, goal, mode, today }: {
  plan: WeekPlan | null; pantry: PantryItem[]; readings: GlucoseReading[]; entries: ExerciseEntry[]; goal: number; mode: Mode; today: number;
}) {
  const last = latest(readings);
  const a = last && assess(last);
  const done = minutesToday(entries);
  return (
    <View>
      <H>{DAYS[today]}</H>
      <Card>
        <Text style={s.muted}>Huling glucose</Text>
        {last && a ? (
          <>
            <Text style={{ fontSize: 28, fontWeight: '800', color: a.level === 'normal' ? C.good : a.level === 'high' || a.level === 'urgent' ? C.bad : C.warn }}>{last.value} mg/dL · {a.label}</Text>
            <Text style={s.body}>{a.advice}</Text>
          </>
        ) : (
          <Text style={s.body}>Wala pang reading. I-log sa Glucose tab.</Text>
        )}
        <Text style={[s.muted, { marginTop: 8 }]}>
          Mode ngayon: {mode === 'strict' ? 'Low-carb lang (dahil mataas ang huling reading)' : 'Balanced'}
        </Text>
      </Card>
      <Card>
        <Text style={s.muted}>Kainin ngayon</Text>
        <View style={{ height: 8 }} />
        {plan ? <DayMeals day={plan.days[today]} pantry={pantry} mode={mode} /> : <Text style={s.body}>Gumawa muna ng plan sa Meals tab.</Text>}
      </Card>
      <Card>
        <Text style={s.body}>Exercise: {done} / {goal} min</Text>
        <View style={{ height: 8 }} />
        <Bar ratio={done / goal} />
      </Card>
    </View>
  );
}
