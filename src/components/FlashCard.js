import React, { useRef, useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// Natural, conversational sentence mappings
const NATURAL_SENTENCES = {
  '의사': { ko: '병원에 가서 의사 선생님을 만났어요.', ne: 'म अस्पताल गएर डाक्टरलाई भेटेँ।' },
  '아버지': { ko: '우리 아버지는 정말 친절하세요.', ne: 'मेरो बुबा धेरै दयालु हुनुहुन्छ।' },
  '안녕하세요': { ko: '안녕하세요, 오늘 날씨가 참 좋네요!', ne: 'नमस्ते, आज मौसम धेरै राम्रो छ!' },
  '감사합니다': { ko: '도와주셔서 정말 감사합니다.', ne: 'सहयोगको लागि धेरै धेरै धन्यवाद।' },
  '나무': { ko: '정원에 큰 나무가 한 그루 있어요.', ne: 'बागीचामा एउटा ठूलो रुख छ।' },
  '책': { ko: '도서관에서 재미있는 책을 읽고 있어요.', ne: 'म पुस्तकालयमा एउटा राम्रो किताब पढ्दैछु।' },
  '물': { ko: '목이 말라서 시원한 물을 마셨어요.', ne: 'तिर्खा लागेर म चिसो पानी पिएँ।' },
  '집': { ko: '오늘 저녁에는 일찍 집에 갈 거예요.', ne: 'आज साँझ म छिटै घर जानेछु।' },
  '학교': { ko: '내일 아침에 같이 학교에 갈까요?', ne: 'भोलि बिहान सँगै स्कूल जाने हो?' },
  '사과': { ko: '아침에 먹는 사과는 몸에 좋아요.', ne: 'बिहान स्याउ खानु स्वास्थ्यको लागि राम्रो हुन्छ।' },
  '친구': { ko: '주말에 오랜만에 친구를 만났어요.', ne: 'वीकेन्डमा धेरै पछि साथीलाई भेटेँ।' },
  '음식': { ko: '이 식당은 한국 음식이 맛있어요.', ne: 'यो रेस्टुरेन्टमा कोरियन खाना मीठो छ।' },
};

export default function FlashCard({ card, safeIndex, totalCards, isDarkMode }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);

  const flipAnim = useRef(new Animated.Value(0)).current;

  // Natural example sentence selector & dynamic natural fallback generator
  const exampleSentence = useMemo(() => {
    if (!card?.term) return null;
    const cleanTerm = card.term.trim();

    if (NATURAL_SENTENCES[cleanTerm]) {
      return NATURAL_SENTENCES[cleanTerm];
    }

    // Natural fallback context instead of "이것은 X입니다"
    const isObjectOrConcept = true;
    return {
      ko: `저는 ${cleanTerm}(을/를) 자주 공부해요.`,
      ne: `म ${card.meaning || 'यो शब्द'} नियमित रूपमा अभ्यास गर्छु।`,
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
          <View style={[styles.badge, isDarkMode && { backgroundColor: '#27272A' }]}>
            <Text style={[styles.badgeTxt, isDarkMode && { color: '#818CF8' }]}>{card.chapter || 'General'}</Text>
          </View>

          <Text style={[styles.cardTerm, { color: themeTextPrimary }]}>{card.term}</Text>

          <TouchableOpacity
            style={[styles.spkBtn, isDarkMode && { backgroundColor: '#27272A' }, speakingText === card.term && styles.spkBtnAct]}
            onPress={(e) => { e.stopPropagation(); speakText(card.term); }}
          >
            <Ionicons name={speakingText === card.term ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === card.term ? '#FFF' : '#6366F1'} />
            <Text style={[styles.spkTxt, isDarkMode && { color: '#818CF8' }, speakingText === card.term && styles.spkTxtAct]}>
              {speakingText === card.term ? 'Speaking...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.flipHint, isDarkMode && { color: '#71717A' }]}>Tap card to flip 🔄</Text>
        </Animated.View>

        {/* BACK SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'auto' : 'none'}
          style={[styles.card, themeCardBack, { opacity: backOp, transform: [{ perspective: 1000 }, { rotateY: backInt }] }]}
        >
          <View style={styles.topBackSection}>
            <Text style={[styles.meanTag, isDarkMode && { color: '#818CF8' }]}>NEPALI MEANING</Text>
            <Text style={[styles.cardMean, { color: themeTextPrimary }]}>{card.meaning}</Text>

            <TouchableOpacity
              style={[styles.spkBtnBack, isDarkMode && { backgroundColor: '#27272A', borderColor: '#3F3F46' }, speakingText === card.meaning && styles.spkBtnBackAct]}
              onPress={(e) => { e.stopPropagation(); speakText(card.meaning); }}
            >
              <Ionicons name={speakingText === card.meaning ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === card.meaning ? '#FFF' : '#6366F1'} />
              <Text style={[styles.spkTxtBack, isDarkMode && { color: '#818CF8' }, speakingText === card.meaning && styles.spkTxtBackAct]}>
                {speakingText === card.meaning ? 'Speaking...' : 'Pronounce'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* NATURAL EXAMPLE SENTENCE BOX */}
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
  card: { width: '100%', height: '100%', borderRadius: 22, padding: 20, alignItems: 'center', justifyContent: 'space-between', backfaceVisibility: 'hidden', position: 'absolute', elevation: 4 },
  cardFrontLight: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEF2FF' },
  cardFrontDark: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#27272A' },
  cardBackLight: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#6366F1' },
  cardBackDark: { backgroundColor: '#121212', borderWidth: 1.5, borderColor: '#6366F1' },
  badge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeTxt: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  cardTerm: { fontSize: 34, fontWeight: '800', textAlign: 'center', marginTop: 40 },
  topBackSection: { alignItems: 'center', width: '100%' },
  cardMean: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  meanTag: { fontSize: 11, fontWeight: '800', color: '#4F46E5', letterSpacing: 1.2, marginTop: 4 },
  spkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  spkBtnAct: { backgroundColor: '#4F46E5' },
  spkTxt: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtAct: { color: '#FFF' },
  spkBtnBack: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: '#C7D2FE', marginTop: 10 },
  spkBtnBackAct: { backgroundColor: '#4F46E5' },
  spkTxtBack: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 12 },
  spkTxtBackAct: { color: '#FFF' },

  exampleContainer: { width: '100%', padding: 14, borderRadius: 14, borderWidth: 1, marginVertical: 8 },
  exampleBoxLight: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  exampleBoxDark: { backgroundColor: '#18181B', borderColor: '#27272A' },
  exampleHeader: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 1, marginBottom: 6 },
  exampleLine: { fontSize: 14, lineHeight: 20 },
  boldTag: { fontWeight: '700', color: '#6366F1' },

  flipHint: { fontSize: 12, color: '#94A3B8' },
});
    
