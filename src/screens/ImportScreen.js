import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImportScreen({ cards, setCards, navigation }) {
  const [chapter, setChapter] = useState('Chapter 1');
  const [singleTerm, setSingleTerm] = useState('');
  const [singleMeaning, setSingleMeaning] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [translating, setTranslating] = useState(false);

  // Auto-translate single term via free Translation API
  const handleAutoTranslate = async () => {
    if (!singleTerm.trim()) {
      Alert.alert('Empty Term', 'Please enter a word or term to auto-translate.');
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(singleTerm)}&langpair=autodetect|en`
      );
      const data = await response.json();
      
      if (data && data.responseData && data.responseData.translatedText) {
        setSingleMeaning(data.responseData.translatedText);
      } else {
        Alert.alert('Translation Failed', 'Could not translate automatically.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error during translation.');
    } finally {
      setTranslating(false);
    }
  };

  const handleAddSingleCard = () => {
    if (!singleTerm.trim() || !singleMeaning.trim()) {
      Alert.alert('Incomplete', 'Please fill in both term and meaning.');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      term: singleTerm.trim(),
      meaning: singleMeaning.trim(),
      chapter: chapter.trim() || 'General',
      score: 0,
    };

    setCards([...cards, newCard]);
    setSingleTerm('');
    setSingleMeaning('');
    Alert.alert('Success', 'Card added successfully!');
    navigation.navigate('Study');
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const targetChapter = chapter.trim() || 'General';
    const newCards = [];

    bulkText.split('\n').forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        newCards.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
          term: parts[0],
          meaning: parts[1],
          chapter: targetChapter,
          score: 0,
        });
      }
    });

    if (newCards.length > 0) {
      setCards([...cards, ...newCards]);
      setBulkText('');
      Alert.alert('Success', `Added ${newCards.length} cards to "${targetChapter}".`);
      navigation.navigate('Study');
    } else {
      Alert.alert('Import Failed', 'Format each line as: Term, Meaning');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.headerTitle}>📥 Add / Import Cards</Text>

      <Text style={styles.label}>Chapter / Deck Name:</Text>
      <TextInput
        style={styles.inpSingle}
        placeholder="e.g. Chapter 1: Basics"
        value={chapter}
        onChangeText={setChapter}
      />

      {/* SINGLE CARD ADD WITH AUTO TRANSLATE */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Add Single Card (Auto-Translate)</Text>
        
        <Text style={styles.subLabel}>Term / Word:</Text>
        <TextInput
          style={styles.inpSingle}
          placeholder="Enter term (e.g., 안녕하세요)"
          value={singleTerm}
          onChangeText={setSingleTerm}
        />

        <TouchableOpacity
          style={styles.autoTranslateBtn}
          onPress={handleAutoTranslate}
          disabled={translating}
        >
          {translating ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={16} color="#4F46E5" />
              <Text style={styles.autoTranslateTxt}>Auto-Fill Meaning with AI</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.subLabel}>Meaning:</Text>
        <TextInput
          style={styles.inpSingle}
          placeholder="Enter meaning (or auto-fill)"
          value={singleMeaning}
          onChangeText={setSingleMeaning}
        />

        <TouchableOpacity style={styles.priBtn} onPress={handleAddSingleCard}>
          <Ionicons name="add-circle-outline" size={20} color="#FFF" />
          <Text style={styles.priBtnTxt}>Add Card</Text>
        </TouchableOpacity>
      </View>

      {/* BULK IMPORT */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Bulk CSV Import</Text>
        <Text style={styles.subLabel}>Paste lines (Term, Meaning):</Text>
        <TextInput
          style={styles.inpMulti}
          multiline
          numberOfLines={6}
          placeholder={`안녕하세요, Hello\n감사합니다, Thank You`}
          value={bulkText}
          onChangeText={setBulkText}
        />

        <TouchableOpacity style={styles.priBtn} onPress={handleBulkImport}>
          <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
          <Text style={styles.priBtnTxt}>Bulk Save Cards</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 6 },
  subLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 8, marginBottom: 4 },
  sectionCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  inpSingle: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#CBD5E1', fontSize: 15 },
  inpMulti: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#CBD5E1', fontSize: 15, textAlignVertical: 'top', height: 120, marginBottom: 12 },
  autoTranslateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', paddingVertical: 8, borderRadius: 10, marginVertical: 8 },
  autoTranslateTxt: { marginLeft: 6, color: '#4F46E5', fontWeight: '700', fontSize: 13 },
  priBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  priBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 15, marginLeft: 6 },
});
          
