import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

export const C = {
  bg: '#F4F8F5', card: '#FFFFFF', primary: '#2E7D5B', primaryDark: '#1F5C42', text: '#1B2B24', muted: '#6B7C73',
  border: '#DCE7E0', warn: '#E08A00', bad: '#C62828', good: '#2E7D5B',
};

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function H({ children }: { children: React.ReactNode }) {
  return <Text style={s.h}>{children}</Text>;
}

export function Btn({ title, onPress, kind = 'primary', disabled }: { title: string; onPress: () => void; kind?: 'primary' | 'ghost'; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.btn, kind === 'ghost' && s.btnGhost, (pressed || disabled) && { opacity: 0.6 }]}>
      <Text style={[s.btnText, kind === 'ghost' && { color: C.primary }]}>{title}</Text>
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={C.muted} {...props} style={[s.input, props.style]} />;
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: C.primary, borderColor: C.primary }]}>
      <Text style={{ color: active ? '#fff' : C.text, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export function Bar({ ratio, color = C.primary }: { ratio: number; color?: string }) {
  return (
    <View style={s.barBg}>
      <View style={{ height: 12, borderRadius: 6, backgroundColor: color, width: `${Math.min(100, Math.max(0, ratio * 100))}%` }} />
    </View>
  );
}

export const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: C.border },
  h: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 12 },
  btn: { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: C.primary },
  btnGhost: { backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  input: { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: '#fff', color: C.text },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: '#fff', marginRight: 8, marginBottom: 8 },
  barBg: { height: 12, borderRadius: 6, backgroundColor: '#E3EDE7', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center' },
  muted: { color: C.muted, fontSize: 14 },
  body: { color: C.text, fontSize: 16 },
});
