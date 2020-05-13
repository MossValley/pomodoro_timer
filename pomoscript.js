// init all variables needed from html
let workTime = document.querySelector('span#workTime');
let restTime = document.querySelector('span#restTime');
let currentTime = document.querySelector('h1#currentTime');
let title = document.querySelector('title');
const timeUpAlert = document.querySelector('audio#timeUp');
// init variables needed in script
let clockStarted = false, counterOn, restartTrigger = false, sessionSelect = 0;
let workSession = workTime.textContent, restSession = restTime.textContent;
let titleName = title.textContent;

// init buttons for setting timers
const setButtons = document.querySelectorAll('.buttons button');
setButtons.forEach(button => buttonHandler(button, timeChange));
let startButton = document.querySelector('[name ="start"]');
// init buttons for active clock
const clockButtons = document.querySelectorAll('.clockContainer button');
clockButtons.forEach(button => {
    buttonHandler(button, clockChange)
});
// init clock & first session (work as default)
highlightButton(sessionSelect);

function buttonHandler(button, buttonAction) {
    button.addEventListener('click', e =>{
        let buttonPressed = e.toElement.name;
        buttonAction(buttonPressed);
    })
}

function highlightButton(active) {
    let innactive = (active == 0) ? 1: 0;
    clockButtons[innactive].classList.remove('sessionActive');
    clockButtons[active].classList.add('sessionActive');
    sessionSetup();
}
// init where the clock starts/is currently
function sessionSetup() {
    if (sessionSelect == 0) minutes = workSession;
    else if (sessionSelect == 1) minutes = restSession;
    seconds = 0;
    updateTimer();
}
function updateTimer() {
    currentTime.textContent = minutes + ':' + doubleDigits(seconds);
    title.textContent = (clockStarted) 
        ? '(' + currentTime.textContent + ') '+ titleName 
        : titleName;
    function doubleDigits(seconds) {
        if (seconds < 10) return "0" + seconds;
        else return seconds;
    }
}

// work time/rest time button actions
function timeChange(button) {
    if (clockStarted) return;
    switch(button) {
        case 'workUp':
            if (workTime.textContent < 59) workTime.textContent ++;
            break;
        case 'workDown':
            if (workTime.textContent > 0) workTime.textContent --;
            break;
        case 'restUp':
            if (restTime.textContent < 25) restTime.textContent ++;
            break;
        case 'restDown':
            if (restTime.textContent > 0) restTime.textContent --;
            break;
    }    
    workSession = workTime.textContent;
    restSession = restTime.textContent;
    sessionSetup();
}
// clock button actions
function clockChange(button) {
    switch(button){
        case 'start':
            if (!clockStarted){
                clockStarted = true;
                countDown();
            } else if (clockStarted) {
                clockStarted = false;
                clearInterval(counterOn);
            }
            break;
        case 'restart':
            if (clockStarted) restartTrigger = true;
            else {
                timeUp();
            }
            break;
        case 'work':
            if (!clockStarted) {
                sessionSelect = 0;
                highlightButton(sessionSelect);
            }
            break;
        case 'rest':
            if (!clockStarted) {
                sessionSelect = 1;
                highlightButton(sessionSelect);
            }
            break;
    }
    startButton.textContent = (clockStarted) ? 'PAUSE' : 'START';
}

function countDown() {
    if (restartTrigger) {
        sessionSetup();
        restartTrigger = false;
    }
    if (seconds <= 0) {
        minutes --;
        if (minutes < 0) {
            timeUpAlert.play();
            timeUp();
            return;
        }
        seconds = 60;
    }
    seconds --;
    updateTimer();
    counterOn = setTimeout(countDown, 1000);
}

function timeUp() {
    clockStarted = false;
    sessionSetup();
    startButton.textContent = 'START';
}