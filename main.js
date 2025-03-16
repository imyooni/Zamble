

import * as itemsData from './assets/Scripts/itemsData.js';
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
            ? "url('./assets/Sprites/system/ENG.png')"
            : "url('./assets/Sprites/system/KOR.png')";
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
        loadbattleBacks();
        loadsystemSprites();
        changeBattleback()
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


const systemsheets = {
    slotTypes: new Image(),
    heavyWeapons: new Image(),
    magicStaffs: new Image(),
    rarities: new Image(),
    systemIcons: new Image(),
};

const battleBackSheets = {
    forest: new Image(),
};

// Load the battlebacks (images)
function loadbattleBacks() {
    const spritePromises = Object.keys(battleBackSheets).map((key) => {
        return new Promise((resolve) => {
            battleBackSheets[key].src = `./assets/Sprites/battleBacks/${key}.png`;
            battleBackSheets[key].onload = resolve; // Ensure image is loaded
        });
    });

    // Wait for all the battlebacks to load before doing anything
    Promise.all(spritePromises).then(() => {
        changeBattleback(); // For example, start by updating to 'forest'
    });
}


function loadsystemSprites() {
    const spritePromises = Object.keys(systemsheets).map((key) => {
        return new Promise((resolve) => {
            systemsheets[key].src = `./assets/Sprites/system/${key}.png`;
            systemsheets[key].onload = resolve;
        });
    });

    Promise.all(spritePromises).then(() => {
        for (let index = 0; index < 30; index++) {
            let slotType
            if (Math.random() < 0.75) {
                slotType = 0
            } else {
                slotType = 1
            }
            createSlots(index, slotType, null)
        }

        updateInventory(0, ["magicStaffs", 0])

        for (const [key, { value, iconIndex }] of Object.entries(parameters)) {
            updateStats(key)
        }
       // updateStats();
    });
}




// █ refresh shop (testing)
document.addEventListener('keydown', function (event) {
    if (event.key === "8") {
        for (let index = 0; index < 30; index++) {
            updateInventory(index, ["magicStaffs", Math.floor(Math.random() * (16 * 4))])
        }
    }
});

let slotsTypes = new Array(30).fill(null);
const slotsGrid = document.querySelector(".slotGrid");
const battleBorder = document.querySelector(".battleBorder");
function createSlots(index, slotType = 0, itemID = null, rarityType = 0) {
    slotsGrid.style.gridTemplateColumns = `repeat(5, 36px)`;
    slotsGrid.style.gridTemplateRows = `repeat(6, 36px)`;
    slotsGrid.style.gap = `2px`;
    const cell = document.createElement("div");
    cell.classList.add("slotItem");
    cell.style.position = "relative";
    const slotCanvas = document.createElement("canvas");
    slotCanvas.width = 36;
    slotCanvas.height = 36;
    const slotCtx = slotCanvas.getContext("2d");
    drawSlotType(slotCtx, slotType);
    cell.appendChild(slotCanvas);
    let itemCanvas = null;
    let rarityCanvas = null;
    if (itemID) {
        itemCanvas = createItemCanvas(itemID);
        cell.appendChild(itemCanvas);
        rarityCanvas = createRarityCanvas(rarityType);
        cell.appendChild(rarityCanvas);
    }
    slotsTypes[index] = {
        element: cell, slotCanvas, slotCtx, itemCanvas, rarityCanvas, slotType,
        itemID, rarityType, enabled: true
    };
    slotsGrid.appendChild(cell);
    slotsGrid.classList.remove("hidden");
    battleBorder.classList.remove("hidden");
}

function createItemCanvas(itemID) {
    let spriteKey = systemsheets[itemID[0]];
    let iconIndex = itemID[1];
    const itemCanvas = document.createElement("canvas");
    itemCanvas.width = 24;
    itemCanvas.height = 24;
    const itemCtx = itemCanvas.getContext("2d");
    let itemX = (iconIndex % 16) * 24;
    let itemY = Math.floor(iconIndex / 16) * 24;
    itemCtx.drawImage(spriteKey, itemX, itemY, 24, 24, 0, 0, 24, 24);
    itemCanvas.style.position = "absolute";
    itemCanvas.style.left = "6px";
    itemCanvas.style.top = "6px";
    itemCanvas.style.zIndex = "10";
    return itemCanvas;
}

function createRarityCanvas(rarityType) {
    const rarityCanvas = document.createElement("canvas");
    rarityCanvas.width = 26;
    rarityCanvas.height = 24;
    const rarityCtx = rarityCanvas.getContext("2d");
    let rarityX = (rarityType % 16) * 26;
    let rarityY = Math.floor(rarityType / 16) * 24;
    rarityCtx.drawImage(systemsheets.rarities, rarityX, rarityY, 26, 24, 0, 0, 26, 24);
    rarityCanvas.style.position = "absolute";
    rarityCanvas.style.left = "5px";
    rarityCanvas.style.top = "6px";
    rarityCanvas.style.zIndex = "1";
    return rarityCanvas;
}

