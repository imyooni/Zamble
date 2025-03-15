

import * as pieceData from './assets/Scripts/piecesData.js';
import * as languageData from './assets/Scripts/languageData.js';

let scene = 'intro';
let language = 'eng';


document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});


let audioContext;
let globalGainNode;
const audioBuffers = new Map(); // Store loaded audio buffers
let bgmSource = null; // Store current BGM source

async function initAudio(globalVolume = 0.75) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        globalGainNode = audioContext.createGain();
        globalGainNode.connect(audioContext.destination);
        globalGainNode.gain.value = globalVolume; // Default global volume
    }
    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
}

// Function to load an audio file into memory
async function loadAudio(filePath) {
    if (audioBuffers.has(filePath)) return; // Already loaded
    await initAudio();
    try {
        const response = await fetch(`./assets/Audio/${filePath}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffers.set(filePath, audioBuffer);
    } catch (error) {
        console.error("Failed to load audio:", error);
    }
}

// Function to play a sound effect with individual volume
async function playAudio(filePath, volume = 1) {
    await initAudio();
    if (!audioBuffers.has(filePath)) {
        await loadAudio(filePath);
    }
    const buffer = audioBuffers.get(filePath);
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Create a separate gain node for this sound
    const soundGainNode = audioContext.createGain();
    soundGainNode.gain.value = volume; // Set individual volume

    // Connect the source -> individual gain -> global gain -> output
    source.connect(soundGainNode);
    soundGainNode.connect(globalGainNode);

    source.start(0);
}

// Function to play background music (BGM) with volume control
async function playBGM(song, volume = 0.5) {
    await loadAudio(`BGM/${song}`); // Load and store buffer
    const buffer = audioBuffers.get(`BGM/${song}`);
    if (!buffer) return;

    // Stop any existing BGM
    if (bgmSource) {
        bgmSource.stop();
    }

    // Create new source and gain node for BGM
    bgmSource = audioContext.createBufferSource();
    bgmSource.buffer = buffer;
    bgmSource.loop = true;

    const bgmGainNode = audioContext.createGain();
    bgmGainNode.gain.value = volume; // Set BGM volume

    // Connect BGM source -> individual BGM gain -> global gain -> output
    bgmSource.connect(bgmGainNode);
    bgmGainNode.connect(globalGainNode);

    bgmSource.start();
}

// Function to set global volume
function setGlobalVolume(volume) {
    if (globalGainNode) {
        globalGainNode.gain.value = volume;
    }
}

// Function to stop BGM
function stopBGM() {
    if (bgmSource) {
        bgmSource.stop();
        bgmSource = null;
    }
}

//███████████//
//   INTRO   //
//███████████//
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.querySelector('.intro-background');
    if (intro) intro.classList.remove('hidden');
});

document.addEventListener("click", function () {
    const logo = document.querySelector('.logo');
    if (!logo || logo.done) return;
    logo.classList.remove('hidden');
    setTimeout(() => {
        logo.style.opacity = "1";
    }, 100);
    logo.addEventListener("transitionend", function () {
        if (!logo.done) {
            playAudio('/SFX/System_Intro.ogg', 0.2);
            logo.done = true;
        }
    }, { once: true });
});

const gameTitle = document.querySelector('.gameTitle');
const gameLanguage = document.querySelector('.gameLanguage');
document.addEventListener("click", function () {
    const logo = document.querySelector('.logo');
    const intro = document.querySelector('.gameBackground');
    const secondaryBackground = document.querySelector('.secondary-background');
    const twitchIcon = document.querySelector('.twitchIcon');
    const youtubeIcon = document.querySelector('.youtubeIcon');
    if (scene === 'intro' && logo.done) {
        setTimeout(() => {
            logo.style.opacity = "0";
        }, 100);
        logo.addEventListener("transitionend", function () {
            intro.style.opacity = "0";
            intro.addEventListener("transitionend", function () {
                intro.remove();
            }, { once: true });

            setTimeout(() => {
                gameTitle.style.opacity = "1";
                gameLanguage.style.opacity = "1";
                twitchIcon.style.opacity = "1";
                youtubeIcon.style.opacity = "1";
                newGameVocab.style.opacity = "1";
            }, 100);
            secondaryBackground.classList.remove('hidden');
            twitchIcon.classList.remove('hidden');
            youtubeIcon.classList.remove('hidden');
            gameTitle.classList.remove('hidden');
            gameLanguage.classList.remove('hidden');
            scene = 'title'
            createNewGame()
            logo.remove();
        }, { once: true });
    }
});

const twitchIcon = document.querySelector('.twitchIcon');
twitchIcon.addEventListener('click', function () {
    playAudio('/SFX/System_Selected_Piece.ogg');
    window.open('https://www.twitch.tv/imyooni', '_blank');
});

const youtubeIcon = document.querySelector('.youtubeIcon');
youtubeIcon.addEventListener('click', function () {
    playAudio('/SFX/System_Selected_Piece.ogg');
    window.open('https://www.youtube.com/@imyooni6995', '_blank');
});

let languageIcon = document.querySelector('.gameLanguage');

languageIcon.addEventListener('click', () => {
    if (parseFloat(window.getComputedStyle(languageIcon).opacity) !== 1) return;
    playAudio('/SFX/System_Selected_Piece.ogg');
    language = (language === 'eng') ? 'kor' : 'eng';
    languageIcon.style.opacity = 0;
    languageIcon.style.transition = 'background-image 0.2s ease-in-out, opacity 0.2s ease-in-out';
    setTimeout(() => {
        languageIcon.style.backgroundImage = language === 'eng'
            ? "url('./assets/Sprites/ENG.png')"
            : "url('./assets/Sprites/KOR.png')";
    }, 50);
    setTimeout(() => {
        languageIcon.style.opacity = 1;
    }, 200);
    updateNewGameText();
});

//███████████████//
//   NEW GAME    //
//███████████████//

const newGameVocab = document.querySelector('.newGame-vocab');
newGameVocab.addEventListener('click', function (event) {
    if (scene !== 'title') return
    if (scene === 'game') return
    playAudio('/SFX/System_Ok.ogg');
   // playFlashAnimation(event.currentTarget, 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.49)');
    const elementsToHide = [twitchIcon, youtubeIcon, gameTitle, gameLanguage];
    elementsToHide.forEach(element => element.classList.add('hidden'));
    setTimeout(() => {
        newGameVocab.style.opacity = "0";
        youtubeIcon.style.opacity = "0";
        twitchIcon.style.opacity = "0";
        gameTitle.style.opacity = "0";
        gameLanguage.style.opacity = "0";
    }, 100);
    scene = 'game'
    newGameVocab.addEventListener("transitionend", function () {
        newGameVocab.classList.add('hidden')
       
       // startGame()
       // playBGM("bgm004.ogg", 0.35)
    }, { once: true });
});

function createNewGame() {
    if (!newGameVocab) return;
    newGameVocab.classList.remove('hidden');
    let newGameText = newGameVocab.querySelector('.newGame-text');
    if (!newGameText) {
        newGameText = document.createElement('div');
        newGameText.classList.add('newGame-text');
        newGameVocab.appendChild(newGameText);
    }
    newGameText.textContent = languageData.vocab(language).newGameVocab;
}

function updateNewGameText() {
    const newGameText = document.querySelector('.newGame-text');
    if (newGameText) {
        newGameText.textContent = languageData.vocab(language).newGameVocab;
    }
}