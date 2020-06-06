// quiz questions and answers.
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
            "4. assume a"],
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
        "question": "Q: how do you declare a function in JavaScript?",
        "options": ["1. method m1()", "2. function m1 {}", "3. function m1() {}", "4. public void m1() {}"],
        "answer": "3. function m1() {}"
    },
    {
        "question": "Q: What are the two arguments of addEventListener function?",
        "options": ["1. event and html element", "2. name of event and function to be executed on event ocurrence"
            , "3. type of event and event", "4. event and event count"],
        "answer": "2. name of event and function to be executed on event ocurrence"
    }
];
// total quiz time variable of 75 seconds.
var totalSeconds = 75;
var secondsElapsed = 0;
var interval;
var questionIndex = 0;
//user current score
var score = 0;
var allQuestionAnswered = false;
//intial and score object array to be persisted and redered to view high scores.
var nameScore = [];
//if quiz in progress then view high scores not allowed using this variable.
var quizInProgress = false;
// all relevant html elements to be used to register events or update html dynamically.
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
const optionsList = document.querySelector("#optionsList");

initHighScores();

/**
 * this is invoked to start the quiz and display first question, once user clicks on start quiz button.
 */
function startQuiz() {
    quizInProgress = true;
    startTimer();
    hideQuizButton();
    displayQuestion();
}

/**
 * displays next question from quizQuestions array based on current questionIndex
 * i.e. if all questions not yet displayed then display question corresponding to current value of questionIndex.
 */
function displayQuestion() {
    if (questionIndex < quizQuestions.length) {
        cardTitle.textContent = quizQuestions[questionIndex].question;
        cardText.textContent = "";
        optionsList.textContent = "";
        var optionsArray = quizQuestions[questionIndex].options;
        for (var j = 0; j < optionsArray.length; j++) {
            var listItem = document.createElement("li");
            listItem.textContent = optionsArray[j];
            optionsList.appendChild(listItem);
        }
    }

}

/**
 * once user clicks any option to answer then this method is invoked to check if user answered correctly or not
 * and increase question index, update score and time accordingly and finally inform user if current question 
 * answer is correct or not.
 * @param {*} event is used to get the element where user clicked to answer the question and any click outisde li
 * element is ignored.
 */
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

/**
 * add a text Correct/Wrong in user selected option, float it right and change the selected option 
 * background color to red for wrong and green for
 * correct answer using css approperiate class.
 * also determines if answer correct or not using quizQuestions array
 * @param {*} event used to get list element which was clicked by user as question answer.
 */
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

/**
 * display user current score and stops timer if user has answered all questions or no more time is left.
 */
function finishQuiz() {
    if (allQuestionAnswered || (totalSeconds - secondsElapsed <= 0)) {
        displayUserScore();
        stopTimer();
        return;
    }
}

/**
 * updates card to display user current score and displays controls to let user provide his/her initials
 * and also hides highscore controls from card as not relevant currently.
 */
function displayUserScore() {
    cardTitle.textContent = "All Done!!";
    optionsList.textContent = "";
    cardText.textContent = "Your final score is: " + score;
    showInitialControls();
    hideHighScoreControls();
}

/**
 * once user has submitted his/her initials then set quizinprogress to false, update intialscore array and persist same in
 * localstorage, sort the array and display high score in descending order i.e. max at top and min at bottom.
 */
function processHighScores() {
    quizInProgress = false;
    storeHighScores();
    displayHighScores();
}

/**
 * once user clicks on view HighScore then if there is a quiz in progress then prevent user to check highscore
 * and force user to continue current quiz. IF no quiz in progress then hide initial and start quiz controls
 * and displays high scores in descending order and display related controls like go back and clear highscore buttons.
 */
function displayHighScores() {
    if (quizInProgress) {
        alert("Please finish current ongoing quiz before viewing high scores!!");
        return;
    }
    hideInitialControls();
    hideQuizButton();
    renderHighScores();
    showHighScoreControls();
}


/**
 * pushes current user intial and score to nameScore array and then conver it to string and persist it in localstorage.
 */
function storeHighScores() {
    const initial = initialText.value;
    initialText.value = "";
    const initialScore = {};
    initialScore['initial'] = initial;
    initialScore['score'] = score;
    nameScore.push(initialScore);
    localStorage.setItem("nameScore", JSON.stringify(nameScore));
}

