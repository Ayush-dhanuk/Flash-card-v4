import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ManageScreen({ cards, setCards }) {
  const [manageChapter, setManageChapter] = useState('All');

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];
  const manageFiltered = cards.filter((c) => manageChapter === 'All' || (c.chapter || 'General') === manageChapter);

  const handleDeleteCard = (id) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert('Delete All Cards', 'Are you sure you want to delete all cards?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete All', style: 'destructive', onPress: () => setCards([]) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mngHead}>
        <Text style={styles.headerTitle}>🗂️ Manage Cards</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearTxt}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Chapter Filter Bar */}
      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={`mng-${ch}`}
              style={[styles.chapPill, manageChapter === ch && styles.activeChapPill]}
              onPress={() => setManageChapter(ch)}
            >
              <Text style={[styles.chapPillTxt, manageChapter === ch && styles.activeChapPillTxt]}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {manageFiltered.length === 0 && <Text style={styles.emptyTxt}>No cards found in this deck.</Text>}
        {manageFiltered.map((item) => (
          <View key={item.id} style={styles.mngRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rTerm}>{item.term}</Text>
              <Text style={styles.rMean}>{item.meaning}</Text>
              <Text style={styles.rMeta}>{item.chapter || 'General'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteCard(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  mngHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clearTxt: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
  chapBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, height: 36 },
  chapPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeChapPill: { backgroundColor: '#4F46E5' },
  chapPillTxt: { fontSize: 12, fontWeight: '600', color: '#475569' },
  activeChapPillTxt: { color: '#FFF' },
  emptyTxt: { color: '#9CA3AF', fontSize: 15, marginTop: 20, textAlign: 'center' },
  mngRow: { backgroundColor: '#FFF', padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  rTerm: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  rMean: { fontSize: 13, color: '#475569', marginTop: 2 },
  rMeta: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
});
                
