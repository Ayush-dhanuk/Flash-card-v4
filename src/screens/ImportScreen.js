import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { importCardsBatch } from '../services/aiService';

export default function ImportScreen({ onSaveCards, isDarkMode = true }) {
  const [chapter, setChapter] = useState('');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please paste or type words to import.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const newCards = await importCardsBatch(inputText, chapter);
      if (onSaveCards) {
        onSaveCards(newCards);
      }
      Alert.alert('Success', `Imported ${newCards.length} flashcards successfully!`);
      setInputText('');
      setChapter('');
    } catch (error) {
      Alert.alert('Import Failed', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = isDarkMode;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={[styles.container, isDark ? styles.bgDark : styles.bgLight]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Bulk Import Flashcards
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#A1A1AA' : '#64748B' }]}>
          Enter words line-by-line. AI will translate Korean words to Nepali automatically, or you can supply pre-separated pairs (e.g. "사과, स्याउ").
        </Text>

        {/* Chapter Name Input */}
        <Text style={[styles.label, { color: isDark ? '#818CF8' : '#4F46E5' }]}>
          CHAPTER / CATEGORY NAME
        </Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          placeholder="e.g. Chapter 1, Food, Verbs..."
          placeholderTextColor={isDark ? '#52525B' : '#94A3B8'}
          value={chapter}
          onChangeText={setChapter}
        />

        {/* Bulk Word Input */}
        <Text style={[styles.label, { color: isDark ? '#818CF8' : '#4F46E5' }]}>
          WORDS LIST (ONE PER LINE)
        </Text>
        <TextInput
          style={[styles.input, styles.textArea, isDark ? styles.inputDark : styles.inputLight]}
          placeholder={`의사\n아버지\n안녕하세요\n사과, स्या우`}
          placeholderTextColor={isDark ? '#52525B' : '#94A3B8'}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          value={inputText}
          onChangeText={setInputText}
        />

        {/* Import Action Button */}
        <TouchableOpacity
          style={[styles.importBtn, loading && styles.importBtnDisabled]}
          onPress={handleImport}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.btnRow}>
              <ActivityIndicator color="#FFF" size="small" />
              <Text style={styles.importBtnTxt}>Translating & Batching...</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
              <Text style={styles.importBtnTxt}>Import Words</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bgDark: { backgroundColor: '#000000' },
  bgLight: { backgroundColor: '#F8FAFC' },

  title: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 13, lineHeight: 18, marginBottom: 20 },

  label: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: '#121212',
    borderColor: '#27272A',
    color: '#FFFFFF',
  },
  inputLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    color: '#0F172A',
  },
  textArea: {
    height: 180,
  },

  importBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  importBtnDisabled: {
    backgroundColor: '#4338CA',
    opacity: 0.8,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  importBtnTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
          
