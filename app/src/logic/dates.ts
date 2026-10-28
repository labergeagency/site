export const DAYS = ['Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado', 'Linggo'];

export function dateKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 0 = Lunes ... 6 = Linggo */
export function dayIndex(d: Date = new Date()): number {
  return (d.getDay() + 6) % 7;
}

export function weekStartKey(d: Date = new Date()): string {
  const s = new Date(d);
  s.setDate(d.getDate() - dayIndex(d));
  return dateKey(s);
}
