const categoryCode = {
  "General Knowledge": 9,
  Computer: 18,
  "Science and Nature": 17,
  Gadgets: 30,
};

let fetchedData;
let num = 0;

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
    <h3>${renderData.question}</h3>
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
  }
}

fetchingData();
