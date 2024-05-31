const categoryCode = {
  "General Knowledge": 9,
  Computer: 18,
  "Science and Nature": 17,
  Gadgets: 30,
};

let fetchedData;
let num = 0;
let timelimit = 120;
let currentPlayerIndex = 0;

const players = [
  { name: "Player1", score: 0 },
  { name: "Player2", score: 0 },
];

async function fetchingData() {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=18&type=multiple`
    );
    const data = await response.json();

    const handledData = data.results.map((item, index) => {
      const wrongAnswersList = item.incorrect_answers.map((answer) =>
        renderCharactor(answer)
      );
      return {
        id: index,
        question: renderCharactor(item.question),
        answers: [...wrongAnswersList, renderCharactor(item.correct_answer)],
        correct_answer: renderCharactor(item.correct_answer),
      };
    });
    fetchedData = handledData;
    console.log("Fetched data:", fetchedData);
    renderHTML(num);
  } catch (error) {
    console.error("Cannot connect to API server :", error);
  }
}

function renderCharactor(str) {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderHTML(questionNum) {
  const renderData = fetchedData[questionNum];
  const root = document.getElementById("root");
  shuffleArray(renderData.answers);

  root.innerHTML = `
    <div>
    <h3 class="question">${renderData.question}</h3>
    ${renderData.answers
      .map(
        (answer) =>
          `<p class="answer" onclick="checkAnswer(event, '${answer}', ${questionNum})">${answer}</p>`
      )
      .join("")}
    <button onclick="renderNextQuestion()">Next</button>
</div>
    `;
}

function checkAnswer(event, selectedAnswer, questionNum) {
  const renderData = fetchedData[questionNum];
  const selectedElement = event.target;
  if (selectedAnswer === renderData.correct_answer) {
    selectedElement.classList.add("correct");
    players[currentPlayerIndex].score++;
  } else {
    selectedElement.classList.add("incorrect");
  }
  const answerElements = document.querySelectorAll(".answer");
  answerElements.forEach((answer) => {
    if (answer.textContent === renderData.correct_answer) {
      answer.classList.add("correct");
    }
    answer.onclick = null;
  });
}

function renderNextQuestion() {
  if (num < fetchedData.length - 1) {
    num++;
    renderHTML(num);
  } else {
    document.getElementById(
      "root"
    ).innerHTML = `<button onclick="showScore()">Show Score</button>`;
  }
}

function showScore() {
  const root = document.getElementById("root");
  root.innerHTML = `<h2>${players[currentPlayerIndex].name}'s Score: ${players[currentPlayerIndex].score}</h2>`;
  if (currentPlayerIndex < players.length - 1) {
    root.innerHTML += `<button onclick="nextPlayer()">Next Player</button>`;
  } else {
    root.innerHTML += `<button onclick="showFinalScores()">Show Final Scores</button>`;
  }
}

function nextPlayer() {
  currentPlayerIndex++;
  num = 0;
  players[currentPlayerIndex].score = 0;
  fetchingData();
}

function showFinalScores() {
  const root = document.getElementById("root");
  const winner =
    players[0].score > players[1].score
      ? players[0].name
      : players[1].score > players[0].score
      ? players[1].name
      : "It's a tie!";
  root.innerHTML = `
    <h2>${players[0].name}'s Score: ${players[0].score}</h2>
    <h2>${players[1].name}'s Score: ${players[1].score}</h2>
    <h2>Winner: ${winner}</h2>
  `;
}

fetchingData();

const renderTime = document.getElementById("timer");

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const timer = setInterval(() => {
  timelimit = timelimit - 1;
  console.log(timelimit);
  renderTime.textContent = formatTime(timelimit);
  if (timelimit === 0) {
    clearInterval(timer);
    renderTime.textContent = "Times up";
  }
}, 1000);

const renderName = document.getElementById("player");

function onChangeName(event, index) {
  players[index].name = event.target.value;
  renderName.textContent = players.map((player) => player.name).join(", ");
}

const renderInputName = document.getElementById("inputName");

renderInputName.innerHTML = players
  .map(
    (player, index) =>
      `
      <label for=${player.name}> Change your Name ${player.name} </label>
      <input type="text" id="${player.name}" placeholder="Change your name here" oninput="onChangeName(event, ${index})">
      `
  )
  .join("");

// This part is to hide home page after entering quiz .Taha
document.addEventListener("DOMContentLoaded", () => {
  const homeContainer = document.querySelector(".home-container");
  const quizContainer = document.querySelector(".quiz-container");
  const playerSpan = document.getElementById("player");

  document.querySelectorAll(".home-container button").forEach((button) => {
    button.addEventListener("click", () => {
      const playerName = button.textContent;
      playerSpan.textContent = `You are ${playerName}`;
      homeContainer.style.display = "none";
      quizContainer.style.display = "flex";
    });
  });
});
