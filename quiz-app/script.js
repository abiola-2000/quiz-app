// ======================
// GLOBAL TIME TRACKING
// ======================
let startTime;
let endTime;

// ======================
// UTIL: Shuffle
// ======================
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ======================
// QUESTIONS
// ======================
const questions = [
  {
    question: "What is HTML?",
    options: ["A. Programming Language", "B. Markup Language", "C. Database", "D. OS"],
    answer: 1
  },
  {
    question: "CSS is used for?",
    options: ["A. Styling", "B. Logic", "C. Database", "D. Hosting"],
    answer: 0
  },
  {
    question: "JavaScript is used for?",
    options: ["A. Styling", "B. Structure", "C. Logic", "D. Hosting"],
    answer: 2
  },
  {
    question: "Which is a JS framework?",
    options: ["A. HTML", "B. CSS", "C. React", "D. SQL"],
    answer: 2
  },
  {
    question: "Which is not a programming language?",
    options: ["A. Python", "B. HTML", "C. Java", "D. C++"],
    answer: 1
  },
  {
    question: "What does API mean?",
    options: ["A. App Programming Interface", "B. Application Programming Interface", "C. Applied Program Interface", "D. None"],
    answer: 1
  },
  {
    question: "Which is used for backend?",
    options: ["A. Node.js", "B. CSS", "C. HTML", "D. Bootstrap"],
    answer: 0
  },
  {
    question: "Which is database?",
    options: ["A. MySQL", "B. HTML", "C. CSS", "D. JS"],
    answer: 0
  },
  {
    question: "Which is styling?",
    options: ["A. JS", "B. CSS", "C. Python", "D. SQL"],
    answer: 1
  },
  {
    question: "Which is frontend?",
    options: ["A. Node", "B. Express", "C. HTML", "D. MongoDB"],
    answer: 2
  }
];

// ======================
// STATE
// ======================
let currentIndex = 0;
let userAnswers = new Array(questions.length).fill(null);

let timer;
let timeLeft = 10;

let totalTimer;
let totalTime = 60;

// ======================
// ELEMENTS
// ======================
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const qNum = document.getElementById("questionNumber");

// ======================
// LOAD QUESTION
// ======================
function loadQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  startTimer();

  const quizBox = document.getElementById("quizBox");

  quizBox.classList.remove("fade-in");
  quizBox.classList.add("fade-out");

  setTimeout(() => {
    let q = questions[currentIndex];

    questionEl.innerText = q.question;
    qNum.innerText = `Question ${currentIndex + 1} / ${questions.length}`;

    const progress = ((currentIndex + 1) / questions.length) * 100;
    document.getElementById("progressBar").style.width = progress + "%";

    answersEl.innerHTML = "";

    q.options.forEach((opt, index) => {
      let btn = document.createElement("button");
      btn.innerText = opt;

      if (userAnswers[currentIndex] === index) {
        btn.classList.add("selected");
      }

      btn.onclick = () => selectAnswer(index);

      answersEl.appendChild(btn);
    });

    quizBox.classList.remove("fade-out");
    quizBox.classList.add("fade-in");
  }, 200);
}

// ======================
// SELECT ANSWER
// ======================
function selectAnswer(index) {
  userAnswers[currentIndex] = index;

  Array.from(answersEl.children).forEach(btn =>
    btn.classList.remove("selected")
  );

  answersEl.children[index].classList.add("selected");
}

// ======================
// QUESTION TIMER
// ======================
function startTimer() {
  const circle = document.getElementById("progressCircle");
  const circumference = 125.6;

  timerEl.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;

    if (circle) {
      const progress = (timeLeft / 10) * circumference;
      circle.style.strokeDashoffset = circumference - progress;
    }

    if (timeLeft === 0) {
      nextQuestion();
    }
  }, 1000);
}

// ======================
// NAVIGATION
// ======================
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
  }
}

document.getElementById("nextBtn").onclick = nextQuestion;
document.getElementById("prevBtn").onclick = prevQuestion;

// ======================
// RESULT
// ======================
function showResult() {
  clearInterval(timer);
  clearInterval(totalTimer);

  endTime = new Date();

  let score = 0;

  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  let timeSpentMs = endTime - startTime;

  let seconds = Math.floor((timeSpentMs / 1000) % 60);
  let minutes = Math.floor((timeSpentMs / (1000 * 60)) % 60);
  let hours = Math.floor(timeSpentMs / (1000 * 60 * 60));

  let formattedTime = `${hours}h ${minutes}m ${seconds}s`;

  document.getElementById("quizBox").classList.add("hide");
  document.querySelector(".nav-buttons").classList.add("hide");
  document.getElementById("result").classList.remove("hide");

  document.getElementById("scoreText").innerText =
    `You scored ${score} out of ${questions.length}`;

  document.getElementById("timeSpent").innerText =
    `Time Spent: ${formattedTime}`;

  saveResult(score, formattedTime);
}

// ======================
// TOTAL TIMER
// ======================
function startTotalTimer() {
  totalTimer = setInterval(() => {
    totalTime--;

    if (totalTime <= 0) {
      clearInterval(totalTimer);
      showResult();
    }
  }, 1000);
}

// ======================
// START QUIZ
// ======================
function startQuiz() {
  const input = document.getElementById("timeInput").value;
  totalTime = input * 60;

  document.getElementById("setup").style.display = "none";
  document.getElementById("quizBox").style.display = "block";

  shuffleArray(questions);

  startTime = new Date();

  startTotalTimer();
  loadQuestion();
}

// ======================
// CLOCK (DATE + TIME)
// ======================
function startClock() {
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");

  setInterval(() => {
    const now = new Date();

    // DATE
    dateEl.innerText = now.toDateString();

    // TIME
    let hours = now.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    hours = hours.toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    let ms = now.getMilliseconds().toString().padStart(3, "0");

    clockEl.innerText = `${hours}:${minutes}:${seconds}:${ms} ${ampm}`;
  }, 10);
}

startClock();

// ======================
// SAVE RESULT
// ======================
function saveResult(score, timeSpent) {
  const submission = {
    score: score,
    total: questions.length,
    timeSpent: timeSpent,
    submittedAt: new Date().toLocaleString()
  };

  localStorage.setItem("quizResult", JSON.stringify(submission));

  document.getElementById("submissionTime").innerText =
    `Submitted at: ${submission.submittedAt}`;
}