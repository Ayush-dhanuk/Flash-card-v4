import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar, SafeAreaView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './src/navigation/BottomTabs';

const STORAGE_KEY = '@flashcards_chapters_v7';
const DEFAULT_CARDS = [
  { id: '1', term: '안녕하세요', meaning: 'Hello', chapter: 'Chapter 1', score: 0 },
  { id: '2', term: '감사합니다', meaning: 'Thank You', chapter: 'Chapter 1', score: 0 },
  { id: '3', term: '나무', meaning: 'Tree', chapter: 'Chapter 2', score: 0 },
];

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Settings State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [textSize, setTextSize] = useState('Medium');
  const [isShuffled, setIsShuffled] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setCards(stored ? JSON.parse(stored) : DEFAULT_CARDS);
    } catch (e) {
      setCards(DEFAULT_CARDS);
    } finally {
      setLoading(false);
    }
  };

  const saveCards = async (newCards) => {
    setCards(newCards);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const themeBg = isDarkMode ? '#000000' : '#FFFFFF';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={themeBg} 
      />
      <NavigationContainer>
        <BottomTabs 
          cards={cards} 
          setCards={saveCards} 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          textSize={textSize}
          setTextSize={setTextSize}
          isShuffled={isShuffled}
          setIsShuffled={setIsShuffled}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
      
