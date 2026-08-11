import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';

import StudyScreen from '../screens/StudyScreen';
import QuizScreen from '../screens/QuizScreen';
import ImportScreen from '../screens/ImportScreen';
import ManageScreen from '../screens/ManageScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs({ cards, setCards }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#18181B' : '#E2E8F0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: isDarkMode ? '#71717A' : '#64748B',
        // Adds smooth fade and scale transition animation when switching tabs
        sceneContainerStyle: {
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        },
        tabBarAnimationEnabled: true,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 150,
          },
        },
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
          
