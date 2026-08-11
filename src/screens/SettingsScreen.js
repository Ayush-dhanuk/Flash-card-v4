import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

export default function SettingsScreen({ 
  isDarkMode, 
  setIsDarkMode, 
  setCards, 
  textSize = 'Medium', 
  setTextSize = () => {}, 
  isShuffled = false, 
  setIsShuffled = () => {} 
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeCard = isDarkMode ? '#121212' : '#FFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#1E293B';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';
  const themeInput = isDarkMode ? '#18181B' : '#F1F5F9';

  const fontSizes = ['Small', 'Medium', 'Large'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeBg }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={[styles.headerTitle, { color: themeText }]}>⚙️ Settings</Text>

      {/* Dark Mode Toggle */}
      <View style={[styles.rowCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <View style={styles.rowLeft}>
          <Ionicons name={isDarkMode ? 'moon' : 'sunny-outline'} size={22} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          <Text style={[styles.rowTxt, { color: themeText }]}>Dark / Light Mode</Text>
        </View>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ false: '#CBD5E1', true: '#6366F1' }} />
      </View>

      {/* Shuffle Cards Toggle */}
      <View style={[styles.rowCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <View style={styles.rowLeft}>
          <Ionicons name="shuffle-outline" size={22} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.rowTxt, { color: themeText, marginLeft: 0 }]}>Shuffle Card Order</Text>
            <Text style={[styles.subRowTxt, isDarkMode && { color: '#A1A1AA' }]}>Randomize order for study and quiz</Text>
          </View>
        </View>
        <Switch value={isShuffled} onValueChange={setIsShuffled} trackColor={{ false: '#CBD5E1', true: '#6366F1' }} />
      </View>

      {/* Text Size Adjustment */}
      <View style={[styles.sectionCard, { backgroundColor: themeCard, borderColor: themeBorder }]}>
        <View style={styles.rowLeft}>
          <Ionicons name="text-outline" size={22} color={isDarkMode ? '#818CF8' : '#4F46E5'} />
          <Text style={[styles.rowTxt, { color: themeText }]}>Flashcard Text Size</Text>
        </View>
        <View style={styles.sizeSelectorRow}>
          {fontSizes.map((size, index) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBtn,
                { backgroundColor: themeInput, borderColor: themeBorder },
                index > 0 && { marginLeft: 8 },
                textSize === size && styles.sizeBtnActive,
              ]}
              onPress={() => setTextSize(size)}
            >
              <Text style={[styles.sizeBtnTxt, { color: themeText }, textSize === size && styles.sizeBtnTxtActive]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Clear All Data */}
      <TouchableOpacity
        style={[styles.rowCard, { backgroundColor: themeCard, borderColor: themeBorder, marginTop: 10 }]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
          <Text style={[styles.rowTxt, { color: '#EF4444' }]}>Clear All Flashcards / Reset App</Text>
        </View>
      </TouchableOpacity>

      {/* App Version Info */}
      <View style={styles.aboutBox}>
        <Text style={[styles.aboutTxt, isDarkMode && { color: '#71717A' }]}>Flash Card v1.0.0</Text>
        <Text style={[styles.subAbout, isDarkMode && { color: '#52525B' }]}>Korean, Nepali & English Supported</Text>
      </View>

      <CustomModal
        visible={modalVisible}
        title="Clear All Flashcards?"
        message="Are you sure you want to delete all saved flashcards and restart fresh?"
        type="danger"
        showCancel
        isDarkMode={isDarkMode}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setCards([]);
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  rowCard: { padding: 16, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowTxt: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  subRowTxt: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sizeSelectorRow: { flexDirection: 'row', marginTop: 12 },
  sizeBtn: { flex: 1, paddingVertical: 8, borderWidth: 1, borderRadius: 10, alignItems: 'center' },
  sizeBtnActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  sizeBtnTxt: { fontSize: 13, fontWeight: '600' },
  sizeBtnTxtActive: { color: '#FFF' },
  aboutBox: { marginTop: 30, alignItems: 'center' },
  aboutTxt: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },
  subAbout: { fontSize: 12, color: '#64748B', marginTop: 4 },
});
        
