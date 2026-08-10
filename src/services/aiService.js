// src/services/aiService.js - Free translation backup (No API Key Required)

export const importCardsBatch = async (inputText, chapterName = 'General') => {
  if (!inputText || !inputText.trim()) {
    throw new Error('Please enter some text to import.');
  }

  const lines = inputText.split('\n').filter((l) => l.trim().length > 0);
  const wordsToTranslate = [];
  const manualCards = [];

  // 1. Separate manual pairs (e.g. "사과, स्याउ") from single words
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

  // 2. Fetch translations automatically using free endpoint
  const aiCards = await Promise.all(
    wordsToTranslate.map(async (word) => {
      try {
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=ne&dt=t&q=${encodeURIComponent(
            word
          )}`
        );
        const data = await res.json();
        const translation = data[0][0][0];

        return {
          id: `${Date.now()}-${Math.random()}`,
          term: word,
          meaning: translation,
          chapter: chapterName.trim() || 'General',
        };
      } catch (err) {
        return {
          id: `${Date.now()}-${Math.random()}`,
          term: word,
          meaning: 'Translation Error',
          chapter: chapterName.trim() || 'General',
        };
      }
    })
  );

  return [...manualCards, ...aiCards];
};
          