/**
 * updates card dynamically to display user intial and score in sorted way (max first, min last)
 * Also displays text like No scores to display if no score yet saved/generated.
 */
function renderHighScores() {
    cardTitle.textContent = "Highscores";
    optionsList.textContent = "";
    if (nameScore.length > 0) {
        nameScore.sort(function (a, b) { return b.score - a.score });
        cardText.textContent = "";
        nameScore.forEach(function (item) {
            const listItem = document.createElement("li");
            listItem.textContent = item.initial + " - " + item.score;
            optionsList.appendChild(listItem);
        });
    }
    else {
        cardText.textContent = "No Scores to display";
    }
}

/**
 * intializes nameScore array by parsing data currently saved in localStorage against nameScore key.
 */
function initHighScores() {
    const storedHighScores = localStorage.getItem("nameScore")
    if (null != storedHighScores && storedHighScores.length > 0) {
        nameScore = JSON.parse(storedHighScores);
    }
}

/**
 * checks if there are any score to be cleared from localstorage and display message accordingly
 * Also clears the current displayed highscores from UI if scores are being cleared.
 */
function clearStorage() {
    const storedHighScores = localStorage.getItem("nameScore")
    if (null != storedHighScores && storedHighScores.length > 0) {
        localStorage.setItem("nameScore", "");
        nameScore = [];
        cardText.textContent = "All scores are cleared.";
        optionsList.textContent = "";
    }
    else {
        cardText.textContent = "Scores are already cleared.";
    }

}

/**
 * once user wants to go back and replay quiz then it reinitializes the various variables to initial values
 * and also hide and show relevant buttons in card so that user can restart the quiz.
 */
function restoreOriginal() {
    cardTitle.textContent = "Coding Quiz Challenge";
    cardText.textContent = "Try to answer the following code-related questions within the time limit. Please keep in mind that the incorrect answers will penalize your scoretime by ten seconds!";
    optionsList.textContent = "";
    showQuizButton();
    hideInitialControls();
    hideHighScoreControls();
    questionIndex = 0;
    score = 0;
    allQuestionAnswered = false;
}

/**
 * hides start quiz button from card.
 */
function hideQuizButton() {
    startQuizBtn.classList.add("hide");
}

/**
 * shows starts quiz button in card.
 */
function showQuizButton() {
    startQuizBtn.classList.remove("hide");
}

/**
 * hides intial submission related cotrols like label, input text field and submit button.
 */
function hideInitialControls() {
    initialLabel.classList.add("hide");
    initialSubmit.classList.add("hide");
    initialText.classList.add("hide");
}

/**
 * displays intial submission related cotrols like label, input text field and submit button.
 */
function showInitialControls() {
    initialLabel.classList.remove("hide");
    initialSubmit.classList.remove("hide");
    initialText.classList.remove("hide");
}

/**
 * displays high scores related controls like Go Back and Clear HighScore.
 */
function showHighScoreControls() {
    goBack.classList.remove("hide");
    clearHighScore.classList.remove("hide");
}

/**
 * hides high scores related controls like Go Back and Clear HighScore.
 */
function hideHighScoreControls() {
    goBack.classList.add("hide");
    clearHighScore.classList.add("hide");
}

/**
 * calculates how much time is remaining and displays same.
 */
function renderTime() {
    remainTime.textContent = totalSeconds - secondsElapsed;
}

/**
 *re-initlize total time to 75 seconds and registers a function to be executed after every 1 second to increase elapsed time
 *counter, display update time in UI and finish quiz if time limit has reached. 
 */
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
/**
 * clear out all time related counters and interval listener.
 */
function stopTimer() {
    secondsElapsed = 0;
    totalSeconds = 0;
    clearInterval(interval);
    renderTime();
}

// various functions registration as event handlers to handle relevant events.
startQuizBtn.addEventListener("click", startQuiz);
optionsList.addEventListener("click", continueQuiz);
initialSubmit.addEventListener("click", processHighScores);
goBack.addEventListener("click", restoreOriginal);
clearHighScore.addEventListener("click", clearStorage);
viewScores.addEventListener("click", displayHighScores);


