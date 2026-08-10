const GEMINI_API_KEY = 'AQ.Ab8RN6KgSFiOHSsjC6fvPw2t_DI-1MNlu8U0FFHVfFd95G7JHA';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const importCardsBatch = async (inputText, chapterName = 'General') => {
  if (!inputText || !inputText.trim()) {
    throw new Error('Please enter some text to import.');
  }

  const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
  const wordsToTranslate = [];
  const manualCards = [];

  // Separate pre-paired entries (e.g., "사과, स्याउ") from words needing translation
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

  const prompt = `Translate the following Korean words to Nepali:
${wordsToTranslate.join('\n')}

Return a JSON array where each object has keys "term" (Korean word) and "meaning" (Nepali translation).`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Google Error Response:', JSON.stringify(data, null, 2));
      throw new Error(data?.error?.message || `HTTP ${response.status}`);
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Received an empty response from AI.');
    }

    const translatedList = JSON.parse(rawText);

    const aiCards = translatedList.map((item) => ({
      id: `${Date.now()}-${Math.random()}`,
      term: item.term,
      meaning: item.meaning,
      chapter: chapterName.trim() || 'General',
    }));

    return [...manualCards, ...aiCards];
  } catch (error) {
    console.error('Batch import failed:', error);
    throw error;
  }
};
  
