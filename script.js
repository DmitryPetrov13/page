// Theme Switcher
const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;

themeSwitcher.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  if (body.classList.contains('dark-theme')) {
    themeSwitcher.textContent = '☀️'; // Sun icon for light mode
  } else {
    themeSwitcher.textContent = '🌙'; // Moon icon for dark mode
  }
});

// Function to share on Telegram
document.getElementById('share-telegram').addEventListener('click', () => {
  const message = `Я набрал ${score} из ${questions.length} в этом опросе! Попробуй и ты: ${window.location.href}`;
  const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// Function to share on VKontakte
document.getElementById('share-vk').addEventListener('click', () => {
  const message = `Я набрал ${score} из ${questions.length} в этом опросе! Попробуй и ты: ${window.location.href}`;
  const url = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Результат опроса')}&comment=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// Function to share via SMS (for mobile users)
document.getElementById('share-sms').addEventListener('click', () => {
  const message = `Я набрал ${score} из ${questions.length} в этом опросе! Попробуй и ты: ${window.location.href}`;
  const url = `sms:?body=${encodeURIComponent(message)}`;
  window.location.href = url;
});

// Function to play sound effects
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  sound.currentTime = 0; // Reset the sound to the beginning
  sound.play();
}

// Disable right-click
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  alert("Right-click is disabled on this website.");
});

const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const endPage = document.getElementById('end-page');
const nameInput = document.getElementById('name');
const startBtn = document.getElementById('start-btn');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const scoreMessage = document.getElementById('score-message');
const restartBtn = document.getElementById('restart-btn');
const greetingElement = document.getElementById('greeting');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let timerInterval; // Variable to hold the timer interval

const questions = [
  {
    question: "Какая ОС была первой операционной системой для компьютеров?",
    options: ["Minix", "Linux", "MS-DOS", "GM-НАА"],
    answer: "GM-НАА"
  },
  {
    question: "Как зовут Основоположника проекта GNU?",
    options: ["Илон Маск", "Линус Торвальдс ", "Ричард Столлман", "Владимир Путин"],
    answer: "Ричард Столлман"
  },
  {
    question: "Какую просьбу Линус высказал ко всем, кто уже пользовался или тестировал Linux?",
    options: ["Подарить ему собаку", "Приготовить ему тортик", "Прислать ему открытку", "Отправить 1$ на чай"],
    answer: "Прислать ему открытку"
  },
  {
    question: "Почему к разработке Linux'a присоединились сотни, потом тысячи, потом сотни тысяч добровольных помощников?",
    options: ["Лунус им заплатил", "Линус опубликовал исходный код Linux'a", "Линус обещал всем участникам бесплатные автомобили", "Разработка Linux'a была частью глобального заговора по захвату мира"],
    answer: "Линус опубликовал исходный код Linux'a"
  }
];

// Function to get the current time in UTC+5
function getCurrentTimeInUTC5() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert to UTC
  const utc5Time = new Date(utcTime + (5 * 3600000)); // Add 5 hours for UTC+5
  return utc5Time;
}

// Function to display the appropriate greeting
function displayGreeting() {
  const utc5Time = getCurrentTimeInUTC5();
  const hour = utc5Time.getHours();
  let greeting = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Доброе утро!";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Добрый день!";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Добрый вечер!";
  } else {
    greeting = "Доброй ночи!";
  }

  greetingElement.textContent = greeting;
}

// Call the greeting function when the page loads
displayGreeting();

// Shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle questions and their options
function shuffleQuestions() {
  shuffleArray(questions);
  questions.forEach((question) => {
    shuffleArray(question.options);
  });
}

// Start Quiz
startBtn.addEventListener('click', () => {
  if (nameInput.value.trim() === "") {
    alert("Пожалуйста, введите свое имя!");
    return;
  }
  playSound('button-click-sound'); // Play button-click sound
  userName = nameInput.value.trim();
  shuffleQuestions();
  startPage.classList.remove('active');
  startPage.classList.add('hidden');
  setTimeout(() => {
    quizPage.classList.remove('hidden');
    quizPage.classList.add('active');
  }, 500);
  loadQuestion();
});

