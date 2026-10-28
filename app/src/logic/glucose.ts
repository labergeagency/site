import { GlucoseReading, Mode } from '../types';

export type Level = 'low' | 'normal' | 'elevated' | 'high' | 'urgent';

export interface Assessment {
  level: Level;
  label: string;
  advice: string;
}

/**
 * Thresholds follow ADA ranges (mg/dL): fasting 100-125 and 2h post-meal
 * 140-199 are the prediabetes range. This is guidance only, not a diagnosis.
 */
export function assess(r: GlucoseReading): Assessment {
  const v = r.value;
  if (v < 70) {
    return { level: 'low', label: 'Mababa', advice: 'Kumain ng 15g mabilis na carbs (hal. 1/2 baso ng juice), tapos i-check ulit pagkalipas ng 15 minuto.' };
  }
  if (v >= 300) {
    return { level: 'urgent', label: 'Napakataas', advice: 'Napakataas nito. Makipag-ugnayan agad sa doktor.' };
  }
  const afterMeal = r.context === 'after-meal';
  const normalMax = afterMeal ? 139 : 99;
  const elevatedMax = afterMeal ? 199 : 125;
  if (v <= normalMax) return { level: 'normal', label: 'Normal', advice: 'Maganda! Ituloy ang balanseng pagkain at paggalaw.' };
  if (v <= elevatedMax) return { level: 'elevated', label: 'Medyo mataas', advice: 'Nasa prediabetes range. Piliin ang low-carb na pagkain at maglakad pagkatapos kumain.' };
  return { level: 'high', label: 'Mataas', advice: 'Mataas ito. Low-carb muna ngayon at uminom ng tubig. Ipaalam sa doktor kung paulit-ulit.' };
}

export function latest(readings: GlucoseReading[]): GlucoseReading | undefined {
  return readings.reduce<GlucoseReading | undefined>((a, b) => (!a || b.at > a.at ? b : a), undefined);
}

/** Strict (low-carb only) when the latest reading in the past 24h is not normal. */
export function modeFor(readings: GlucoseReading[], now = Date.now()): Mode {
  const last = latest(readings);
  if (!last || now - last.at > 24 * 3600 * 1000) return 'balanced';
  const { level } = assess(last);
  return level === 'normal' || level === 'low' ? 'balanced' : 'strict';
}
