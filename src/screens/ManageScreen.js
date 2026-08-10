import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal';

export default function ManageScreen({ cards, setCards, isDarkMode }) {
  const [selectedChapter, setSelectedChapter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const chapterList = ['All', ...Array.from(new Set(cards.map((c) => c.chapter || 'General')))];
  const filteredCards = cards.filter((c) => selectedChapter === 'All' || (c.chapter || 'General') === selectedChapter);

  const handleDeleteCard = (id) => {
    setDeleteTargetId(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId === 'ALL') {
      setCards([]);
    } else {
      setCards(cards.filter((c) => c.id !== deleteTargetId));
    }
  };

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const themeCard = isDarkMode ? '#121212' : '#FFF';
  const themeText = isDarkMode ? '#FFFFFF' : '#1E293B';
  const themeBorder = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: themeText }]}>📂 Manage Cards</Text>
        {cards.length > 0 && (
          <TouchableOpacity onPress={() => handleDeleteCard('ALL')}>
            <Text style={styles.clearAllTxt}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chapter Selection Bar */}
      <View style={styles.chapBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chapterList.map((ch) => (
            <TouchableOpacity
              key={ch}
              style={[styles.chapPill, isDarkMode && { backgroundColor: '#27272A' }, selectedChapter === ch && styles.activeChapPill]}
              onPress={() => setSelectedChapter(ch)}
            >
              <Text style={[styles.chapPillTxt, isDarkMode && { color: '#A1A1AA' }, selectedChapter === ch && styles.activeChapPillTxt]}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cardItem, { backgroundColor: themeCard, borderColor: themeBorder }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.termTxt, { color: themeText }]}>{item.term}</Text>
              <Text style={[styles.meanTxt, isDarkMode && { color: '#A1A1AA' }]}>{item.meaning}</Text>
              <Text style={styles.chapBadge}>{item.chapter || 'General'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteCard(item.id)} style={styles.delBtn}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      <CustomModal
        visible={modalVisible}
        title={deleteTargetId === 'ALL' ? 'Delete All Cards?' : 'Delete Card?'}
        message="This action cannot be undone."
        type="danger"
        showCancel
        isDarkMode={isDarkMode}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  clearAllTxt: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
  chapBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, height: 38 },
  chapPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeChapPill: { backgroundColor: '#4F46E5' },
  chapPillTxt: { fontSize: 13, fontWeight: '600', color: '#475569' },
  activeChapPillTxt: { color: '#FFF' },
  cardItem: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, alignItems: 'center' },
  termTxt: { fontSize: 18, fontWeight: '700' },
  meanTxt: { fontSize: 14, color: '#64748B', marginTop: 2 },
  chapBadge: { fontSize: 11, color: '#4F46E5', fontWeight: '700', marginTop: 6 },
  delBtn: { padding: 8 },
});
        
