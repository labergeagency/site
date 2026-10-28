import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PantryItem } from '../types';
import { uid } from '../storage';
import { Btn, C, Card, H, Input, s } from '../ui';

export default function Pantry({ items, setItems }: { items: PantryItem[]; setItems: (f: (p: PantryItem[]) => PantryItem[]) => void }) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setItems((p) => [...p, { id: uid(), name: name.trim(), qty: qty.trim() }]);
    setName('');
    setQty('');
  };

  return (
    <View>
      <H>Pantry / Stock sa bahay</H>
      <Card>
        <Input placeholder="Pagkain (hal. itlog, manok, kamatis)" value={name} onChangeText={setName} />
        <View style={{ height: 8 }} />
        <Input placeholder="Dami (opsyonal, hal. 6 pcs)" value={qty} onChangeText={setQty} />
        <View style={{ height: 12 }} />
        <Btn title="Idagdag" onPress={add} />
      </Card>
      {items.length === 0 ? (
        <Text style={s.muted}>Wala pang laman. Ilagay ang mga pagkain na meron kayo para makagawa ng meal plan.</Text>
      ) : (
        items.map((it) => (
          <Card key={it.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <View>
              <Text style={s.body}>{it.name}</Text>
              {!!it.qty && <Text style={s.muted}>{it.qty}</Text>}
            </View>
            <Pressable onPress={() => setItems((p) => p.filter((x) => x.id !== it.id))} hitSlop={10}>
              <Text style={{ color: C.bad, fontWeight: '700' }}>Alisin</Text>
            </Pressable>
          </Card>
        ))
      )}
    </View>
  );
}
