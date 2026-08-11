import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabs({ activeTab, setActiveTab, isDarkMode }) {
  const tabs = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Study', icon: 'book-outline', activeIcon: 'book' },
    { name: 'Quiz', icon: 'school-outline', activeIcon: 'school' },
    { name: 'Add', icon: 'add-circle-outline', activeIcon: 'add-circle' },
    { name: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];

  const barBg = isDarkMode ? '#121212' : '#FFFFFF';
  const borderCol = isDarkMode ? '#27272A' : '#E2E8F0';

  return (
    <View style={[styles.tabContainer, { backgroundColor: barBg, borderTopColor: borderCol }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const color = isActive ? '#4F46E5' : (isDarkMode ? '#71717A' : '#94A3B8');

        return (
          <TouchableOpacity key={tab.name} style={styles.tabItem} onPress={() => setActiveTab(tab.name)}>
            <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={22} color={color} />
            <Text style={[styles.tabText, { color }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
});
          
