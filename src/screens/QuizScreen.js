import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizScreen({ cards }) {
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];
  const filteredCards = cards.filter((c) => selectedChapter === 'All' || (c.chapter || 'General') === selectedChapter);

  useEffect(() => {
    generateNewQuestion();
  }, [selectedChapter, cards]);

  const generateNewQuestion = () => {
    setSelectedOption(null);
    if (filteredCards.length < 2) {
      setCurrentQuestion(null);
      return;
    }

    // Pick a random card for question
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    const questionCard = filteredCards[randomIndex];
    setCurrentQuestion(questionCard);

    // Pick 3 distractor options
    const otherCards = cards.filter((c) => c.meaning !== questionCard.meaning);
    const shuffledOthers = [...otherCards].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((c) => c.meaning);

    // Combine and shuffle options
    const allOptions = [...distractors, questionCard.meaning].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const handleSelectOption = (option) => {
    if (selectedOption !== null) return; // Prevent changing selection
    setSelectedOption(option);
    setTotalAnswered(totalAnswered + 1);
    
    if (option === currentQuestion.meaning) {
      setScore(score + 1);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalAnswered(0);
    generateNewQuestion();
  };

  if (filteredCards.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>🎯 Quiz Mode</Text>
        <View style={styles.center}>
          <Ionicons name="help-circle-outline" size={60} color="#9CA3AF" />
          <Text style={styles.emptyTxt}>Need at least 2 cards in this chapter to play a quiz.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.headerTitle}>🎯 Quiz Mode</Text>

      {/* Chapter Filter */}
      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={ch}
              style={[styles.chapPill, selectedChapter === ch && styles.activeChapPill]}
              onPress={() => { setSelectedChapter(ch); resetQuiz(); }}
            >
              <Text style={[styles.chapPillTxt, selectedChapter === ch && styles.activeChapPillTxt]}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Score Tracker */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreTxt}>Score: {score} / {totalAnswered}</Text>
        <TouchableOpacity onPress={resetQuiz}>
          <Text style={styles.resetTxt}>Reset Score</Text>
        </TouchableOpacity>
      </View>

      {currentQuestion && (
        <View style={styles.quizBox}>
          <Text style={styles.questionLabel}>WHAT IS THE MEANING OF:</Text>
          <Text style={styles.questionTerm}>{currentQuestion.term}</Text>

          <View style={styles.optionsList}>
            {options.map((opt, idx) => {
              const isCorrect = opt === currentQuestion.meaning;
              const isSelected = opt === selectedOption;
              
              let btnStyle = styles.optionBtn;
              let txtStyle = styles.optionTxt;

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = [styles.optionBtn, styles.correctBtn];
                  txtStyle = [styles.optionTxt, styles.correctTxt];
                } else if (isSelected) {
                  btnStyle = [styles.optionBtn, styles.wrongBtn];
                  txtStyle = [styles.optionTxt, styles.wrongTxt];
                }
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={btnStyle}
                  disabled={selectedOption !== null}
                  onPress={() => handleSelectOption(opt)}
                >
                  <Text style={txtStyle}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedOption !== null && (
            <TouchableOpacity style={styles.nextBtn} onPress={generateNewQuestion}>
              <Text style={styles.nextBtnTxt}>Next Question</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  chapBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, height: 38 },
  chapPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeChapPill: { backgroundColor: '#4F46E5' },
  chapPillTxt: { fontSize: 13, fontWeight: '600', color: '#475569' },
  activeChapPillTxt: { color: '#FFF' },
  scoreCard: { backgroundColor: '#EEF2FF', padding: 14, borderRadius: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  scoreTxt: { fontSize: 15, fontWeight: '700', color: '#4F46E5' },
  resetTxt: { fontSize: 13, fontWeight: '600', color: '#EF4444' },
  quizBox: { backgroundColor: '#FFF', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', elevation: 2 },
  questionLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 1, textAlign: 'center' },
  questionTerm: { fontSize: 28, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginVertical: 14 },
  optionsList: { marginTop: 10 },
  optionBtn: { backgroundColor: '#F1F5F9', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#CBD5E1' },
  optionTxt: { fontSize: 16, fontWeight: '600', color: '#1E293B', textAlign: 'center' },
  correctBtn: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  correctTxt: { color: '#15803D' },
  wrongBtn: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  wrongTxt: { color: '#B91C1C' },
  nextBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 12 },
  nextBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 15, marginRight: 6 },
  emptyTxt: { color: '#9CA3AF', fontSize: 15, marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
});
    
