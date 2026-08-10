// Replace with your actual Gemini API Key from https://aistudio.google.com/
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AQ.Ab8RN6LlOtEHe3Gdvt4LgCn10KmKSTr5YcrRIg95sq9KrsV0oA}`;

export const importCardsBatch = async (inputText, chapterName = 'General') => {
  if (!inputText || !inputText.trim()) {
    throw new Error('Please enter some text to import.');
  }

  const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
  const wordsToTranslate = [];
  const manualCards = [];

  lines.forEach((line) => {
    const parts = line.split(/[,,\t=]/).map((p) => p.trim());
    if (parts.length >= 2 && parts[1]) {
      manualCards.push({
        id: `${Date.now()}-${Math.random()}`,
        term: parts[0],
        meaning: parts[1],
        chapter: chapterName.trim() || 'General',
      });
    } else {
      wordsToTranslate.push(parts[0]);
    }
  });

  if (wordsToTranslate.length === 0) {
    return manualCards;
  }

  const prompt = `You are a Korean-to-Nepali translator. Translate the following list of Korean words to Nepali. 
Return ONLY a valid JSON array of objects with keys "term" (the Korean word) and "meaning" (the Nepali translation). 
Do NOT wrap in markdown or extra formatting.

Words:
${JSON.stringify(wordsToTranslate)}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('API Error details:', errorResponse);
      throw new Error(`API returned status ${response.status}. Check key or limits.`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response from AI.');
    }

    const cleanJsonText = rawText.replace(/```json|```/gi, '').trim();
    const translatedList = JSON.parse(cleanJsonText);

    const aiCards = translatedList.map((item) => ({
      id: `${Date.now()}-${Math.random()}`,
      term: item.term,
      meaning: item.meaning,
      chapter: chapterName.trim() || 'General',
    }));

    return [...manualCards, ...aiCards];
  } catch (error) {
    console.error('Batch import failed:', error);
    throw new Error(error.message || 'Failed to translate words.');
  }
};
                   
