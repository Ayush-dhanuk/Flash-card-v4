import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

export default function FlashCard({ card, safeIndex, totalCards, isDarkMode }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const speakText = async (text) => {
    if (!text) return;
    try {
      await Speech.stop();
      let lang = 'en-US';
      if (/[\uAC00-\uD7AF]/.test(text)) lang = 'ko-KR';
      if (/[\u0900-\u097F]/.test(text)) lang = 'ne-NP';
      
      Speech.speak(text, {
        language: lang,
        rate: 0.85,
        onStart: () => setSpeakingText(text),
        onDone: () => setSpeakingText(null),
        onError: () => setSpeakingText(null),
      });
    } catch (e) {
      setSpeakingText(null);
    }
  };

  const frontInt = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backInt = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });
  const frontOp = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [1, 0] });
  const backOp = flipAnim.interpolate({ inputRange: [89, 90], outputRange: [0, 1] });

  const themeCardFront = isDarkMode ? styles.cardFrontDark : styles.cardFrontLight;
  const themeCardBack = isDarkMode ? styles.cardBackDark : styles.cardBackLight;
  const themeTextPrimary = isDarkMode ? '#F8FAFC' : '#0F172A';

  return (
    <View style={styles.container}>
      <Text style={[styles.progTxt, isDarkMode && { color: '#94A3B8' }]}>Card {safeIndex + 1} of {totalCards}</Text>
      
      <TouchableOpacity activeOpacity={0.92} onPress={flipCard} style={styles.cardWrap}>
        {/* FRONT SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'none' : 'auto'}
          style={[styles.card, themeCardFront, { opacity: frontOp, transform: [{ perspective: 1000 }, { rotateY: frontInt }] }]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{card.chapter || 'General'}</Text>
          </View>
          
          <Text style={[styles.cardTerm, { color: themeTextPrimary }]}>{card.term}</Text>

          <TouchableOpacity
            style={[styles.spkBtn, speakingText === card.term && styles.spkBtnAct]}
            onPress={(e) => { e.stopPropagation(); speakText(card.term); }}
          >
            <Ionicons name={speakingText === card.term ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === card.term ? '#FFF' : '#4F46E5'} />
            <Text style={[styles.spkTxt, speakingText === card.term && styles.spkTxtAct]}>
              {speakingText === card.term ? 'Speaking...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.flipHint}>Tap card to flip 🔄</Text>
        </Animated.View>

        {/* BACK SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'auto' : 'none'}
          style={[styles.card, themeCardBack, { opacity: backOp, transform: [{ perspective: 1000 }, { rotateY: backInt }] }]}
        >
          <Text style={styles.meanTag}>NEPALI MEANING</Text>
          <Text style={[styles.cardMean, { color: themeTextPrimary }]}>{card.meaning}</Text>

          <TouchableOpacity
            style={[styles.spkBtnBack, speakingText === card.meaning && styles.spkBtnBackAct]}
            onPress={(e) => { e.stopPropagation(); speakText(card.meaning); }}
          >
            <Ionicons name={speakingText === card.meaning ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === card.meaning ? '#FFF' : '#4F46E5'} />
            <Text style={[styles.spkTxtBack, speakingText === card.meaning && styles.spkTxtBackAct]}>
              {speakingText === card.meaning ? 'Speaking...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.flipHint}>Tap card to flip 🔄</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  progTxt: { fontSize: 13, color: '#64748B', fontWeight: '600', marginBottom: 12 },
  cardWrap: { width: width * 0.88, height: Math.min(height * 0.45, 380), alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', height: '100%', borderRadius: 22, padding: 24, alignItems: 'center', justifyContent: 'space-between', backfaceVisibility: 'hidden', position: 'absolute', elevation: 4 },
  cardFrontLight: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEF2FF' },
  cardFrontDark: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  cardBackLight: { backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#4F46E5' },
  cardBackDark: { backgroundColor: '#0F172A', borderWidth: 1.5, borderColor: '#6366F1' },
  badge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeTxt: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  cardTerm: { fontSize: 34, fontWeight: '800', textAlign: 'center', marginTop: 40 },
  cardMean: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 20 },
  meanTag: { fontSize: 12, fontWeight: '800', color: '#4F46E5', letterSpacing: 1.2, marginTop: 10 },
  spkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  spkBtnAct: { backgroundColor: '#4F46E5' },
  spkTxt: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtAct: { color: '#FFF' },
  spkBtnBack: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#C7D2FE' },
  spkBtnBackAct: { backgroundColor: '#4F46E5' },
  spkTxtBack: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtBackAct: { color: '#FFF' },
  flipHint: { fontSize: 12, color: '#94A3B8' },
});
    
