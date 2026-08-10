import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImportScreen({ cards, setCards, navigation, isDarkMode }) {
  const [chapter, setChapter] = useState('Chapter 1');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-translate batch items to Nepali via free Translation API
  const handleBulkAiTranslateAndSave = async () => {
    if (!inputText.trim()) {
      Alert.alert('Empty Input', 'Please paste words or lines to import.');
      return;
    }

    const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
    const targetChapter = chapter.trim() || 'General';
    setLoading(true);

    const newCards = [];

    for (let line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      const term = parts[0];
      let meaning = parts[1] || '';

      // If meaning is missing, auto-translate to Nepali
      if (!meaning && term) {
        try {
          const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=autodetect|ne`
          );
          const data = await res.json();
          if (data && data.responseData && data.responseData.translatedText) {
            meaning = data.responseData.translatedText;
          }
        } catch (e) {
          meaning = '—';
        }
      }

      if (term) {
        newCards.push({
          id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
          term,
          meaning: meaning || '—',
          chapter: targetChapter,
          score: 0,
        });
      }
    }

    setLoading(false);
    if (newCards.length > 0) {
      setCards([...cards, ...newCards]);
      setInputText('');
      Alert.alert('Success', `Added ${newCards.length} cards with Nepali translation.`);
      navigation.navigate('Study');
    }
  };

  const themeBg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const themeCard = isDarkMode ? '#1E293B' : '#FFF';
  const themeText = isDarkMode ? '#F8FAFC' : '#1E293B';
  const themeInput = isDarkMode ? '#334155' : '#F8FAFC';

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeBg }]} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={[styles.headerTitle, { color: themeText }]}>📥 Bulk Import & AI Translate</Text>

      <Text style={[styles.label, { color: themeText }]}>Chapter / Deck Name:</Text>
      <TextInput
        style={[styles.inpSingle, { backgroundColor: themeInput, color: themeText, borderColor: isDarkMode ? '#475569' : '#CBD5E1' }]}
        placeholder="e.g. Chapter 1: Basics"
        placeholderTextColor="#94A3B8"
        value={chapter}
        onChangeText={setChapter}
      />

      <View style={[styles.sectionCard, { backgroundColor: themeCard, borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
        <Text style={[styles.sectionTitle, { color: themeText }]}>Paste Multiple Words / Sentences</Text>
        <Text style={styles.subLabel}>
          Paste one per line. If meaning is missing, AI will auto-fill in **Nepali**!
        </Text>

        <TextInput
          style={[styles.inpMulti, { backgroundColor: themeInput, color: themeText, borderColor: isDarkMode ? '#475569' : '#CBD5E1' }]}
          multiline
          numberOfLines={8}
          placeholder={`Example 1 (Auto-Translate):\nHello\nTree\nApple\n\nExample 2 (Manual):\nBook, किताब`}
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity style={styles.priBtn} onPress={handleBulkAiTranslateAndSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={20} color="#FFF" />
              <Text style={styles.priBtnTxt}>Auto-Translate & Save Cards</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  subLabel: { fontSize: 12, color: '#64748B', marginBottom: 10, lineHeight: 18 },
  sectionCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  inpSingle: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, fontSize: 15, marginBottom: 14 },
  inpMulti: { borderRadius: 12, padding: 14, borderWidth: 1, fontSize: 15, textAlignVertical: 'top', height: 160, marginBottom: 14 },
  priBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12 },
  priBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
});
          
