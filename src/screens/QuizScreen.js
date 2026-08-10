import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizScreen({ cards, isDarkMode }) {
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [currentCard, setCurrentCard] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];
  const filteredCards = cards.filter((c) => selectedChapter === 'All' || (c.chapter || 'General') === selectedChapter);

  useEffect(() => {
    generateNewQuestion();
  }, [selectedChapter, cards]);

  const generateNewQuestion = () => {
    setSelectedOption(null);
    if (filteredCards.length === 0) {
      setCurrentCard(null);
      setOptions([]);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    const targetCard = filteredCards[randomIndex];
    setCurrentCard(targetCard);

    // Shuffle options
    const otherCards = cards.filter((c) => c.id !== targetCard.id);
    const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffledOthers, targetCard].sort(() => 0.5 - Math.random());

    setOptions(allOptions);
  };

  const handleSelectOption = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const isCorrect = option.id === currentCard.id;
    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeCard = isDarkMode ? '#121212' : '#FFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#0F172A';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <Text style={[styles.title, { color: themeText }]}>🎯 Quiz Mode</Text>

      {/* Chapter Selection Bar */}
      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={ch}
              style={[styles.chapPill, isDarkMode && { backgroundColor: '#27272A' }, selectedChapter === ch && styles.activeChapPill]}
              onPress={() => setSelectedChapter(ch)}
            >
              <Text style={[styles.chapPillTxt, isDarkMode && { color: '#A1A1AA' }, selectedChapter === ch && styles.activeChapPillTxt]}>
                {ch}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Score Box */}
      <View style={[styles.scoreCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <Text style={[styles.scoreTxt, { color: themeText }]}>
          Score: <Text style={{ color: '#6366F1' }}>{score.correct}</Text> / {score.total}
        </Text>
        <TouchableOpacity onPress={() => setScore({ correct: 0, total: 0 })}>
          <Text style={styles.resetTxt}>Reset Score</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz Area */}
      {currentCard ? (
        <View style={[styles.questionCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
          <Text style={styles.qHeader}>WHAT IS THE MEANING OF:</Text>
          <Text style={[styles.qTerm, { color: themeText }]}>{currentCard.term}</Text>

          <View style={styles.optionsWrap}>
            {options.map((option) => {
              let btnStyle = [styles.optionBtn, { backgroundColor: isDarkMode ? '#18181B' : '#F1F5F9', borderColor: themeBorder }];
              let textStyle = [styles.optionTxt, { color: themeText }];

              if (selectedOption) {
                if (option.id === currentCard.id) {
                  btnStyle = [styles.optionBtn, styles.correctBtn];
                  textStyle = [styles.optionTxt, styles.whiteTxt];
                } else if (selectedOption.id === option.id) {
                  btnStyle = [styles.optionBtn, styles.wrongBtn];
                  textStyle = [styles.optionTxt, styles.whiteTxt];
                }
              }

              return (
                <TouchableOpacity key={option.id} style={btnStyle} onPress={() => handleSelectOption(option)}>
                  <Text style={textStyle}>{option.meaning}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedOption && (
            <TouchableOpacity style={styles.nextQuizBtn} onPress={generateNewQuestion}>
              <Text style={styles.nextQuizTxt}>Next Question</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={[styles.emptyTxt, { color: themeText }]}>Add cards to start the quiz!</Text>
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
  scoreCard: { width: '100%', padding: 14, borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  scoreTxt: { fontSize: 16, fontWeight: '700' },
  resetTxt: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
  questionCard: { width: '100%', padding: 20, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  qHeader: { fontSize: 11, fontWeight: '800', color: '#6366F1', letterSpacing: 1, marginBottom: 10 },
  qTerm: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  optionsWrap: { width: '100%', gap: 10 },
  optionBtn: { width: '100%', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  optionTxt: { fontSize: 18, fontWeight: '700' },
  correctBtn: { backgroundColor: '#10B981', borderColor: '#10B981' },
  wrongBtn: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  whiteTxt: { color: '#FFFFFF' },
  nextQuizBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, marginTop: 20 },
  nextQuizTxt: { color: '#FFF', fontWeight: '700', fontSize: 15, marginRight: 6 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { fontSize: 16, fontWeight: '600' },
});
                
