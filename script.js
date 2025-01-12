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
const greetingElement = document.getElementById('greeting'); // Add this to your HTML

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

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

// Function to get the current time in UTC+5
function getCurrentTimeInUTC5() {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); // Convert to UTC
  const utc5Time = new Date(utcTime + (5 * 3600000)); // Add 5 hours for UTC+5
  return utc5Time;
}

// Function to update colors based on time
function updateColorsBasedOnTime() {
  const utc5Time = getCurrentTimeInUTC5();
  const hour = utc5Time.getHours();
  const body = document.body;

  if (hour >= 5 && hour < 12) {
    // Morning (5 AM - 11:59 AM)
    body.style.background = "linear-gradient(135deg, #ff9a9e, #fad0c4)";
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12 PM - 4:59 PM)
    body.style.background = "linear-gradient(135deg, #a1c4fd, #c2e9fb)";
  } else if (hour >= 17 && hour < 21) {
    // Evening (5 PM - 8:59 PM)
    body.style.background = "linear-gradient(135deg, #fbc2eb, #a6c1ee)";
  } else {
    // Night (9 PM - 4:59 AM)
    body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
  }
}

// Call the function to update colors when the page loads
updateColorsBasedOnTime();

// Update colors every minute (optional)
setInterval(updateColorsBasedOnTime, 60000);

// Start Quiz
startBtn.addEventListener('click', () => {
  if (nameInput.value.trim() === "") {
    alert("Пожалуйста, введите свое имя!");
    return;
  }
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

// Load Question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = `${userName}, ${currentQuestion.question}`;
  optionsElement.innerHTML = '';
  currentQuestion.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option');
    button.addEventListener('click', () => selectAnswer(option));
    optionsElement.appendChild(button);
  });
  nextBtn.classList.add('hidden');
}

// Select Answer
function selectAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.disabled = true;
    if (option.textContent === currentQuestion.answer) {
      option.classList.add('correct');
    } else if (option.textContent === selectedOption) {
      option.classList.add('wrong');
    }
  });

  if (selectedOption === currentQuestion.answer) {
    score++;
    options.forEach(option => {
      if (option.textContent === selectedOption) {
        option.classList.add('correct');
      }
    });
  }

  nextBtn.classList.remove('hidden');
}

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
  }, 500);
  scoreMessage.textContent = `Поздравляем, ${userName}! Ваша оценка ${score} из ${questions.length}.`;
  saveScore(userName, score);
}

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
  endPage.classList.remove('active');
  endPage.classList.add('hidden');
  setTimeout(() => {
    startPage.classList.remove('hidden');
    startPage.classList.add('active');
  }, 500);
  currentQuestionIndex = 0;
  score = 0;
});
