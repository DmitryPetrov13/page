// Disable right-click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});
// Start Quiz
startBtn.addEventListener('click', () => {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  userName = nameInput.value.trim();
  startPage.classList.remove('active');
  startPage.classList.add('hidden');
  setTimeout(() => {
    quizPage.classList.remove('hidden');
    quizPage.classList.add('active');
  }, 500); // Delay to allow slideOut animation to complete
  loadQuestion();
});

// Next Question
nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    endQuiz();
  }
});

// End Quiz
function endQuiz() {
  quizPage.classList.remove('active');
  quizPage.classList.add('hidden');
  setTimeout(() => {
    endPage.classList.remove('hidden');
    endPage.classList.add('active');
  }, 500); // Delay to allow slideOut animation to complete
  scoreMessage.textContent = `Congratulations, ${userName}! Your score is ${score} out of ${questions.length}.`;
  saveScore(userName, score);
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
  endPage.classList.remove('active');
  endPage.classList.add('hidden');
  setTimeout(() => {
    startPage.classList.remove('hidden');
    startPage.classList.add('active');
  }, 500); // Delay to allow slideOut animation to complete
  currentQuestionIndex = 0;
  score = 0;
});
