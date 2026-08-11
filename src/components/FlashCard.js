import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function FlashCard({ card, safeIndex, totalCards, isDarkMode, textSize = 'Medium' }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const getFontSize = () => {
    switch (textSize) {
      case 'Small': return 18;
      case 'Large': return 32;
      case 'Medium':
      default: return 24;
    }
  };

  const cardBg = isDarkMode ? '#18181B' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#27272A' : '#E2E8F0';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#0F172A';
  const textSecondary = isDarkMode ? '#A1A1AA' : '#64748B';

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]} 
      onPress={() => setIsFlipped(!isFlipped)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.counter, { color: textSecondary }]}>
          {safeIndex + 1} / {totalCards}
        </Text>
        <Text style={[styles.hint, { color: textSecondary }]}>
          {isFlipped ? 'Meaning' : 'Tap to flip'}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.mainText, { color: textPrimary, fontSize: getFontSize() }]}>
          {isFlipped ? card.meaning || card.back : card.term || card.front}
        </Text>
      </View>

      {card.chapter && (
        <View style={styles.cardFooter}>
          <Text style={[styles.chapterBadge, { color: textSecondary }]}>
            {card.chapter}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontSize: 14, fontWeight: '600' },
  hint: { fontSize: 12, fontWeight: '500' },
  cardBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  mainText: { fontWeight: '700', textAlign: 'center', lineHeight: 36 },
  cardFooter: { alignItems: 'center' },
  chapterBadge: { fontSize: 12, fontWeight: '500' },
});
          
