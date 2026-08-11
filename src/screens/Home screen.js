import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ cards, setActiveTab, isDarkMode, deleteCard }) {
  const [search, setSearch] = useState('');

  const filteredCards = cards.filter(c => 
    (c.term && c.term.toLowerCase().includes(search.toLowerCase())) ||
    (c.meaning && c.meaning.toLowerCase().includes(search.toLowerCase())) ||
    (c.chapter && c.chapter.toLowerCase().includes(search.toLowerCase()))
  );

  const themeBg = isDarkMode ? '#000000' : '#F8FAFC';
  const cardBg = isDarkMode ? '#121212' : '#FFFFFF';
  const textCol = isDarkMode ? '#FFFFFF' : '#1E293B';
  const subCol = isDarkMode ? '#A1A1AA' : '#64748B';
  const borderCol = isDarkMode ? '#27272A' : '#E2E8F0';
  const inputBg = isDarkMode ? '#18181B' : '#F1F5F9';

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textCol }]}>Flash Cards</Text>
          <Text style={[styles.subtitle, { color: subCol }]}>{cards.length} Total Cards Saved</Text>
        </View>
        <TouchableOpacity style={styles.addBtnHeader} onPress={() => setActiveTab('Add')}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBox, { backgroundColor: inputBg, borderColor: borderCol }]}>
        <Ionicons name="search-outline" size={18} color={subCol} />
        <TextInput
          style={[styles.input, { color: textCol }]}
          placeholder="Search vocabulary or chapter..."
          placeholderTextColor={subCol}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={subCol} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#4F46E5' }]} onPress={() => setActiveTab('Study')}>
          <Ionicons name="book" size={22} color="#FFF" />
          <Text style={styles.actionText}>Study Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#10B981', marginLeft: 12 }]} onPress={() => setActiveTab('Quiz')}>
          <Ionicons name="school" size={22} color="#FFF" />
          <Text style={styles.actionText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.listHeader, { color: textCol }]}>Saved Vocabulary</Text>

      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.cardItem, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTopRow}>
                <Text style={[styles.termTxt, { color: textCol }]}>{item.term || item.front}</Text>
                {item.chapter && <Text style={[styles.chapterTag, { color: subCol }]}>{item.chapter}</Text>}
              </View>
              <Text style={[styles.meaningTxt, { color: subCol }]}>{item.meaning || item.back}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteCard(item.id)}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="folder-open-outline" size={48} color={subCol} />
            <Text style={[styles.emptyText, { color: subCol }]}>No flashcards found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 12, marginTop: 2 },
  addBtnHeader: { backgroundColor: '#4F46E5', padding: 10, borderRadius: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 16 },
  input: { flex: 1, marginLeft: 8, fontSize: 14 },
  actionRow: { flexDirection: 'row', marginBottom: 20 },
  actionCard: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, justifyContent: 'center' },
  actionText: { color: '#FFF', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  listHeader: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  cardItem: { flexDirection: 'row', padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center', marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  termTxt: { fontSize: 16, fontWeight: '700' },
  chapterTag: { fontSize: 11, fontWeight: '500' },
  meaningTxt: { fontSize: 13 },
  deleteBtn: { padding: 8, marginLeft: 8 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 8, fontSize: 14, fontWeight: '500' },
});
