import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizScreen({ cards, isDarkMode, isShuffled }) {
  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    initQuiz();
  }, [cards, isShuffled]);

  const initQuiz = () => {
    if (!cards || cards.length < 2) {
      setQuizList([]);
      return;
    }
    let list = [...cards];
    if (isShuffled) {
      list.sort(() => Math.random() - 0.5);
    }
    setQuizList(list);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    loadQuestion(list, 0);
  };

  const loadQuestion = (list, index) => {
    if (!list[index]) return;
    const current = list[index];
    const correctMeaning = current.meaning || current.back;

    // Grab 3 random incorrect choices
    const incorrects = cards
      .filter(c => (c.meaning || c.back) !== correctMeaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.meaning || c.back);

    const allOpts = [...incorrects, correctMeaning].sort(() => Math.random() - 0.5);
    setOptions(allOpts);
    setSelectedOption(null);
  };

  const handleSelect = (opt) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(opt);

    const current = quizList[currentIndex];
    const correctMeaning = current.meaning || current.back;

    if (opt === correctMeaning) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizList.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      loadQuestion(quizList, nextIdx);
    } else {
      setIsFinished(true);
    }
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const cardBg = isDarkMode ? '#121212' : '#FFFFFF';
  const textCol = isDarkMode ? '#FFFFFF' : '#1E293B';
  const subCol = isDarkMode ? '#A1A1AA' : '#64748B';
  const borderCol = isDarkMode ? '#27272A' : '#E2E8F0';

  if (!cards || cards.length < 2) {
    return (
      <View style={[styles.centered, { backgroundColor: themeBg }]}>
        <Ionicons name="school-outline" size={48} color={subCol} />
        <Text style={[styles.warnTxt, { color: textCol }]}>Add at least 2 cards to take a quiz.</Text>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View style={[styles.centered, { backgroundColor: themeBg }]}>
        <Ionicons name="trophy" size={64} color="#F59E0B" />
        <Text style={[styles.finishTitle, { color: textCol }]}>Quiz Complete!</Text>
        <Text style={[styles.scoreTxt, { color: subCol }]}>You scored {score} out of {quizList.length}</Text>
        <TouchableOpacity style={styles.restartBtn} onPress={initQuiz}>
          <Text style={styles.restartTxt}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = quizList[currentIndex];
  const correctMeaning = current ? (current.meaning || current.back) : '';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <View style={styles.topRow}>
        <Text style={[styles.progressTxt, { color: subCol }]}>Question {currentIndex + 1} of {quizList.length}</Text>
        <Text style={[styles.scoreBadge, { color: '#4F46E5' }]}>Score: {score}</Text>
      </View>

      <View style={[styles.questionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.questionLabel, { color: subCol }]}>What is the meaning of:</Text>
        <Text style={[styles.questionTerm, { color: textCol }]}>{current ? (current.term || current.front) : ''}</Text>
      </View>

      <View style={styles.optionsWrap}>
        {options.map((opt, idx) => {
          let btnStyle = { backgroundColor: cardBg, borderColor: borderCol };
          let txtStyle = { color: textCol };

          if (selectedOption !== null) {
            if (opt === correctMeaning) {
              btnStyle = { backgroundColor: '#DCFCE7', borderColor: '#22C55E' };
              txtStyle = { color: '#15803D', fontWeight: '700' };
            } else if (opt === selectedOption) {
              btnStyle = { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
              txtStyle = { color: '#B91C1C', fontWeight: '700' };
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.optionBtn, btnStyle, idx > 0 && { marginTop: 10 }]}
              onPress={() => handleSelect(opt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.optionTxt, txtStyle]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedOption !== null && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnTxt}>Next Question</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressTxt: { fontSize: 14, fontWeight: '600' },
  scoreBadge: { fontSize: 14, fontWeight: '700' },
  questionCard: { padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center', marginBottom: 20, elevation: 2 },
  questionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 },
  questionTerm: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  optionsWrap: { width: '100%', marginBottom: 20 },
  optionBtn: { width: '100%', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  optionTxt: { fontSize: 16, fontWeight: '600' },
  nextBtn: { backgroundColor: '#4F46E5', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 'auto' },
  nextBtnTxt: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  warnTxt: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  finishTitle: { fontSize: 24, fontWeight: '800', marginTop: 12 },
  scoreTxt: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  restartBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  restartTxt: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
      
