import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getSavedCards } from '../utils/storage';

export default function StudyScreen() {
  const [cards, setCards] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadCards();
    }
  }, [isFocused]);

  const loadCards = async () => {
    const savedCards = await getSavedCards();
    setCards(savedCards);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {cards.length === 0 ? (
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
          No cards available for this chapter.
        </Text>
      ) : (
        // Render your card stack here using `cards`
        <Text style={{ color: '#fff' }}>Loaded {cards.length} cards!</Text>
      )}
    </View>
  );
      }
