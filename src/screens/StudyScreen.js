import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlashCard from '../components/FlashCard';

export default function StudyScreen({ cards, isDarkMode, textSize, isShuffled }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCards, setActiveCards] = useState([]);

  useEffect(() => {
    let list = [...cards];
    if (isShuffled) {
      list.sort(() => Math.random() - 0.5);
    }
    setActiveCards(list);
    setCurrentIndex(0);
  }, [cards, isShuffled]);

  if (activeCards.length === 0) {
    return (
      <View style={[styles.centered, isDarkMode && { backgroundColor: '#000' }]}>
        <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
        <Text style={[styles.noCardsTxt, isDarkMode && { color: '#FFF' }]}>No cards available to study.</Text>
      </View>
    );
  }

  const safeIndex = Math.min(currentIndex, activeCards.length - 1);
  const currentCard = activeCards[safeIndex];

  const handleNext = () => {
    if (currentIndex < activeCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(activeCards.length - 1);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <Text style={[styles.headerTitle, isDarkMode && { color: '#FFF' }]}>📖 Study Mode</Text>

      <View style={styles.cardWrapper}>
        <FlashCard 
          card={currentCard} 
          safeIndex={safeIndex} 
          totalCards={activeCards.length} 
          isDarkMode={isDarkMode} 
          textSize={textSize} 
        />
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.navBtn, isDarkMode && { backgroundColor: '#27272A' }]} onPress={handlePrev}>
          <Ionicons name="chevron-back" size={20} color={isDarkMode ? '#FFF' : '#334155'} />
          <Text style={[styles.navBtnTxt, isDarkMode && { color: '#FFF' }]}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, { backgroundColor: '#4F46E5' }, { marginLeft: 12 }]} onPress={handleNext}>
          <Text style={[styles.navBtnTxt, { color: '#FFF' }]}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
  cardWrapper: { width: '100%', flex: 1, justifyContent: 'center' },
  btnRow: { flexDirection: 'row', width: '100%', marginBottom: 10 },
  navBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#E2E8F0' },
  navBtnTxt: { fontSize: 14, fontWeight: '700', marginHorizontal: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  noCardsTxt: { fontSize: 16, fontWeight: '600', marginTop: 10 },
});
  
