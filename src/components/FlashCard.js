import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

export default function FlashCard({ card, safeIndex, totalCards }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);

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

  // Dynamically generates visual representation based on card meaning/term
  const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(card.meaning || card.term)}?width=400&height=250&nologo=true`;

  return (
    <View style={styles.container}>
      <Text style={styles.progTxt}>Card {safeIndex + 1} of {totalCards}</Text>
      
      <TouchableOpacity activeOpacity={0.92} onPress={flipCard} style={styles.cardWrap}>
        {/* FRONT SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'none' : 'auto'}
          style={[styles.card, styles.cardFront, { opacity: frontOp, transform: [{ perspective: 1000 }, { rotateY: frontInt }] }]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>{card.chapter || 'General'}</Text>
          </View>
          
          <Text style={styles.cardTerm}>{card.term}</Text>

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
          style={[styles.card, styles.cardBack, { opacity: backOp, transform: [{ perspective: 1000 }, { rotateY: backInt }] }]}
        >
          <Text style={styles.meanTag}>MEANING</Text>
          <Text style={styles.cardMean}>{card.meaning}</Text>

          {/* AI Image Illustration */}
          <View style={styles.imageContainer}>
            {imgLoading && <ActivityIndicator size="small" color="#4F46E5" style={StyleSheet.absoluteFill} />}
            <Image
              source={{ uri: aiImageUrl }}
              style={styles.cardImage}
              onLoadEnd={() => setImgLoading(false)}
            />
          </View>

          <TouchableOpacity
            style={[styles.spkBtnBack, speakingText === card.meaning && styles.spkBtnBackAct]}
            onPress={(e) => { e.stopPropagation(); speakText(card.meaning); }}
          >
            <Ionicons name={speakingText === card.meaning ? 'volume-high' : 'volume-medium-outline'} size={18} color={speakingText === card.meaning ? '#FFF' : '#4F46E5'} />
            <Text style={[styles.spkTxtBack, speakingText === card.meaning && styles.spkTxtBackAct]}>
              {speakingText === card.meaning ? 'Speaking...' : 'Pronounce'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  progTxt: { fontSize: 13, color: '#64748B', fontWeight: '600', marginBottom: 12 },
  cardWrap: { width: width * 0.88, height: Math.min(height * 0.50, 420), alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', height: '100%', borderRadius: 22, padding: 18, alignItems: 'center', justifyContent: 'space-between', backfaceVisibility: 'hidden', position: 'absolute', elevation: 4 },
  cardFront: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEF2FF', justifyContent: 'center' },
  cardBack: { backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#4F46E5' },
  badge: { position: 'absolute', top: 14, left: 14, backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTxt: { color: '#4F46E5', fontWeight: '700', fontSize: 11 },
  cardTerm: { fontSize: 32, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginVertical: 16 },
  cardMean: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginVertical: 6 },
  meanTag: { fontSize: 11, fontWeight: '800', color: '#4F46E5', letterSpacing: 1.2 },
  imageContainer: { width: '100%', height: 140, borderRadius: 14, overflow: 'hidden', backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginVertical: 8 },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  spkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 10 },
  spkBtnAct: { backgroundColor: '#4F46E5' },
  spkTxt: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtAct: { color: '#FFF' },
  spkBtnBack: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#C7D2FE' },
  spkBtnBackAct: { backgroundColor: '#4F46E5' },
  spkTxtBack: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  spkTxtBackAct: { color: '#FFF' },
  flipHint: { position: 'absolute', bottom: 12, fontSize: 12, color: '#94A3B8' },
});
    
