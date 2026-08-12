import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddScreen({ navigation }) {
  const [bulkInput, setBulkInput] = useState('');
  const [chapter, setChapter] = useState('');

  const handleBulkSave = async () => {
    if (!bulkInput.trim()) {
      Alert.alert('Error', 'Please enter flashcard data.');
      return;
    }

    try {
      const lines = bulkInput.split('\n');
      const newCards = lines.map((line, index) => {
        const parts = line.split(/[-–:]/); // Split by dash, en-dash, or colon
        if (parts.length >= 2) {
          return {
            id: Date.now().toString() + index,
            term: parts[0].trim(),
            meaning: parts.slice(1).join(' ').trim(),
            chapter: chapter.trim() || 'General',
          };
        }
        return null;
      }).filter(Boolean);

      if (newCards.length === 0) {
        Alert.alert('Format Error', 'Use format: Term - Meaning (one per line)');
        return;
      }

      const existingData = await AsyncStorage.getItem('@flashcards_v2_data');
      const currentCards = existingData ? JSON.parse(existingData) : [];
      const updatedCards = [...currentCards, ...newCards];

      await AsyncStorage.setItem('@flashcards_v2_data', JSON.stringify(updatedCards));
      
      setBulkInput('');
      setChapter('');
      Alert.alert('Success', `${newCards.length} flashcards added automatically!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save flashcards.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>➕ Bulk Add Flashcards</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Chapter / Category (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Greetings"
          placeholderTextColor="#666"
          value={chapter}
          onChangeText={setChapter}
        />

        <Text style={styles.label}>Cards List (Format: Term - Meaning, one per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="안녕하세요 - Hello&#10;감사합니다 - Thank you"
          placeholderTextColor="#666"
          multiline
          numberOfLines={6}
          value={bulkInput}
          onChangeText={setBulkInput}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleBulkSave}>
          <Text style={styles.saveButtonText}>Save All Flashcards</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  headerTitle: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputContainer: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 12 },
  label: { color: '#ccc', marginBottom: 5, fontSize: 14 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15 },
  textArea: { height: 120, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#6366f1', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
    
