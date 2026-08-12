import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import StudyScreen from './src/screens/StudyScreen';
import QuizScreen from './src/screens/QuizScreen';
import AddScreen from './src/screens/AddScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BottomTabs from './src/navigation/BottomTabs';

const STORAGE_KEY = '@flashcards_v2_data';

const INITIAL_CARDS = [
  { id: '1', term: '안녕하세요', meaning: 'Hello (Formal)', chapter: 'Greetings' },
  { id: '2', term: '감사합니다', meaning: 'Thank you', chapter: 'Greetings' },
  { id: '3', term: '물', meaning: 'Water', chapter: 'Food & Drinks' },
  { id: '4', term: '사과', meaning: 'Apple', chapter: 'Food & Drinks' },
  { id: '5', term: '학교', meaning: 'School', chapter: 'Places' },
];

export default function App() {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [activeTab, setActiveTab] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [textSize, setTextSize] = useState('Medium');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadStoredData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveStoredData(cards);
    }
  }, [cards, isLoaded]);

  const loadStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cards', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveStoredData = async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save cards', e);
    }
  };

  const addCard = (newCard) => {
    setCards([ { id: Date.now().toString(), ...newCard }, ...cards ]);
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen cards={cards} setActiveTab={setActiveTab} isDarkMode={isDarkMode} deleteCard={deleteCard} />;
      case 'Study':
        return <StudyScreen cards={cards} isDarkMode={isDarkMode} textSize={textSize} isShuffled={isShuffled} />;
      case 'Quiz':
        return <QuizScreen cards={cards} isDarkMode={isDarkMode} isShuffled={isShuffled} />;
      case 'Add':
        return <AddScreen onAddCard={addCard} isDarkMode={isDarkMode} setActiveTab={setActiveTab} />;
      case 'Settings':
        return <SettingsScreen isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setCards={setCards} textSize={textSize} setTextSize={setTextSize} isShuffled={isShuffled} setIsShuffled={setIsShuffled} />;
      default:
        return <HomeScreen cards={cards} setActiveTab={setActiveTab} isDarkMode={isDarkMode} deleteCard={deleteCard} />;
    }
  };

  const themeBg = isDarkMode ? '#000000' : '#F1F5F9';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={themeBg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.content}>
          {renderScreen()}
        </View>
        <BottomTabs activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1 },
});
