import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlashCard from '../components/FlashCard';

export default function StudyScreen({ cards }) {
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];
  const filteredCards = cards.filter((c) => selectedChapter === 'All' || (c.chapter || 'General') === selectedChapter);
  
  const safeIndex = currentIndex >= filteredCards.length ? 0 : currentIndex;
  const currentCard = filteredCards[safeIndex] || null;

  const handleNext = () => {
    setCurrentIndex(safeIndex >= filteredCards.length - 1 ? 0 : safeIndex + 1);
  };

  const handlePrev = () => {
    setCurrentIndex(safeIndex <= 0 ? filteredCards.length - 1 : safeIndex - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>⚡ FlashCards AI</Text>
      
      {/* Chapter Selection Bar */}
      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={ch}
              style={[styles.chapPill, selectedChapter === ch && styles.activeChapPill]}
              onPress={() => { setSelectedChapter(ch); setCurrentIndex(0); }}
            >
              <Text style={[styles.chapPillTxt, selectedChapter === ch && styles.activeChapPillTxt]}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {!currentCard ? (
        <View style={styles.center}>
          <Ionicons name="journal-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTxt}>No cards in "{selectedChapter}"</Text>
        </View>
      ) : (
        <View style={styles.studyArea}>
          <FlashCard key={currentCard.id} card={currentCard} safeIndex={safeIndex} totalCards={filteredCards.length} />
          
          {/* Navigation Controls */}
          <View style={styles.actRow}>
            <TouchableOpacity style={[styles.navActionBtn, styles.prevBtn]} onPress={handlePrev}>
              <Ionicons name="chevron-back" size={20} color="#475569" />
              <Text style={styles.prevTxt}>Previous</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.navActionBtn, styles.nextBtn]} onPress={handleNext}>
              <Text style={styles.nextTxt}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chapBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, height: 38 },
  chapPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeChapPill: { backgroundColor: '#4F46E5' },
  chapPillTxt: { fontSize: 13, fontWeight: '600', color: '#475569' },
  activeChapPillTxt: { color: '#FFF' },
  studyArea: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 },
  emptyTxt: { color: '#9CA3AF', fontSize: 15, marginTop: 10, textAlign: 'center' },
  actRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 16 },
  navActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, marginHorizontal: 6 },
  prevBtn: { backgroundColor: '#E2E8F0' },
  nextBtn: { backgroundColor: '#4F46E5', elevation: 3 },
  prevTxt: { color: '#475569', fontWeight: '700', marginLeft: 4, fontSize: 14 },
  nextTxt: { color: '#FFF', fontWeight: '700', marginRight: 4, fontSize: 14 },
});
  
