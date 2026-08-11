import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

export default function ImportScreen({ cards, setCards, navigation, isDarkMode }) {
  const [chapter, setChapter] = useState('Chapter 1');
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('ne'); // 'ne' for Nepali, 'en' for English
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ visible: false, title: '', message: '', type: 'success' });

  const handleBulkAiTranslateAndSave = async () => {
    if (!inputText.trim()) {
      setModalConfig({
        visible: true,
        title: 'Empty Input',
        message: 'Please paste words or lines to import.',
        type: 'danger',
      });
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

      if (!meaning && term) {
        try {
          const res = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(term)}&langpair=autodetect|${targetLang}`
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
      const langName = targetLang === 'ne' ? 'Nepali' : 'English';
      setModalConfig({
        visible: true,
        title: 'Success!',
        message: `Added ${newCards.length} flashcards with ${langName} translation.`,
        type: 'success',
      });
    }
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeCard = isDarkMode ? '#121212' : '#FFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#1E293B';
  const themeInput = isDarkMode ? '#18181B' : '#F8FAFC';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeBg }]} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={[styles.headerTitle, { color: themeText }]}>📥 Bulk Import & AI Translate</Text>

      <Text style={[styles.label, { color: themeText }]}>Chapter / Deck Name:</Text>
      <TextInput
        style={[styles.inpSingle, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
        placeholder="e.g. Chapter 1: Basics"
        placeholderTextColor="#71717A"
        value={chapter}
        onChangeText={setChapter}
      />

      <Text style={[styles.label, { color: themeText }]}>Auto-Translate Target Language:</Text>
      <View style={styles.langToggleContainer}>
        <TouchableOpacity
          style={[
            styles.langBtn,
            targetLang === 'ne'
              ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5' }
              : { backgroundColor: themeInput, borderColor: themeBorder },
          ]}
          onPress={() => setTargetLang('ne')}
        >
          <Text style={[styles.langBtnTxt, { color: targetLang === 'ne' ? '#FFF' : themeText }]}>🇳🇵 Nepali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langBtn,
            targetLang === 'en'
              ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5' }
              : { backgroundColor: themeInput, borderColor: themeBorder },
          ]}
          onPress={() => setTargetLang('en')}
        >
          <Text style={[styles.langBtnTxt, { color: targetLang === 'en' ? '#FFF' : themeText }]}>🇬🇧 English</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <Text style={[styles.sectionTitle, { color: themeText }]}>Paste Multiple Words / Sentences</Text>
        <Text style={[styles.subLabel, isDarkMode && { color: '#A1A1AA' }]}>
          Paste one per line. If meaning is missing, AI will auto-fill in <Text style={{ fontWeight: '700', color: '#6366F1' }}>{targetLang === 'ne' ? 'Nepali' : 'English'}</Text>!
        </Text>

        <TextInput
          style={[styles.inpMulti, { backgroundColor: themeInput, color: themeText, borderColor: themeBorder }]}
          multiline
          numberOfLines={8}
          placeholder={`Example 1 (Auto-Translate):\n안녕하세요\n나무\n\nExample 2 (Manual):\n책, किताब`}
          placeholderTextColor="#71717A"
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

      <CustomModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        isDarkMode={isDarkMode}
        onClose={() => {
          setModalConfig({ ...modalConfig, visible: false });
          if (modalConfig.type === 'success') navigation.navigate('Study');
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  subLabel: { fontSize: 12, color: '#64748B', marginBottom: 10, lineHeight: 18 },
  langToggleContainer: { flexDirection: 'row', marginBottom: 14, gap: 10 },
  langBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  langBtnTxt: { fontWeight: '700', fontSize: 14 },
  sectionCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  inpSingle: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, fontSize: 15, marginBottom: 14 },
  inpMulti: { borderRadius: 12, padding: 14, borderWidth: 1, fontSize: 15, textAlignVertical: 'top', height: 160, marginBottom: 14 },
  priBtn: { backgroundColor: '#4F46E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12 },
  priBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 15, marginLeft: 8 },
});
        
