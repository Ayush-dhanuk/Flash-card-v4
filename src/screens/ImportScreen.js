import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { importCardsBatch } from '../services/aiService';

// Ensure you import your context or state updater function
// e.g., import { useCards } from '../context/CardContext';

export default function ImportScreen() {
  const [inputText, setInputText] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [loading, setLoading] = useState(false);

  // Example context method to save new cards:
  // const { addCards } = useCards();

  const handleImport = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some words to import.');
      return;
    }

    setLoading(true);

    try {
      // 1. Get generated cards from the service
      const newCards = await importCardsBatch(inputText, chapterName);

      if (newCards.length === 0) {
        Alert.alert('Notice', 'No valid words found to import.');
        return;
      }

      // 2. CRITICAL STEP: Save newCards into your app state / AsyncStorage
      // e.g., await addCards(newCards); or await saveToStorage(newCards);

      Alert.alert('Success', `Imported ${newCards.length} cards successfully!`);
      setInputText('');
      setChapterName('');
    } catch (error) {
      Alert.alert('Import Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your screen JSX here...
  );
}
