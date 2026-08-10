import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

export default function SettingsScreen({ isDarkMode, setIsDarkMode, setCards }) {
  const [modalVisible, setModalVisible] = useState(false);

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeCard = isDarkMode ? '#121212' : '#FFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#1E293B';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <Text style={[styles.headerTitle, { color: themeText }]}>⚙️ Settings</Text>

      <View style={[styles.rowCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <View style={styles.rowLeft}>
          <Ionicons name={isDarkMode ? 'moon' : 'sunny-outline'} size={22} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          <Text style={[styles.rowTxt, { color: themeText }]}>AMOLED Dark Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#CBD5E1', true: '#6366F1' }} />
      </View>

      <TouchableOpacity
        style={[styles.rowCard, { backgroundColor: themeCard, borderColor: themeBorder }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
          <Text style={[styles.rowTxt, { color: '#EF4444' }]}>Clear All Flashcards</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.aboutBox}>
        <Text style={[styles.aboutTxt, isDarkMode && { color: '#71717A' }]}>Flash Card v2.0</Text>
        <Text style={[styles.subAbout, isDarkMode && { color: '#52525B' }]}>Nepali Translation Supported</Text>
      </View>

      <CustomModal
        visible={modalVisible}
        title="Clear All Flashcards?"
        message="Are you sure you want to delete all saved flashcards from your phone?"
        type="danger"
        showCancel
        isDarkMode={isDarkMode}
        onClose={() => setModalVisible(false)}
        onConfirm={() => setCards([])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  rowCard: { padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowTxt: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  aboutBox: { marginTop: 40, alignItems: 'center' },
  aboutTxt: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  subAbout: { fontSize: 12, color: '#64748B', marginTop: 4 },
});
          
