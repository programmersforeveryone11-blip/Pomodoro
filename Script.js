let timer;
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');
let startBtn = document.getElementById('start-btn');
let pauseBtn = document.getElementById('pause-btn');
let resetBtn = document.getElementById('reset-btn');
let workBtn = document.getElementById('work-btn');
let breakBtn = document.getElementById('break-btn');
let statusMessage = document.getElementById('status-message');

let timeLeft = 25 * 60; 
let isWorking = true;
let isRunning = false;

function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    minutesDisplay.textContent = mins < 10 ? '0' + mins : mins;
    secondsDisplay.textContent = secs < 10 ? '0' + secs : secs;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            switchMode();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
    timeLeft = isWorking ? 25 * 60 : 5 * 60;
    updateDisplay();
}

function switchMode() {
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // Nota Do alta
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}

    if (isWorking) {
        isWorking = false;
        workBtn.classList.remove('active');
        breakBtn.classList.add('active');
        timeLeft = 5 * 60; 
        statusMessage.textContent = '¡Tiempo de un respiro!';
    } else {
        isWorking = true;
        breakBtn.classList.remove('active');
        workBtn.classList.add('active');
        timeLeft = 25 * 60;
        statusMessage.textContent = '¡Tiempo de concentrarse!';
    }
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

workBtn.addEventListener('click', () => {
    if (!isWorking) {
        isWorking = true;
        workBtn.classList.add('active');
        breakBtn.classList.remove('active');
        statusMessage.textContent = '¡Tiempo de concentrarse!';
        resetTimer();
    }
});

breakBtn.addEventListener('click', () => {
    if (isWorking) {
        isWorking = false;
        breakBtn.classList.add('active');
        workBtn.classList.remove('active');
        statusMessage.textContent = '¡Tiempo de un respiro!';
        resetTimer();
    }
});

updateDisplay();
