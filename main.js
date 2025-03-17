

import * as itemsData from './assets/Scripts/itemsData.js';
import * as languageData from './assets/Scripts/languageData.js';

let scene = 'intro';
let language = 'eng';


document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

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
    lightArmors: new Image(),
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

        updateInventory(0, itemsData.heavyWeapons(1), "heavyWeapons")
        updateInventory(16, itemsData.heavyWeapons(10), "heavyWeapons")
        updateInventory(5, itemsData.magicStaffs(1), "magicStaffs")
        updateRarity(5,1)
       

        for (const [key, { value, iconIndex }] of Object.entries(parameters)) {
            updateStats(key)
        }
       
    });
}




// █ refresh shop (testing)
document.addEventListener('keydown', function (event) {
    if (event.key === "8") {
       shuffleItems()
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
        itemID, enabled: true
    };
    slotsGrid.appendChild(cell);
    slotsGrid.classList.remove("hidden");
    battleBorder.classList.remove("hidden");
}

function createItemCanvas(itemID) {
    let spriteKey = systemsheets[itemID.type];
    let iconIndex = itemID.index-1;
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

function updateInventory(index, itemID, type) {
    let slotData = slotsTypes[index];
    if (!slotData) return;
    if (slotData.itemCanvas) {
        slotData.element.removeChild(slotData.itemCanvas);
    }
    slotData.itemID = itemID;
    slotData.itemID.slotIndex = index
    slotData.itemID.type = type
    const newItemCanvas = createItemCanvas(itemID);
    slotData.itemCanvas = newItemCanvas;
    slotData.element.appendChild(newItemCanvas);
    updateRarity(index, slotData.itemID.rarity);
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
    slotData.itemID.rarity = newRarityType;
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


function shuffleItems() {
    let inventoryData = [];
    let indexes = [];
    for (let index = 0; index < slotsTypes.length; index++) {
        const item = slotsTypes[index];
        if (item.itemID !== null) {
            if (item.itemID.movement !== "Fixed") {
                item.enabled = false;
                item.itemCanvas.style.transition = "opacity 0.2s ease-in-out";
                item.rarityCanvas.style.transition = "opacity 0.2s ease-in-out";
                item.itemCanvas.style.opacity = "0";
                item.rarityCanvas.style.opacity = "0";
                inventoryData.push(item.itemID);
                indexes.push(index);
                slotsTypes[index].itemID = null
            }
        } else {
            indexes.push(index);
        }
    }
    let shuffledArray = shuffleArray(indexes);
    setTimeout(() => {
        for (let i = 0; i < inventoryData.length; i++) {
            clearSlotInventory(indexes[i]);
        }
        setTimeout(() => {
            for (let i = 0; i < inventoryData.length; i++) {
                 if (inventoryData[i].slotIndex === shuffledArray[0]) {
                    shuffledArray.shift(); 
                }
                const newIndex = shuffledArray.shift(); 
                updateInventory(newIndex, inventoryData[i], inventoryData[i].type) ; 
            }
          for (let index = 0; index < slotsTypes.length; index++) {
            slotsTypes[index].enabled = true
          }  
        }, 100); 
    }, 200);
}





function clearSlotInventory(index) {
    let slotData = slotsTypes[index];
    if (!slotData) return; // If no data for the slot, return.

    // Remove item canvas if it exists
    if (slotData.itemCanvas) {
        slotData.element.removeChild(slotData.itemCanvas);
        slotData.itemCanvas = null; // Clear the reference
    }

    // Remove rarity canvas if it exists
    if (slotData.rarityCanvas) {
        slotData.element.removeChild(slotData.rarityCanvas);
        slotData.rarityCanvas = null; // Clear the reference
    }

    // Reset the slot data for item and rarity
    slotData.itemID = null;
    slotData.rarityType = 0;

    // Optionally, you can redraw the slot to reflect it as empty
    drawSlotType(slotData.slotCtx, slotData.slotType); // This will keep the slot's original type
}



let selectedSlotIndex = null;
document.addEventListener("click", function (event) {
    let clickedItem = event.target.closest(".slotItem");
    if (!clickedItem) return;
    let inventoryItem = slotsTypes.find(item => item.element === clickedItem);
    if (inventoryItem) {
        if (!inventoryItem.enabled) return
        if (selectedSlotIndex === inventoryItem) {
            playAudio('/SFX/System_Selected_Piece.ogg');
            clickedItem.classList.remove("selected-slot"); 
            selectedSlotIndex = null; 
            return;
        }
        if (selectedSlotIndex === null && !inventoryItem.itemID) {
            return; 
        }
        if (selectedSlotIndex === null && inventoryItem.itemID) {
            playAudio('/SFX/System_Selected_Piece.ogg');
            selectedSlotIndex = inventoryItem;
            console.log(inventoryItem.itemID)
            clickedItem.classList.add("selected-slot"); 
            return;
        }
        
        if (selectedSlotIndex.itemID.movement === "Fixed") {
            playAudio('/SFX/System_Error.ogg');
            return
        } else if (inventoryItem.itemID !== null && inventoryItem.itemID.movement === "Fixed")  {
            playAudio('/SFX/System_Error.ogg');
            return
        }
        
        if (!inventoryItem.itemID) {
            
            playAudio('/SFX/System_Selected_Piece.ogg');
            moveItemToEmptySlot(selectedSlotIndex, inventoryItem);
            selectedSlotIndex.element.classList.remove("selected-slot"); 
            selectedSlotIndex = null; 
        } else {
            playAudio('/SFX/System_Selected_Piece.ogg');
            swapItemsWithTransition(selectedSlotIndex, inventoryItem);
            selectedSlotIndex.element.classList.remove("selected-slot"); 
            selectedSlotIndex = null; 
        }
    }
});

function moveItemToEmptySlot(fromSlot, toSlot) {
    if (!fromSlot || !toSlot || toSlot.itemID !== null) return;
    if (fromSlot.itemCanvas) {
        fromSlot.itemCanvas.style.transition = "opacity 0.2s ease-in-out";
        fromSlot.itemCanvas.style.opacity = "0";
    }
    if (fromSlot.rarityCanvas) {
        fromSlot.rarityCanvas.style.transition = "opacity 0.2s ease-in-out";
        fromSlot.rarityCanvas.style.opacity = "0";
    }
    setTimeout(() => {
        toSlot.itemID = fromSlot.itemID;
        toSlot.itemID.slotIndex = slotsTypes.indexOf(toSlot)
        toSlot.itemCanvas = createItemCanvas(fromSlot.itemID);
        toSlot.rarityCanvas = createRarityCanvas(fromSlot.rarityType);
        toSlot.element.appendChild(toSlot.itemCanvas);
        toSlot.element.appendChild(toSlot.rarityCanvas);
        fromSlot.itemID = null;
        if (fromSlot.itemCanvas) {
            fromSlot.element.removeChild(fromSlot.itemCanvas);
            fromSlot.itemCanvas = null;
        }
        if (fromSlot.rarityCanvas) {
            fromSlot.element.removeChild(fromSlot.rarityCanvas);
            fromSlot.rarityCanvas = null; 
        }
        redrawSlot(fromSlot);
        redrawSlot(toSlot);
        toSlot.itemCanvas.style.transition = "opacity 0.2s ease-in-out";
        toSlot.itemCanvas.style.opacity = "1";
        if (toSlot.rarityCanvas) {
            toSlot.rarityCanvas.style.transition = "opacity 0.2s ease-in-out";
            toSlot.rarityCanvas.style.opacity = "1";
        }
    }, 200); 
}

function swapItemsWithTransition(slotA, slotB) {
    if (!slotA || !slotB) return;
    slotA.itemCanvas.style.transition = "opacity 0.2s ease-in-out";
    slotB.itemCanvas.style.transition = "opacity 0.2s ease-in-out";
    if (slotA.rarityCanvas) slotA.rarityCanvas.style.transition = "opacity 0.2s ease-in-out";
    if (slotB.rarityCanvas) slotB.rarityCanvas.style.transition = "opacity 0.2s ease-in-out";
    slotA.itemCanvas.style.opacity = "0";
    slotB.itemCanvas.style.opacity = "0";
    if (slotA.rarityCanvas) slotA.rarityCanvas.style.opacity = "0";
    if (slotB.rarityCanvas) slotB.rarityCanvas.style.opacity = "0";
    setTimeout(() => {
        [slotA.itemID, slotB.itemID] = [slotB.itemID, slotA.itemID];
        [slotA.itemCanvas, slotB.itemCanvas] = [slotB.itemCanvas, slotA.itemCanvas];
        [slotA.rarityCanvas, slotB.rarityCanvas] = [slotB.rarityCanvas, slotA.rarityCanvas];
        [slotA.itemID.slotIndex, slotB.itemID.slotIndex] = [slotB.itemID.slotIndex, slotA.itemID.slotIndex];
        redrawSlot(slotA);
        redrawSlot(slotB);
        slotA.itemCanvas.style.opacity = "1";
        slotB.itemCanvas.style.opacity = "1";
        if (slotA.rarityCanvas) slotA.rarityCanvas.style.opacity = "1";
        if (slotB.rarityCanvas) slotB.rarityCanvas.style.opacity = "1";
    }, 200); 
}

function redrawSlot(slotData) {
    if (!slotData) return;
    if (slotData.itemCanvas && slotData.element.contains(slotData.itemCanvas)) {
        slotData.element.removeChild(slotData.itemCanvas);
    }
    if (slotData.rarityCanvas && slotData.element.contains(slotData.rarityCanvas)) {
        slotData.element.removeChild(slotData.rarityCanvas);
    }
    if (slotData.itemID) {
        slotData.itemCanvas = createItemCanvas(slotData.itemID);
        slotData.rarityCanvas = createRarityCanvas(slotData.itemID.rarity);

        slotData.element.appendChild(slotData.itemCanvas);
        slotData.element.appendChild(slotData.rarityCanvas);
    }
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
    if (!parameters[param]) return;
    let parameterElement = document.getElementById(param);
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
const battleImageContainer = document.querySelector(".battleImage");
function updateBattleback(newImage) {
    const ctx = battleBackCanvas.getContext("2d");
    if (!battleImageContainer.contains(battleBackCanvas)) {
        battleImageContainer.appendChild(battleBackCanvas);
    }
    battleBackCanvas.width = 320
    battleBackCanvas.height = 240
    ctx.clearRect(0, 0, battleBackCanvas.width, battleBackCanvas.height);
    ctx.drawImage(newImage, 0, 0, battleBackCanvas.width, battleBackCanvas.height);
    battleImageContainer.classList.remove('hidden')
}
function changeBattleback() {
    updateBattleback(battleBackSheets.forest);
}






