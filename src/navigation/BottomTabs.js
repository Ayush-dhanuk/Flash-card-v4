import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StudyScreen from '../screens/StudyScreen';
import QuizScreen from '../screens/QuizScreen';
import ImportScreen from '../screens/ImportScreen';
import ManageScreen from '../screens/ManageScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs({ cards, setCards }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#334155' : '#E2E8F0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: isDarkMode ? '#94A3B8' : '#64748B',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Study') iconName = 'book-outline';
          else if (route.name === 'Quiz') iconName = 'help-circle-outline';
          else if (route.name === 'Import') iconName = 'cloud-upload-outline';
          else if (route.name === 'Manage') iconName = 'layers-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Study">
        {(props) => <StudyScreen {...props} cards={cards} isDarkMode={isDarkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Quiz">
        {(props) => <QuizScreen {...props} cards={cards} isDarkMode={isDarkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Import">
        {(props) => <ImportScreen {...props} cards={cards} setCards={setCards} isDarkMode={isDarkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Manage">
        {(props) => <ManageScreen {...props} cards={cards} setCards={setCards} isDarkMode={isDarkMode} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setCards={setCards} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
