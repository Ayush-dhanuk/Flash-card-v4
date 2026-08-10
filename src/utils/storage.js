import AsyncStorage from '@react-native-async-storage/async-storage';

const CARDS_KEY = '@flashcards_list';

export const getSavedCards = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CARDS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load cards', e);
    return [];
  }
};

export const saveNewCards = async (newCards) => {
  try {
    const existingCards = await getSavedCards();
    const updatedList = [...existingCards, ...newCards];
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.error('Failed to save cards', e);
    throw e;
  }
};
  
