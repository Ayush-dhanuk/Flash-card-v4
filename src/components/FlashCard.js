import React, { useRef, useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

const SIMPLE_NATURAL_SENTENCES = {
  '의사': { ko: '저는 의사예요.', ne: 'म डाक्टर हुँ।' },
  '아버지': { ko: '아버지를 사랑해요.', ne: 'म बुबालाई माया गर्छु।' },
  '안녕하세요': { ko: '안녕하세요, 반가워요.', ne: 'नमस्ते, भेटेर खुसी लाग्यो।' },
  '감사합니다': { ko: '정말 감사합니다.', ne: 'धेरै धेरै धन्यवाद।' },
  '나무': { ko: '나무가 매우 커요.', ne: 'रुख धेरै ठूलो छ।' },
  '책': { ko: '책을 읽어요.', ne: 'किताब पढ्छु।' },
  '물': { ko: '물을 마셔요.', ne: 'पानी पिउँछु।' },
  '집': { ko: '지금 집에 가요.', ne: 'अहिले घर जान्छु।' },
  '학교': { ko: '학교에 가요.', ne: 'स्कूल जान्छु।' },
  '사과': { ko: '사과를 먹어요.', ne: 'स्या우 खान्छु।' },
  '친구': { ko: '친구를 만나요.', ne: 'साथीलाई भेट्छु।' },
  '음식': { ko: '음식이 맛있어요.', ne: 'खाना मीठो छ।' },
};

export default function FlashCard({ card, safeIndex, totalCards, isDarkMode, initialReversed = false }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversed, setIsReversed] = useState(initialReversed);
  const [speakingText, setSpeakingText] = useState(null);

  const flipAnim = useRef(new Animated.Value(0)).current;

  // Simple example sentence generator (Always attached to back)
  const exampleSentence = useMemo(() => {
    if (!card?.term) return null;
    const cleanTerm = card.term.trim();

    if (SIMPLE_NATURAL_SENTENCES[cleanTerm]) {
      return SIMPLE_NATURAL_SENTENCES[cleanTerm];
    }

    return {
      ko: `${cleanTerm}(이/가) 좋아요.`,
      ne: `${card.meaning || 'यो'} राम्रो छ।`,
    };
  }, [card]);

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const toggleReverseMode = (e) => {
    e.stopPropagation();
    setIsReversed((prev) => !prev);
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
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
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
  const themeTextPrimary = isDarkMode ? '#FFFFFF' : '#0F172A';

  // Dynamic content based on reverse mode setting
  const frontText = isReversed ? card.meaning : card.term;
  const backText = isReversed ? card.term : card.meaning;
  const backTagText = isReversed ? 'KOREAN WORD' : 'NEPALI MEANING';

  return (
    <View style={styles.container}>
      <Text style={[styles.progTxt, isDarkMode && { color: '#A1A1AA' }]}>
        Card {safeIndex + 1} of {totalCards}
      </Text>

      <TouchableOpacity activeOpacity={0.92} onPress={flipCard} style={styles.cardWrap}>
        {/* FRONT SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'none' : 'auto'}
          style={[styles.card, themeCardFront, { opacity: frontOp, transform: [{ perspective: 1000 }, { rotateY: frontInt }] }]}
        >
          {/* Header Bar */}
          <View style={styles.cardHeaderBar}>
            <View style={[styles.badge, isDarkMode && { backgroundColor: '#27272A' }]}>
              <Text style={[styles.badgeTxt, isDarkMode && { color: '#818CF8' }]}>{card.chapter || 'General'}</Text>
            </View>

            <TouchableOpacity
              style={[styles.swapBtn, isDarkMode && { backgroundColor: '#27272A' }, isReversed && styles.swapBtnActive]}
              onPress={toggleReverseMode}
            >
              <Ionicons name="swap-horizontal" size={14} color={isReversed ? '#FFF' : '#6366F1'} />
              <Text style={[styles.swapBtnTxt, isReversed && { color: '#FFF' }]}>
                {isReversed ? 'Nepali → Korean' : 'Korean → Nepali'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.cardTerm, { color: themeTextPrimary }]}>{frontText}</Text>

          <TouchableOpacity
            style={[styles.spkBtn, isDarkMode && { backgroundColor: '#27272A' }, speakingText === frontText && styles.spkBtnAct]}
            onPress={(e) => { e.stopPropagation(); speakText(frontText); }}
          >
            <Ionicons name={speakingText === frontText ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === frontText ? '#FFF' : '#6366F1'} />
            <Text style={[styles.spkTxt, isDarkMode && { color: '#818CF8' }, speakingText === frontText && styles.spkTxtAct]}>
              {speakingText === frontText ? 'Speaking...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.flipHint, isDarkMode && { color: '#71717A' }]}>Tap card to flip 🔄</Text>
        </Animated.View>

        {/* BACK SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'auto' : 'none'}
          style={[styles.card, themeCardBack, { opacity: backOp, transform: [{ perspective: 1000 }, { rotateY: backInt }] }]}
        >
          {/* Top Section */}
          <View style={styles.topBackSection}>
            <View style={styles.cardHeaderBar}>
              <Text style={[styles.meanTag, isDarkMode && { color: '#818CF8' }]}>{backTagText}</Text>
              
              <TouchableOpacity
                style={[styles.swapBtn, isDarkMode && { backgroundColor: '#27272A' }, isReversed && styles.swapBtnActive]}
                onPress={toggleReverseMode}
              >
                <Ionicons name="swap-horizontal" size={14} color={isReversed ? '#FFF' : '#6366F1'} />
                <Text style={[styles.swapBtnTxt, isReversed && { color: '#FFF' }]}>
                  {isReversed ? 'Nepali → Korean' : 'Korean → Nepali'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.cardMean, { color: themeTextPrimary }]}>{backText}</Text>

            <TouchableOpacity
              style={[styles.spkBtnBack, isDarkMode && { backgroundColor: '#27272A', borderColor: '#3F3F46' }, speakingText === backText && styles.spkBtnBackAct]}
              onPress={(e) => { e.stopPropagation(); speakText(backText); }}
            >
              <Ionicons name={speakingText === backText ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === backText ? '#FFF' : '#6366F1'} />
              <Text style={[styles.spkTxtBack, isDarkMode && { color: '#818CF8' }, speakingText === backText && styles.spkTxtBackAct]}>
                {speakingText === backText ? 'Speaking...' : 'Pronounce'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* EXAMPLE SENTENCE BOX (STAYS ALWAYS ON THE BACK) */}
          {exampleSentence && (
            <View style={[styles.exampleContainer, isDarkMode ? styles.exampleBoxDark : styles.exampleBoxLight]}>
              <Text style={[styles.exampleHeader, isDarkMode && { color: '#818CF8' }]}>EXAMPLE SENTENCE</Text>
              <Text style={[styles.exampleLine, { color: themeTextPrimary }]}>
                <Text style={styles.boldTag}>Korean: </Text>{exampleSentence.ko}
              </Text>
              <Text style={[styles.exampleLine, { color: themeTextPrimary, marginTop: 4 }]}>
                <Text style={styles.boldTag}>Nepali: </Text>{exampleSentence.ne}
              </Text>
            </View>
          )}

          <Text style={[styles.flipHint, isDarkMode && { color: '#71717A' }]}>Tap card to flip 🔄</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  progTxt: { fontSize: 13, color: '#64748B', fontWeight: '600', marginBottom: 10 },
  cardWrap: { width: width * 0.88, height: Math.min(height * 0.54, 460), alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', height: '100%', borderRadius: 22, padding: 18, alignItems: 'center', justifyContent: 'space-between', backfaceVisibility: 'hidden', position: 'absolute', elevation: 4 },
  cardFrontLight: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEF2FF' },
  cardFrontDark: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#27272A' },
  cardBackLight: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#6366F1' },
  cardBackDark: { backgroundColor: '#121212', borderWidth: 1.5, borderColor: '#6366F1' },

  cardHeaderBar: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTxt: { color: '#4F46E5', fontWeight: '700', fontSize: 11 },

  swapBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4 },
  swapBtnActive: { backgroundColor: '#6366F1' },
  swapBtnTxt: { fontSize: 10, fontWeight: '700', color: '#6366F1' },

  cardTerm: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginTop: 20 },
  topBackSection: { alignItems: 'center', width: '100%' },
  cardMean: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  meanTag: { fontSize: 11, fontWeight: '800', color: '#4F46E5', letterSpacing: 1 },

  spkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  spkBtnAct: { backgroundColor: '#4F46E5' },
  spkTxt: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtAct: { color: '#FFF' },

  spkBtnBack: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18, borderWidth: 1, borderColor: '#C7D2FE', marginTop: 8 },
  spkBtnBackAct: { backgroundColor: '#4F46E5' },
  spkTxtBack: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  spkTxtBackAct: { color: '#FFF' },

  exampleContainer: { width: '100%', padding: 12, borderRadius: 14, borderWidth: 1, marginVertical: 6 },
  exampleBoxLight: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  exampleBoxDark: { backgroundColor: '#18181B', borderColor: '#27272A' },
  exampleHeader: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 1, marginBottom: 4 },
  exampleLine: { fontSize: 14, lineHeight: 20 },
  boldTag: { fontWeight: '700', color: '#6366F1' },

  flipHint: { fontSize: 12, color: '#94A3B8' },
});
      
