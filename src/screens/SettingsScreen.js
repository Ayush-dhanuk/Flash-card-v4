import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ isDarkMode, setIsDarkMode, setCards }) {
  const handleClearAllData = () => {
    Alert.alert('Reset App Data', 'Are you sure you want to delete all saved flashcards?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Everything', style: 'destructive', onPress: () => setCards([]) },
    ]);
  };

  const themeBg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const themeCard = isDarkMode ? '#1E293B' : '#FFF';
  const themeText = isDarkMode ? '#F8FAFC' : '#1E293B';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <Text style={[styles.headerTitle, { color: themeText }]}>⚙️ Settings</Text>

      <View style={[styles.rowCard, { backgroundColor: themeCard, borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}>
        <View style={styles.rowLeft}>
          <Ionicons name={isDarkMode ? 'moon' : 'sunny-outline'} size={22} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          <Text style={[styles.rowTxt, { color: themeText }]}>Dark Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#CBD5E1', true: '#6366F1' }} />
      </View>

      <TouchableOpacity
        style={[styles.rowCard, { backgroundColor: themeCard, borderColor: isDarkMode ? '#334155' : '#E2E8F0' }]}
        onPress={handleClearAllData}
      >
        <View style={styles.rowLeft}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
          <Text style={[styles.rowTxt, { color: '#EF4444' }]}>Clear All Flashcards</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.aboutBox}>
        <Text style={styles.aboutTxt}>Flash Card v2.0</Text>
        <Text style={styles.subAbout}>Nepali Translation Supported</Text>
      </View>
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
                 