// Function to start the timer
function startTimer() {
  let timeLeft = 15; // 15 seconds per question
  const timerElement = document.getElementById('timer');
  const progressCircle = document.getElementById('timer-circle-progress');
  const circumference = 157; // 2 * π * r (r = 25)

  // Update the timer and circle progress
  const updateTimer = () => {
    timerElement.textContent = timeLeft;
    const offset = circumference - (timeLeft / 15) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  };

  updateTimer(); // Initial update

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    // If time runs out, move to the next question
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      moveToNextQuestion();
    }
  }, 1000); // Update every second
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to move to the next question
function moveToNextQuestion() {
  stopTimer(); // Stop the current timer
  quizPage.classList.remove('fade-in');
  quizPage.classList.add('fade-out');

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion(); // Load the next question
    } else {
      endQuiz(); // End the quiz if there are no more questions
    }
  }, 500); // Match the duration of the fade-out animation
}

// Load Question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = `${userName}, ${currentQuestion.question}`;
  optionsElement.innerHTML = '';
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    button.style.setProperty('--index', index);
    button.addEventListener('click', () => selectAnswer(option));
    optionsElement.appendChild(button);
  });
  nextBtn.classList.add('hidden');

  // Update progress bar
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  // Start the timer for this question
  startTimer();
}

// Select Answer
function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.disabled = true;
    if (option.textContent === currentQuestion.answer) {
      option.classList.add('correct');
      playSound('correct-answer-sound');
    } else if (option.textContent === selectedOption) {
      option.classList.add('wrong');
      playSound('wrong-answer-sound');
    }
  });

  if (selectedOption === currentQuestion.answer) {
    score++;
  }

  stopTimer(); // Stop the timer when an answer is selected
  nextBtn.classList.remove('hidden');
}

// Next Question
nextBtn.addEventListener('click', () => {
  stopTimer(); // Stop the timer before moving to the next question
  moveToNextQuestion();
});

// End Quiz
function endQuiz() {
  quizPage.classList.remove('active');
  quizPage.classList.add('hidden');
  setTimeout(() => {
    endPage.classList.remove('hidden');
    endPage.classList.add('active');
  }, 500);

  scoreMessage.textContent = `Поздравляем, ${userName}! Ваша оценка ${score} из ${questions.length}.`;
  triggerConfetti();
  saveScore(userName, score);
}

// Function to trigger confetti
function triggerConfetti() {
  const emojis = ["🎉", "🎊", "🌟", "⭐", "💫", "✨", "🥳", "👏"]; // List of emojis to use
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none'; // Ensure clicks pass through
  document.body.appendChild(confettiContainer);

  const scoreMultiplier = Math.ceil(score / 2); // Adjust the number of emojis based on score
  const emojiCount = 10 + scoreMultiplier * 5; // Base count + additional emojis based on score

  for (let i = 0; i < emojiCount; i++) {
    const emoji = document.createElement('div');
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]; // Random emoji
    emoji.style.position = 'absolute';
    emoji.style.fontSize = `${Math.random() * 24 + 16}px`; // Random size between 16px and 40px
    emoji.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    emoji.style.top = `${Math.random() * -20}vh`; // Start above the viewport
    emoji.style.transform = `rotate(${Math.random() * 360}deg)`; // Random rotation
    emoji.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`; // Random fall duration
    confettiContainer.appendChild(emoji);

    // Remove emoji after animation ends
    emoji.addEventListener('animationend', () => {
      emoji.remove();
      if (confettiContainer.children.length === 0) {
        confettiContainer.remove(); // Remove container when all emojis are gone
      }
    });
  }
}

// Add keyframes for the fall animation dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Save Score to LocalStorage
function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
  const existingUserIndex = scores.findIndex(entry => entry.name === name);

  if (existingUserIndex !== -1) {
    if (score > scores[existingUserIndex].score) {
      scores[existingUserIndex].score = score;
    }
  } else {
    scores.push({ name, score });
  }

  localStorage.setItem('quizScores', JSON.stringify(scores));
  displayHighScores();
}

// Display High Scores
function displayHighScores() {
  const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
  if (scores.length > 0) {
    scoreMessage.innerHTML += `<br><br><strong>Таблица лучших результатов:</strong><br>`;
    scores.sort((a, b) => b.score - a.score).forEach((entry, index) => {
      scoreMessage.innerHTML += `${index + 1}. ${entry.name}: ${entry.score}<br>`;
    });
  }
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
  playSound('button-click-sound');
  endPage.classList.remove('active');
  endPage.classList.add('hidden');
  setTimeout(() => {
    startPage.classList.remove('hidden');
    startPage.classList.add('active');
  }, 500);
  currentQuestionIndex = 0;
  score = 0;
  progressBar.style.width = '0%'; // Reset progress bar
});
