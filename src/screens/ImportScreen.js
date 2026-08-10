import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { importCardsBatch } from '../services/aiService';

export default function ImportScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some words to import.');
      return;
    }

    setLoading(true);

    try {
      const newCards = await importCardsBatch(inputText, chapterName);

      if (!newCards || newCards.length === 0) {
        Alert.alert('Notice', 'No cards were created.');
        return;
      }

      if (route?.params?.onImportCards) {
        route.params.onImportCards(newCards);
      }

      Alert.alert(
        'Success',
        `Successfully imported ${newCards.length} flashcard(s)!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setInputText('');
              setChapterName('');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Import Failed', error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bulk Import Flashcards</Text>
      <Text style={styles.subtitle}>
        Enter words line-by-line to automatically translate from Korean to Nepali.
      </Text>

      <Text style={styles.label}>CHAPTER / CATEGORY NAME</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Chapter 1, Food, Verbs..."
        placeholderTextColor="#666"
        value={chapterName}
        onChangeText={setChapterName}
      />

      <Text style={styles.label}>WORDS (ONE PER LINE)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder={"사과\n바나나\n우유"}
        placeholderTextColor="#666"
        multiline
        numberOfLines={6}
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleImport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Import Words</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F12',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5856D6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
      
