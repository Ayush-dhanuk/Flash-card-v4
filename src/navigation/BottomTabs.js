<Tab.Screen name="Study">
  {(props) => (
    <StudyScreen 
      {...props} 
      cards={cards} 
      isDarkMode={isDarkMode} 
      textSize={textSize} 
      isShuffled={isShuffled} 
    />
  )}
</Tab.Screen>

<Tab.Screen name="Quiz">
  {(props) => (
    <QuizScreen 
      {...props} 
      cards={cards} 
      isDarkMode={isDarkMode} 
      textSize={textSize} 
      isShuffled={isShuffled} 
    />
  )}
</Tab.Screen>

<Tab.Screen name="Settings">
  {(props) => (
    <SettingsScreen 
      {...props} 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode} 
      textSize={textSize} 
      setTextSize={setTextSize} 
      isShuffled={isShuffled} 
      setIsShuffled={setIsShuffled} 
      setCards={setCards}
    />
  )}
</Tab.Screen>
    
