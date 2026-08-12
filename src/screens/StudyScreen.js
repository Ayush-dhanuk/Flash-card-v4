import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';

// Inside your StudyScreen component:
const [isFlipped, setIsFlipped] = useState(false);
const flipAnimation = useRef(new Animated.Value(0)).current;

const flipCard = () => {
  Animated.spring(flipAnimation, {
    toValue: isFlipped ? 0 : 1,
    friction: 8,
    tension: 10,
    useNativeDriver: true,
  }).start(() => {
    setIsFlipped(!isFlipped);
  });
};

const frontInterpolate = flipAnimation.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});

const backInterpolate = flipAnimation.interpolate({
  inputRange: [0, 1],
  outputRange: ['180deg', '360deg'],
});

const frontAnimatedStyle = {
  transform: [{ rotateY: frontInterpolate }],
};

const backAnimatedStyle = {
  transform: [{ rotateY: backInterpolate }],
};

// In your JSX render:
<TouchableOpacity activeOpacity={1} onPress={flipCard}>
  <View>
    <Animated.View style={[styles.card, frontAnimatedStyle, isFlipped && styles.hiddenCard]}>
      <Text style={styles.cardText}>{currentCard?.term}</Text>
      <Text style={styles.hintText}>Tap to flip</Text>
    </Animated.View>
    
    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, !isFlipped && styles.hiddenCard]}>
      <Text style={styles.cardText}>{currentCard?.meaning}</Text>
      <Text style={styles.hintText}>Tap to flip back</Text>
    </Animated.View>
  </View>
</TouchableOpacity>
    
