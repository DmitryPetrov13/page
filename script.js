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

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars"
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
    answer: "Harper Lee"
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
    answer: "Blue Whale"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Oxygen", "Gold", "Iron", "Carbon"],
    answer: "Oxygen"
  }
];

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
  shuffleArray(questions); // Shuffle the order of questions
  questions.forEach((question) => {
    shuffleArray(question.options); // Shuffle the order of options for each question
  });
}

// Start Quiz
startBtn.addEventListener('click', () => {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  userName = nameInput.value.trim();
  shuffleQuestions(); // Shuffle questions and options before starting the quiz
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
  scoreMessage.textContent = `Congratulations, ${userName}! Your score is ${score} out of ${questions.length}.`;
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
    scoreMessage.innerHTML += `<br><br><strong>High Scores:</strong><br>`;
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
