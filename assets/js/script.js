// quiz questions and answers
const quizQuestions = [
    {
        "question": "Q: Inside which HTML element do we put the JavaScript?",
        "options": ["1. <javascript>", "2. <js>", "3. <script>", "4. <scripting>"],
        "answer": "3. <script>"
    },
    {
        "question": 'Q: What is the correct JavaScript syntax to change the content of the HTML element below? \n <p id="demo">This is a demonstration.</p>',
        "options": ['1. document.getElementById("demo").innerHTML = "Hello World!";',
            '2. #demo.innerHTML = "Hello World!";',
            '3. document.getElementByName("p").innerHTML = "Hello World!";',
            '4. document.getElement("p").innerHTML = "Hello World!";'],
        "answer": '1. document.getElementById("demo").innerHTML = "Hello World!";'
    },
    {
        "question": "Q: Where is the correct place to insert a JavaScript?",
        "options": ['1. Both the <head> section and the <body> section are correct',
            '2. The <body> section',
            '3. The <head> section'],
        "answer": "1. Both the <head> section and the <body> section are correct"

    }
];
// intial timer of 75 seconds
var totalSeconds = 75;
var secondsElapsed = 0;
var interval;
var questionIndex = 0;
var score = 0;
var allQuestionAnswered = false;
var nameScore = [];
const startQuizBtn = document.querySelector("#startQuizBtn");
const remainTime = document.querySelector("#remainTime");
const cardBody = document.querySelector("#cardBody");
const cardTitle = document.querySelector("#cardTitle");
const cardText = document.querySelector("#cardText");
const initialLabel = document.querySelector("#initialLabel");
const initialText = document.querySelector("#initialText");
const initialSubmit = document.querySelector("#initialSubmit");
const goBack = document.querySelector("#goBack");
const clearHighScore = document.querySelector("#clearHighScore");
const viewScores = document.querySelector("#viewHighScore");

initHighScores();

function startQuiz() {
    startTimer();
    hideQuizButton();
    displayQuestion();
}

function hideQuizButton() {
    startQuizBtn.classList.add("hide");
}

function showQuizButton() {
    startQuizBtn.classList.remove("hide");
}

function hideSummaryControls() {
    initialLabel.classList.add("hide");
    initialSubmit.classList.add("hide");
    initialText.classList.add("hide");
}

function displaySummaryControls() {
    initialLabel.classList.remove("hide");
    initialSubmit.classList.remove("hide");
    initialText.classList.remove("hide");
}

function displayQuestion() {
    if (questionIndex < quizQuestions.length) {
        cardTitle.textContent = quizQuestions[questionIndex].question;
        cardText.textContent = "";
        var optionsArray = quizQuestions[questionIndex].options;
        for (var j = 0; j < optionsArray.length; j++) {
            var listItem = document.createElement("li");
            listItem.textContent = optionsArray[j];
            cardText.appendChild(listItem);
        }
    }

}

function renderTime() {
    remainTime.textContent = totalSeconds - secondsElapsed;
}

function startTimer() {
    totalSeconds = 75;
    /* the "interval" variable here using "setInterval()" begins the recurring increment of the 
       secondsElapsed variable which is used to check if the time is up */
    interval = setInterval(function () {
        secondsElapsed++;
        finishQuiz();
        //So renderTime() is called here once every second.
        renderTime();
    }, 1000);

}
function stopTimer() {
    secondsElapsed = 0;
    totalSeconds = 0;
    clearInterval(interval);
    renderTime();
}

function finishQuiz() {
    if (allQuestionAnswered || (totalSeconds - secondsElapsed <= 0)) {
        displayScore();
        stopTimer();
        return;
    }
}
function updateScoreAndRenderResult(event) {
    const element = event.target;
    const userAns = element.textContent;
    const correctAns = quizQuestions[questionIndex].answer;
    const result = document.createElement("span");
    result.classList.add("result");
    element.appendChild(result);
    if (userAns == correctAns) {
        score += 1;
        element.classList.add("right");
        result.textContent = "Correct!";
    }
    else {
        secondsElapsed += 10;
        element.classList.add("wrong");
        result.textContent = "Wrong!!";
    }

}


function displayScore() {
    cardTitle.textContent = "All Done!!";
    cardText.textContent = "Your final score is: " + score;
    displaySummaryControls();
}

function continueQuiz(event) {
    const element = event.target;
    if (!allQuestionAnswered && element.matches("li")) {
        updateScoreAndRenderResult(event);
        questionIndex++;
        if (quizQuestions.length == questionIndex) {
            allQuestionAnswered = true;
        }
        // let user see if he/she answered correctly or not.
        window.setTimeout(displayQuestion, 1000);
    }

}

function displayScores(event) {
    event.preventDefault();
    storeHighScores();
    displayHighScores();
}

function displayHighScores() {
    hideSummaryControls();
    hideQuizButton();
    renderHighScores();
    showHighScoreControls();
}

function showHighScoreControls() {
    goBack.classList.remove("hide");
    clearHighScore.classList.remove("hide");
}

function hideHighScoreControls() {
    goBack.classList.add("hide");
    clearHighScore.classList.add("hide");
}

function storeHighScores() {
    const initial = initialText.value;
    initialText.value="";
    const initialScore = {};
    initialScore['initial'] = initial;
    initialScore['score'] = score;
    nameScore.push(initialScore);
    localStorage.setItem("nameScore", JSON.stringify(nameScore));
}

function renderHighScores() {
    cardTitle.textContent = "Highscores";
    if (nameScore.length > 0) {
        nameScore.sort(function (a, b) { return b.score - a.score });
        cardText.textContent = "";
        nameScore.forEach(function (item) {
            const listItem = document.createElement("li");
            listItem.textContent = item.initial + " - " + item.score;
            cardText.appendChild(listItem);
        });
    }
    else {
        cardText.textContent = "No Scores to display";
    }
}
function initHighScores() {
    const storedHighScores = localStorage.getItem("nameScore")
    if (storedHighScores.length > 0) {
        nameScore = JSON.parse(storedHighScores);
    }
}
function clearStorage() {
    localStorage.setItem("nameScore", "");
    nameScore = [];
    cardText.textContent = "All scores are cleared.";
}

function restoreOriginal() {
    cardTitle.textContent = "Coding Quiz Challenge";
    cardText.textContent = "Try to answer the following code-related questions within the time limit. Please keep in mind that the incorrect answers will penalize your scoretime by ten seconds!";
    showQuizButton();
    hideSummaryControls();
    hideHighScoreControls();
    questionIndex = 0;
    score = 0;
    allQuestionAnswered = false;
}

startQuizBtn.addEventListener("click", startQuiz);
cardText.addEventListener("click", continueQuiz);
initialSubmit.addEventListener("click", displayScores);
goBack.addEventListener("click", restoreOriginal);
clearHighScore.addEventListener("click", clearStorage);
viewScores.addEventListener("click", displayHighScores);