function updateInventory(index, itemID) {
    let slotData = slotsTypes[index];
    if (!slotData) return;
    if (slotData.itemCanvas) {
        slotData.element.removeChild(slotData.itemCanvas);
    }
    const newItemCanvas = createItemCanvas(itemID);
    slotData.element.appendChild(newItemCanvas);
    slotData.itemCanvas = newItemCanvas;
    slotData.itemID = itemID;
    updateRarity(index, Math.floor(Math.random() * 4));
}

function updateRarity(index, newRarityType) {
    let slotData = slotsTypes[index];
    if (!slotData) return;
    if (slotData.rarityCanvas) {
        slotData.element.removeChild(slotData.rarityCanvas);
    }
    const newRarityCanvas = createRarityCanvas(newRarityType);
    slotData.element.appendChild(newRarityCanvas);
    slotData.rarityCanvas = newRarityCanvas;
    slotData.rarityType = newRarityType;
}

function drawSlotType(ctx, slotType) {
    ctx.clearRect(0, 0, 36, 36);
    let slotX = (slotType % 10) * 36;
    let slotY = Math.floor(slotType / 10) * 36;
    ctx.drawImage(systemsheets.slotTypes, slotX, slotY, 36, 36, 0, 0, 36, 36);
}

function updateSlotType(index, newSlotType) {
    let slotData = slotsTypes[index];
    if (!slotData) return;
    drawSlotType(slotData.slotCtx, newSlotType);
    slotData.slotType = newSlotType;
}

let parameters = {
    hp: { value: [100, 100], iconIndex: 0 },
    mp: { value: [50, 50], iconIndex: 1 },
    atk: { value: 20, iconIndex: 2 },
    def: { value: 10, iconIndex: 3 },
    luk: { value: 5, iconIndex: 7 }
};


const parametersContainer = document.querySelector(".parameters");
function updateStats(param) {
    if (!parameters[param]) return; // Ensure the param exists

    let parameterElement = document.getElementById(param);

    // If the element doesn't exist, create it
    if (!parameterElement) {
        parameterElement = document.createElement("div");
        parameterElement.classList.add("parameter");
        parameterElement.id = param;

        const iconCanvas = document.createElement("canvas");
        iconCanvas.width = 24;
        iconCanvas.height = 24;
        iconCanvas.classList.add("param-icon");
        parameterElement.appendChild(iconCanvas);

        const nameElement = document.createElement("span");
        nameElement.classList.add("param-name");
        nameElement.textContent = param.toUpperCase();
        parameterElement.appendChild(nameElement);

        const statValueElement = document.createElement("span");
        statValueElement.classList.add("stat-value");
        parameterElement.appendChild(statValueElement);

        parametersContainer.appendChild(parameterElement);
    }

    const { value, iconIndex } = parameters[param];
    const statValueElement = parameterElement.querySelector(".stat-value");
    const iconCanvas = parameterElement.querySelector(".param-icon");
    const ctx = iconCanvas.getContext("2d");

    // Update the icon
    const iconX = (iconIndex % 16) * 24;
    const iconY = Math.floor(iconIndex / 16) * 24;
    ctx.clearRect(0, 0, 24, 24);
    ctx.drawImage(systemsheets.systemIcons, iconX, iconY, 24, 24, 0, 0, 24, 24);

    // Update the value with colors
    let statsValue;
    if (param === "hp") {
        statsValue = value[0];
        statValueElement.style.color = "rgb(171, 233, 2)";
    } else if (param === "mp") {
        statsValue = value[0];
        statValueElement.style.color = "rgb(2, 225, 233)";
    } else {
        statsValue = value;
        statValueElement.style.color = "#ffde4c"; // Default color
    }
    statValueElement.textContent = statsValue;

    parametersContainer.classList.remove('hidden')
}




const battleBackCanvas = document.createElement("canvas");
battleBackCanvas.width = 320;
battleBackCanvas.height = 240;
const ctx = battleBackCanvas.getContext("2d");
document.body.appendChild(battleBackCanvas);
function updateBattleback(newImage) {
    battleBackCanvas.style.zIndex = "10"; // Make sure it's on top
   // battleBackCanvas.style.transform = "translate(-107.2%, -63%)"
    battleBackCanvas.style.transform = "translate(-50%, -63%)"
    ctx.clearRect(0, 0, battleBackCanvas.width, battleBackCanvas.height);
    ctx.drawImage(newImage, 0, 0, battleBackCanvas.width, battleBackCanvas.height);
}
function changeBattleback() {
    updateBattleback(battleBackSheets.forest);  // Update with the new image
}





