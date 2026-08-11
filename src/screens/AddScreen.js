import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddScreen({ onAddCard, isDarkMode, setActiveTab }) {
  const [term, setTerm] = useState('');
  const [meaning, setMeaning] = useState('');
  const [chapter, setChapter] = useState('');

  const handleSave = () => {
    if (!term.trim() || !meaning.trim()) return;
    onAddCard({
      term: term.trim(),
      meaning: meaning.trim(),
      chapter: chapter.trim() || 'General',
    });
    setTerm('');
    setMeaning('');
    setChapter('');
    setActiveTab('Home');
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const cardBg = isDarkMode ? '#121212' : '#FFFFFF';
  const textCol = isDarkMode ? '#FFFFFF' : '#1E293B';
  const subCol = isDarkMode ? '#A1A1AA' : '#64748B';
  const borderCol = isDarkMode ? '#27272A' : '#E2E8F0';
  const inputBg = isDarkMode ? '#18181B' : '#F1F5F9';

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeBg }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.headerTitle, { color: textCol }]}>➕ Add New Flashcard</Text>

      <View style={[styles.formCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.label, { color: textCol }]}>Vocabulary / Term *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, borderColor: borderCol, color: textCol }]}
          placeholder="e.g. 안녕하세요"
          placeholderTextColor={subCol}
          value={term}
          onChangeText={setTerm}
        />

        <Text style={[styles.label, { color: textCol }]}>Meaning / Definition *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, borderColor: borderCol, color: textCol }]}
          placeholder="e.g. Hello"
          placeholderTextColor={subCol}
          value={meaning}
          onChangeText={setMeaning}
        />

        <Text style={[styles.label, { color: textCol }]}>Chapter / Category (Optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBg, borderColor: borderCol, color: textCol }]}
          placeholder="e.g. Greetings"
          placeholderTextColor={subCol}
          value={chapter}
          onChangeText={setChapter}
        />

        <TouchableOpacity 
          style={[styles.saveBtn, (!term.trim() || !meaning.trim()) && { opacity: 0.5 }]} 
          onPress={handleSave}
          disabled={!term.trim() || !meaning.trim()}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.saveBtnTxt}>Save Flashcard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  formCard: { padding: 20, borderRadius: 20, borderWidth: 1, elevation: 2 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14 },
  saveBtn: { flexDirection: 'row', backgroundColor: '#4F46E5', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  saveBtnTxt: { color: '#FFF', fontSize: 15, fontWeight: '700', marginLeft: 8 },
});
    
