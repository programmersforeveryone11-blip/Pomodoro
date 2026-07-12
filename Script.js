// Elementos del DOM
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const actionBtn = document.getElementById('action-btn');

const focusCard = document.getElementById('focus-card');
const shortCard = document.getElementById('short-break-card');
const longCard = document.getElementById('long-break-card');

const focusInput = document.getElementById('focus-time');
const shortInput = document.getElementById('short-time');
const longInput = document.getElementById('long-time');

const dots = document.querySelectorAll('.dot');

// Variables de estado
let timerInterval;
let isRunning = false;
let currentMode = 'focus'; // Modos: 'focus', 'short', 'long'
let timeLeft = parseInt(focusInput.value) * 60;

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    minutesDisplay.textContent = mins < 10 ? '0' + mins : mins;
    secondsDisplay.textContent = secs < 10 ? '0' + secs : secs;
}

function startTimer() {
    isRunning = true;
    actionBtn.textContent = 'PAUSE';
    actionBtn.style.backgroundColor = '#333333';
    actionBtn.style.boxShadow = 'none';

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            handleTimerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    actionBtn.textContent = 'START';
    actionBtn.style.backgroundColor = '#FF5252';
    actionBtn.style.boxShadow = '0 4px 12px rgba(255, 82, 82, 0.2)';
}

function handleTimerComplete() {
    try {
        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch(e) {}

    alert(`¡Tiempo terminado!`);
    resetTimerByMode();
}

function resetTimerByMode() {
    pauseTimer();
    if (currentMode === 'focus') {
        timeLeft = parseInt(focusInput.value) * 60;
    } else if (currentMode === 'short') {
        timeLeft = parseInt(shortInput.value) * 60;
    } else if (currentMode === 'long') {
        timeLeft = parseInt(longInput.value) * 60;
    }
    updateDisplay();
}

actionBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

function changeMode(mode, selectedCard) {
    currentMode = mode;
    
    [focusCard, shortCard, longCard].forEach(card => card.classList.remove('active'));
    selectedCard.classList.add('active');

    dots.forEach((dot, index) => {
        if (mode === 'focus' && index === 0) dot.classList.add('active');
        else if (mode === 'short' && index === 1) dot.classList.add('active');
        else if (mode === 'long' && index === 2) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    resetTimerByMode();
}

focusCard.addEventListener('click', () => changeMode('focus', focusCard));
shortCard.addEventListener('click', () => changeMode('short', shortCard));
longCard.addEventListener('click', () => changeMode('long', longCard));

[focusInput, shortInput, longInput].forEach(input => {
    input.addEventListener('change', () => {
        if (!isRunning) {
            resetTimerByMode();
        }
    });
});

updateDisplay();
