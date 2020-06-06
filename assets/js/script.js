// quiz questions and answers
const quizQuestions = [
    {
        "question": "Q: Inside which HTML element do we put the JavaScript?",
        "options": ["1. <javascript>", "2. <js>", "3. <script>", "4. <scripting>"],
        "answer": "3. <script>"
    },
    {
        "question": "Q: How do you declare a variable in JavaScript?",
        "options": ["1. var a;",
            "2. variable a;",
            "3. say a;",
            "4. assume a" ],
        "answer": "1. var a;"
    },
    {
        "question": "Q: Where is the correct place to insert a JavaScript?",
        "options": ['1. Both the <head> section and the <body> section are correct',
            '2. The <body> section',
            '3. The <head> section'],
        "answer": "1. Both the <head> section and the <body> section are correct"

    },
    {
        "question" : "Q: how do you declare a function in JavaScript?",
        "options" : ["1. method m1()", "2. function m1 {}", "3. function m1() {}", "4. public void m1() {}"],
        "answer" : "3. function m1() {}"
    },
    {
        "question" : "Q: What are the two arguments of addEventListener function?",
        "options" : ["1. event and html element", "2. name of event and function to be executed on event ocurrence"
                      ,"3. type of event and event", "4. event and event count"],
        "answer" : "2. name of event and function to be executed on event ocurrence"
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
var quizInProgress = false;
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
    quizInProgress = true;
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
        score += 5;
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
    hideHighScoreControls();
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
    quizInProgress = false;
    event.preventDefault();
    storeHighScores();
    displayHighScores();    
}

function displayHighScores() {
    if(quizInProgress)
    {
        alert("Please finish current ongoing quiz before viewing high scores!!");
        return;
    }
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
    if (null != storedHighScores && storedHighScores.length > 0) {
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
    enableHighScoreLink();
}


startQuizBtn.addEventListener("click", startQuiz);
cardText.addEventListener("click", continueQuiz);
initialSubmit.addEventListener("click", displayScores);
goBack.addEventListener("click", restoreOriginal);
clearHighScore.addEventListener("click", clearStorage);
viewScores.addEventListener("click", displayHighScores);


