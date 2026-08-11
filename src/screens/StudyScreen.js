import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlashCard from '../components/FlashCard';

export default function StudyScreen({ cards, isDarkMode, textSize, isShuffled }) {
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];

  // Shuffle and Filter Logic
  const filteredCards = useMemo(() => {
    let list = cards.filter((c) => selectedChapter === 'All' || (c.chapter || 'General') === selectedChapter);
    if (isShuffled) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [cards, selectedChapter, isShuffled]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];

  const handleNext = () => {
    if (safeIndex < filteredCards.length - 1) setCurrentIndex(safeIndex + 1);
  };

  const handlePrev = () => {
    if (safeIndex > 0) setCurrentIndex(safeIndex - 1);
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeText = isDarkMode ? '#FFFFFF' : '#0F172A';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <Text style={[styles.title, { color: themeText }]}>⚡ Flash Card</Text>

      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={ch}
              style={[styles.chapPill, isDarkMode && { backgroundColor: '#27272A' }, selectedChapter === ch && styles.activeChapPill]}
              onPress={() => {
                setSelectedChapter(ch);
                setCurrentIndex(0);
              }}
            >
              <Text style={[styles.chapPillTxt, isDarkMode && { color: '#A1A1AA' }, selectedChapter === ch && styles.activeChapPillTxt]}>
                {ch}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredCards.length > 0 && currentCard ? (
        <View style={styles.cardArea}>
          <FlashCard 
            card={currentCard} 
            safeIndex={safeIndex} 
            totalCards={filteredCards.length} 
            isDarkMode={isDarkMode} 
            textSize={textSize}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.navBtn, safeIndex === 0 && styles.disabledBtn, isDarkMode && { backgroundColor: '#27272A' }]}
              onPress={handlePrev}
              disabled={safeIndex === 0}
            >
              <Ionicons name="chevron-back" size={20} color={safeIndex === 0 ? '#94A3B8' : isDarkMode ? '#FFF' : '#334155'} />
              <Text style={[styles.navBtnTxt, safeIndex === 0 && styles.disabledTxt, isDarkMode && { color: '#FFF' }]}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, styles.nextBtn, safeIndex === filteredCards.length - 1 && styles.disabledBtn]}
              onPress={handleNext}
              disabled={safeIndex === filteredCards.length - 1}
            >
              <Text style={styles.nextBtnTxt}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyTxt, { color: themeText }]}>No cards available for this chapter.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginTop: 10, marginBottom: 12 },
  chapBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, height: 38 },
  chapPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeChapPill: { backgroundColor: '#4F46E5' },
  chapPillTxt: { fontSize: 13, fontWeight: '600', color: '#475569' },
  activeChapPillTxt: { color: '#FFF' },
  cardArea: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 },
  btnRow: { flexDirection: 'row', width: '88%', justifyContent: 'space-between', gap: 12, marginTop: 10 },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#E2E8F0' },
  nextBtn: { backgroundColor: '#4F46E5' },
  navBtnTxt: { fontSize: 15, fontWeight: '700', color: '#334155', marginHorizontal: 4 },
  nextBtnTxt: { fontSize: 15, fontWeight: '700', color: '#FFF', marginHorizontal: 4 },
  disabledBtn: { opacity: 0.4 },
  disabledTxt: { color: '#94A3B8' },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { fontSize: 16, fontWeight: '600' },
});
        
