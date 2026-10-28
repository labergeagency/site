import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { dateKey } from '../logic/dates';
import { ExerciseEntry } from '../types';
import { uid } from '../storage';
import { Bar, Btn, C, Card, Chip, H, Input, s } from '../ui';

const QUICK = ['Lakad', 'Jogging', 'Zumba', 'Bike', 'Strength', 'Stretching'];

export function minutesToday(entries: ExerciseEntry[]) {
  const t = dateKey();
  return entries.filter((e) => e.date === t).reduce((n, e) => n + e.minutes, 0);
}

export function streak(entries: ExerciseEntry[], goal: number) {
  const byDay = new Map<string, number>();
  entries.forEach((e) => byDay.set(e.date, (byDay.get(e.date) ?? 0) + e.minutes));
  let n = 0;
  const d = new Date();
  if ((byDay.get(dateKey(d)) ?? 0) < goal) d.setDate(d.getDate() - 1); // today may still be in progress
  while ((byDay.get(dateKey(d)) ?? 0) >= goal) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export default function Exercise({ entries, setEntries, goal, setGoal }: {
  entries: ExerciseEntry[]; setEntries: (f: (p: ExerciseEntry[]) => ExerciseEntry[]) => void; goal: number; setGoal: (n: number) => void;
}) {
  const [activity, setActivity] = useState('Lakad');
  const [minutes, setMinutes] = useState('');
  const done = minutesToday(entries);
  const hit = done >= goal;

  const add = () => {
    const m = parseInt(minutes, 10);
    if (!m || m <= 0 || m > 600) return;
    setEntries((p) => [{ id: uid(), activity: activity.trim() || 'Exercise', minutes: m, date: dateKey() }, ...p]);
    setMinutes('');
  };

  return (
    <View>
      <H>Exercise</H>
      <Card>
        <Text style={s.body}>{done} / {goal} minuto ngayon {hit ? '🎉' : ''}</Text>
        <View style={{ height: 8 }} />
        <Bar ratio={done / goal} color={hit ? C.good : C.primary} />
        <Text style={[s.muted, { marginTop: 8 }]}>Streak: {streak(entries, goal)} araw</Text>
        <View style={[s.row, { marginTop: 12, justifyContent: 'space-between' }]}>
          <Text style={s.muted}>Daily goal</Text>
          <View style={s.row}>
            <Pressable onPress={() => setGoal(Math.max(5, goal - 5))} hitSlop={8}><Text style={{ fontSize: 28, color: C.primary, paddingHorizontal: 14 }}>−</Text></Pressable>
            <Text style={s.body}>{goal} min</Text>
            <Pressable onPress={() => setGoal(Math.min(180, goal + 5))} hitSlop={8}><Text style={{ fontSize: 28, color: C.primary, paddingHorizontal: 14 }}>+</Text></Pressable>
          </View>
        </View>
      </Card>
      <Card>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {QUICK.map((q) => <Chip key={q} label={q} active={activity === q} onPress={() => setActivity(q)} />)}
        </View>
        <Input placeholder="Minuto" keyboardType="number-pad" value={minutes} onChangeText={setMinutes} />
        <View style={{ height: 12 }} />
        <Btn title="Idagdag" onPress={add} />
      </Card>
      {entries.filter((e) => e.date === dateKey()).map((e) => (
        <Card key={e.id} style={{ paddingVertical: 12 }}>
          <Text style={s.body}>{e.activity} · {e.minutes} min</Text>
        </Card>
      ))}
    </View>
  );
}
