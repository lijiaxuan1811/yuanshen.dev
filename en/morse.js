// Morse code dictionary mapping letters, numbers, and some punctuation to Morse code representations
const morseCode = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    0: "-----",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    $: "...-..-",
    "@": ".--.-.",
};

let audioContext; // AudioContext object for audio processing
let currentTimeouts = []; // Array to store all setTimeout references for clearing later
let isPlaying = false; // Indicates whether it is currently playing
let currentIndex = 0; // Index of the current Morse symbol being played
let words = []; // Converted Morse code sequence
let dotDuration, dashDuration, elementGap, letterGap, wordGap; // Various intervals and durations
let currentFrequency = 600; // Current audio frequency, default is 600Hz

// Create and initialize AudioContext
function createAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Convert text to Morse code, returning a string composed of . and -
function textToMorse(text) {
    return text
        .toUpperCase()
        .split("")
        .map((char) => morseCode[char] || " ")
        .join(" "); // Map each character to Morse code
}

// Play sound with specified frequency and duration
function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator(); // Create a sound generator
    oscillator.type = "sine"; // Set sound type to sine wave
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Set frequency
    oscillator.connect(audioContext.destination); // Output sound to audio output device
    oscillator.start(); // Start playing
    oscillator.stop(audioContext.currentTime + duration); // Stop after specified duration
}

// Calculate the duration of each dot based on WPM (words per minute)
function getDotDuration(wpm) {
    return 1200 / wpm; // 1200ms/WPM equals the duration of a dot
}

// Clear all set timeouts
function clearTimeouts() {
    currentTimeouts.forEach((timeout) => clearTimeout(timeout)); // Clear all setTimeouts one by one
    currentTimeouts = []; // Clear the timeout array
}

// Play the next Morse code symbol
function playNextSymbol() {
    // Exit the function if playback has stopped or reached the end
    if (!isPlaying || currentIndex >= words.length) {
        return;
    }

    const symbol = words[currentIndex]; // Get the current symbol to be played
    let timeoutDuration = 0; // Duration for the timeout

    if (symbol === ".") {
        // Play dot
        playSound(currentFrequency, dotDuration / 1000); // Convert dot duration to seconds
        timeoutDuration = dotDuration + elementGap; // Dot followed by element gap
    } else if (symbol === "-") {
        // Play dash
        playSound(currentFrequency, dashDuration / 1000); // Dash duration is three times that of a dot
        timeoutDuration = dashDuration + elementGap;
    } else if (symbol === " ") {
        // Letter gap
        timeoutDuration = letterGap;
    } else if (symbol === "   ") {
        // Word gap
        timeoutDuration = wordGap;
    }

    currentIndex++; // Play the next symbol
    const timeoutId = setTimeout(playNextSymbol, timeoutDuration); // Set the next symbol to play
    currentTimeouts.push(timeoutId); // Save timeout reference for clearing
}

// Prepare and start playing Morse code
function playMorse(wpm, freq) {
    // Calculate various durations: dot, dash, element gap, letter gap, word gap
    dotDuration = getDotDuration(wpm);
    dashDuration = 3 * dotDuration;
    elementGap = dotDuration;
    letterGap = 3 * dotDuration;
    wordGap = 7 * dotDuration;

    // Get the text from the input box and convert to Morse code
    const text = document.getElementById("textInput").value.trim();
    const morseText = text
        .split(" ")
        .map((word) => textToMorse(word))
        .join("   "); // Convert text to Morse code with spaces between words
    words = morseText.split(""); // Split Morse text into individual symbols
    currentIndex = 0; // Reset the index
    isPlaying = true; // Set playing state to true

    // Start playing the Morse code
    playNextSymbol(); // Begin playing the Morse code
}

// Prepare the Morse code and handle user input
function preparation() {
    const inputText = document.getElementById("textInput").value.trim(); // Get user input
    const errorMessage = document.getElementById("error"); // Get error message area
    errorMessage.textContent = ""; // Clear previous error message
    if (!validateInput(inputText)) {
        errorMessage.textContent =
            "Only A-Z, 0-9, and some punctuation (.,?'!()/&:;=+-_\"$@) are allowed!"; // Set error message
        return; // Exit if input is invalid
    }
    clearTimeouts(); // Clear any existing timeouts
    if (!audioContext) {
        createAudioContext(); // Create audio context if it doesn't exist
    }
    const wpm = document.getElementById("WPM").value; // Get user-defined WPM
    currentFrequency = document.getElementById("fq").value; // Get user-defined frequency
    playMorse(wpm, currentFrequency); // Start playing Morse code
}

// Pause the playback
function pauseSound() {
    isPlaying = false; // Set playing state to false
}

// Resume playback
function resumeSound() {
    if (!isPlaying && currentIndex < words.length) {
        isPlaying = true; // Set playing state to true
        playNextSymbol(); // Resume playing from current index
    }
}

// Stop playback
function stopSound() {
    clearTimeouts(); // Clear all timeouts
    isPlaying = false; // Set playing state to false
    currentIndex = 0; // Reset index
}

// Validate user input
function validateInput(inputText) {
    const allowedChars = /^[A-Za-z0-9.,?!'()&:;=-_\/\"$@ ]*$/; // Regular expression to allow only specific characters
    return allowedChars.test(inputText); // Return true if input is valid
}

// Download Morse code as a text file
function downloadMorse() {
    const text = document.getElementById("textInput").value.trim(); // Get input text
    const morseText = textToMorse(text); // Convert to Morse code
    const blob = new Blob([morseText], {type: "text/plain"}); // Create a blob for the Morse code
    const link = document.createElement("a"); // Create a link element
    link.href = window.URL.createObjectURL(blob); // Set the link to the blob URL
    link.download = "morse_code.txt"; // Set the default file name for download
    link.click(); // Trigger the download
}
