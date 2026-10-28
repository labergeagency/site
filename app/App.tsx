import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { dayIndex, weekStartKey } from './src/logic/dates';
import { modeFor } from './src/logic/glucose';
import { generateWeek, planDay } from './src/logic/planner';
import Exercise from './src/screens/Exercise';
import Glucose from './src/screens/Glucose';
import Meals from './src/screens/Meals';
import Pantry from './src/screens/Pantry';
import Today from './src/screens/Today';
import { useStored } from './src/storage';
import { ExerciseEntry, GlucoseReading, PantryItem, WeekPlan } from './src/types';
import { C } from './src/ui';

const TABS = [
  { key: 'today', icon: '🏠', label: 'Ngayon' },
  { key: 'meals', icon: '🍽️', label: 'Meals' },
  { key: 'pantry', icon: '🧺', label: 'Pantry' },
  { key: 'glucose', icon: '🩸', label: 'Glucose' },
  { key: 'exercise', icon: '🏃', label: 'Exercise' },
] as const;

export default function App() {
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('today');
  const [pantry, setPantry] = useStored<PantryItem[]>('pantry', []);
  const [readings, setReadings] = useStored<GlucoseReading[]>('glucose', []);
  const [entries, setEntries] = useStored<ExerciseEntry[]>('exercise', []);
  const [goal, setGoal] = useStored<number>('goal', 30);
  const [plan, setPlan, ready] = useStored<WeekPlan | null>('plan', null);

  const mode = modeFor(readings);
  const today = dayIndex();

  // A plan from a previous week is stale; drop it.
  useEffect(() => {
    if (ready && plan && plan.weekStart !== weekStartKey()) setPlan(null);
  }, [ready, plan, setPlan]);

  // If today's glucose calls for low-carb but the plan was balanced, re-plan today only.
  useEffect(() => {
    if (plan && mode === 'strict' && plan.mode === 'balanced') {
      const days = [...plan.days];
      days[today] = planDay(pantry, 'strict', new Map());
      setPlan({ ...plan, mode: 'strict', days });
    } else if (plan && mode === 'balanced' && plan.mode === 'strict') {
      setPlan({ ...plan, mode: 'balanced' });
    }
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top']}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {tab === 'today' && <Today plan={plan} pantry={pantry} readings={readings} entries={entries} goal={goal} mode={mode} today={today} />}
          {tab === 'meals' && <Meals plan={plan} pantry={pantry} today={today} onGenerate={() => setPlan(generateWeek(pantry, mode))} />}
          {tab === 'pantry' && <Pantry items={pantry} setItems={setPantry} />}
          {tab === 'glucose' && <Glucose readings={readings} setReadings={setReadings} />}
          {tab === 'exercise' && <Exercise entries={entries} setEntries={setEntries} goal={goal} setGoal={setGoal} />}
          <Text style={styles.disclaimer}>
            Gabay lang ito at hindi kapalit ng payo ng doktor o dietitian. Kung mataas ang sugar nang paulit-ulit, kumonsulta sa doktor.
          </Text>
        </ScrollView>
        <SafeAreaView edges={['bottom']} style={styles.tabs}>
          <View style={styles.tabRow}>
            {TABS.map((t) => (
              <Pressable key={t.key} style={styles.tab} onPress={() => setTab(t.key)}>
                <Text style={{ fontSize: 22 }}>{t.icon}</Text>
                <Text style={[styles.tabLabel, tab === t.key && { color: C.primary, fontWeight: '800' }]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
  tabs: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.border },
  tabRow: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabLabel: { fontSize: 11, color: C.muted, marginTop: 2 },
  disclaimer: { color: C.muted, fontSize: 12, marginTop: 16, textAlign: 'center' },
});
