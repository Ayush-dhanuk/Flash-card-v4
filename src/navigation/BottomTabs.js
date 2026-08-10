import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StudyScreen from '../screens/StudyScreen';
import QuizScreen from '../screens/QuizScreen';
import ImportScreen from '../screens/ImportScreen';
import ManageScreen from '../screens/ManageScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs({ cards, setCards }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Study') iconName = 'book-outline';
          else if (route.name === 'Quiz') iconName = 'help-circle-outline';
          else if (route.name === 'Import') iconName = 'cloud-upload-outline';
          else if (route.name === 'Manage') iconName = 'layers-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Study">
        {(props) => <StudyScreen {...props} cards={cards} setCards={setCards} />}
      </Tab.Screen>
      <Tab.Screen name="Quiz">
        {(props) => <QuizScreen {...props} cards={cards} setCards={setCards} />}
      </Tab.Screen>
      <Tab.Screen name="Import">
        {(props) => <ImportScreen {...props} cards={cards} setCards={setCards} />}
      </Tab.Screen>
      <Tab.Screen name="Manage">
        {(props) => <ManageScreen {...props} cards={cards} setCards={setCards} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
          }
          
