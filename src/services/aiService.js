const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const importCardsBatch = async (inputText, chapterName = 'General') => {
  if (!inputText || !inputText.trim()) {
    throw new Error('Please enter some text to import.');
  }

  const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
  const wordsToTranslate = [];
  const manualCards = [];

  // 1. Separate manual entries (e.g. "term, meaning") from single words needing AI translation
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

  // If no words need AI translation, return manual cards immediately
  if (wordsToTranslate.length === 0) {
    return manualCards;
  }

  // 2. Batch all untranslated words in ONE single prompt
  const prompt = `You are a translator. Translate the following list of Korean words to Nepali. 
Return ONLY a raw JSON array of objects with keys "term" (the Korean word) and "meaning" (the Nepali translation). 
Do NOT wrap in markdown formatting, code blocks, or extra text.

Words to translate:
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('No response returned from translation service.');
    }

    // Clean JSON formatting if markdown ```json tags are returned
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
    throw new Error('Failed to translate words. Check your connection or API key.');
  }
};
        
