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
  }
];

// Start Quiz
startBtn.addEventListener('click', () => {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name!");
    return;
  }
  startPage.classList.add('hidden');
  quizPage.classList.remove('hidden');
  loadQuestion();
});

// Load Question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
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
  quizPage.classList.add('hidden');
  endPage.classList.remove('hidden');
  scoreMessage.textContent = `Congratulations, ${nameInput.value}! Your score is ${score} out of ${questions.length}.`;
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  endPage.classList.add('hidden');
  startPage.classList.remove('hidden');
});
