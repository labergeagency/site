import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { assess } from '../logic/glucose';
import { GlucoseReading } from '../types';
import { uid } from '../storage';
import { Btn, C, Card, Chip, H, Input, s } from '../ui';

const CONTEXTS: { key: GlucoseReading['context']; label: string }[] = [
  { key: 'fasting', label: 'Bago kumain / gising' },
  { key: 'after-meal', label: '2 oras pagkakain' },
  { key: 'random', label: 'Iba pa' },
];
const LEVEL_COLOR = { low: C.warn, normal: C.good, elevated: C.warn, high: C.bad, urgent: C.bad };

export default function Glucose({ readings, setReadings }: { readings: GlucoseReading[]; setReadings: (f: (p: GlucoseReading[]) => GlucoseReading[]) => void }) {
  const [value, setValue] = useState('');
  const [context, setContext] = useState<GlucoseReading['context']>('fasting');

  const add = () => {
    const v = parseInt(value, 10);
    if (!v || v < 20 || v > 600) return;
    setReadings((p) => [{ id: uid(), value: v, context, at: Date.now() }, ...p]);
    setValue('');
  };

  return (
    <View>
      <H>Glucose</H>
      <Card>
        <Input placeholder="Reading (mg/dL)" keyboardType="number-pad" value={value} onChangeText={setValue} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {CONTEXTS.map((c) => <Chip key={c.key} label={c.label} active={context === c.key} onPress={() => setContext(c.key)} />)}
        </View>
        <Btn title="I-save ang reading" onPress={add} />
      </Card>
      {readings.slice(0, 20).map((r) => {
        const a = assess(r);
        return (
          <Card key={r.id}>
            <View style={[s.row, { justifyContent: 'space-between' }]}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: LEVEL_COLOR[a.level] }}>{r.value} <Text style={s.muted}>mg/dL</Text></Text>
              <Text style={{ color: LEVEL_COLOR[a.level], fontWeight: '700' }}>{a.label}</Text>
            </View>
            <Text style={s.muted}>{CONTEXTS.find((c) => c.key === r.context)?.label} · {new Date(r.at).toLocaleString('fil-PH')}</Text>
          </Card>
        );
      })}
    </View>
  );
}
