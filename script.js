const ASCII_NAMES = {
    0: "NULL",
    1: "START OF HEADING",
    2: "START OF TEXT",
    3: "END OF TEXT",
    4: "END OF TRANSMISSION",
    5: "ENQUIRY",
    6: "ACKNOWLEDGE",
    7: "BELL",
    8: "BACKSPACE",
    9: "HORIZONTAL TAB",
    10: "LINE FEED",
    11: "VERTICAL TAB",
    12: "FORM FEED",
    13: "CARRIAGE RETURN",
    14: "SHIFT OUT",
    15: "SHIFT IN",
    16: "DATA LINK ESCAPE",
    17: "DEVICE CONTROL 1",
    18: "DEVICE CONTROL 2",
    19: "DEVICE CONTROL 3",
    20: "DEVICE CONTROL 4",
    21: "NEGATIVE ACKNOWLEDGE",
    22: "SYNCHRONOUS IDLE",
    23: "END OF TRANSMISSION BLOCK",
    24: "CANCEL",
    25: "END OF MEDIUM",
    26: "SUBSTITUTE",
    27: "ESCAPE",
    28: "FILE SEPARATOR",
    29: "GROUP SEPARATOR",
    30: "RECORD SEPARATOR",
    31: "UNIT SEPARATOR",
    32: "SPACE",
    33: "EXCLAMATION MARK",
    34: "QUOTATION MARK",
    35: "NUMBER SIGN",
    36: "DOLLAR SIGN",
    37: "PERCENT SIGN",
    38: "AMPERSAND",
    39: "APOSTROPHE",
    40: "LEFT PARENTHESIS",
    41: "RIGHT PARENTHESIS",
    42: "ASTERISK",
    43: "PLUS SIGN",
    44: "COMMA",
    45: "HYPHEN-MINUS",
    46: "FULL STOP",
    47: "SOLIDUS",
    48: "DIGIT ZERO",
    49: "DIGIT ONE",
    50: "DIGIT TWO",
    51: "DIGIT THREE",
    52: "DIGIT FOUR",
    53: "DIGIT FIVE",
    54: "DIGIT SIX",
    55: "DIGIT SEVEN",
    56: "DIGIT EIGHT",
    57: "DIGIT NINE",
    58: "COLON",
    59: "SEMICOLON",
    60: "LESS-THAN SIGN",
    61: "EQUALS SIGN",
    62: "GREATER-THAN SIGN",
    63: "QUESTION MARK",
    64: "COMMERCIAL AT",
    65: "LATIN CAPITAL LETTER A",
    66: "LATIN CAPITAL LETTER B",
    67: "LATIN CAPITAL LETTER C",
    68: "LATIN CAPITAL LETTER D",
    69: "LATIN CAPITAL LETTER E",
    70: "LATIN CAPITAL LETTER F",
    71: "LATIN CAPITAL LETTER G",
    72: "LATIN CAPITAL LETTER H",
    73: "LATIN CAPITAL LETTER I",
    74: "LATIN CAPITAL LETTER J",
    75: "LATIN CAPITAL LETTER K",
    76: "LATIN CAPITAL LETTER L",
    77: "LATIN CAPITAL LETTER M",
    78: "LATIN CAPITAL LETTER N",
    79: "LATIN CAPITAL LETTER O",
    80: "LATIN CAPITAL LETTER P",
    81: "LATIN CAPITAL LETTER Q",
    82: "LATIN CAPITAL LETTER R",
    83: "LATIN CAPITAL LETTER S",
    84: "LATIN CAPITAL LETTER T",
    85: "LATIN CAPITAL LETTER U",
    86: "LATIN CAPITAL LETTER V",
    87: "LATIN CAPITAL LETTER W",
    88: "LATIN CAPITAL LETTER X",
    89: "LATIN CAPITAL LETTER Y",
    90: "LATIN CAPITAL LETTER Z",
    91: "LEFT SQUARE BRACKET",
    92: "REVERSE SOLIDUS",
    93: "RIGHT SQUARE BRACKET",
    94: "CIRCUMFLEX ACCENT",
    95: "LOW LINE",
    96: "GRAVE ACCENT",
    97: "LATIN SMALL LETTER A",
    98: "LATIN SMALL LETTER B",
    99: "LATIN SMALL LETTER C",
    100: "LATIN SMALL LETTER D",
    101: "LATIN SMALL LETTER E",
    102: "LATIN SMALL LETTER F",
    103: "LATIN SMALL LETTER G",
    104: "LATIN SMALL LETTER H",
    105: "LATIN SMALL LETTER I",
    106: "LATIN SMALL LETTER J",
    107: "LATIN SMALL LETTER K",
    108: "LATIN SMALL LETTER L",
    109: "LATIN SMALL LETTER M",
    110: "LATIN SMALL LETTER N",
    111: "LATIN SMALL LETTER O",
    112: "LATIN SMALL LETTER P",
    113: "LATIN SMALL LETTER Q",
    114: "LATIN SMALL LETTER R",
    115: "LATIN SMALL LETTER S",
    116: "LATIN SMALL LETTER T",
    117: "LATIN SMALL LETTER U",
    118: "LATIN SMALL LETTER V",
    119: "LATIN SMALL LETTER W",
    120: "LATIN SMALL LETTER X",
    121: "LATIN SMALL LETTER Y",
    122: "LATIN SMALL LETTER Z",
    123: "LEFT CURLY BRACKET",
    124: "VERTICAL LINE",
    125: "RIGHT CURLY BRACKET",
    126: "TILDE",
    127: "DELETE"
};

const CONTROL_SYMBOLS = {
    0: "␀", 1: "␁", 2: "␂", 3: "␃", 4: "␄", 5: "␅", 6: "␆", 7: "␇",
    8: "␈", 9: "␉", 10: "␊", 11: "␋", 12: "␌", 13: "␍", 14: "␎", 15: "␏",
    16: "␐", 17: "␑", 18: "␒", 19: "␓", 20: "␔", 21: "␕", 22: "␖", 23: "␗",
    24: "␘", 25: "␙", 26: "␚", 27: "␛", 28: "␜", 29: "␝", 30: "␞", 31: "␟",
    32: "␣", 127: "␡"
};

const displayEl = document.getElementById('char-display');
const infoContainer = document.getElementById('info-container');
const instructContainer = document.getElementById('instruct-container');
const nameEl = document.getElementById('char-name');
const meaningEl = document.getElementById('char-meaning');
const codeEl = document.getElementById('char-code');
const hexEl = document.getElementById('char-hex');

// Switch & View Elements
const btnLookup = document.getElementById('btn-lookup');
const btnSearch = document.getElementById('btn-search');
const viewLookup = document.getElementById('view-lookup');
const viewSearch = document.getElementById('view-search');
const historySection = document.getElementById('history-section');
const historyContainer = document.getElementById('history-container');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');

let currentMode = 'lookup';
let charHistory = [];
let isAwake = false;
let lastEscTime = 0;
let unicodeDataMap = null;

// Lazily load Unicode data for non-ASCII characters
async function getUnicodeName(hex) {
    if (!unicodeDataMap) {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/gh/unicode-org/icu@main/icu4c/source/data/unidata/UnicodeData.txt');
            const data = await response.text();
            unicodeDataMap = new Map();
            data.split('\n').forEach(line => {
                if (!line) return;
                const parts = line.split(';');
                if (parts.length >= 2) {
                    unicodeDataMap.set(parts[0], parts[1]);
                }
            });
        } catch (e) {
            console.error('Failed to load Unicode data:', e);
            return 'UNICODE CHARACTER';
        }
    }
    return unicodeDataMap.get(hex) || 'UNKNOWN CHARACTER';
}

function setMode(mode) {
    currentMode = mode;
    if (mode === 'lookup') {
        btnLookup.classList.add('active');
        btnSearch.classList.remove('active');
        viewLookup.classList.remove('hidden-view');
        viewSearch.classList.add('hidden-view');
        document.body.focus();
    } else {
        btnSearch.classList.add('active');
        btnLookup.classList.remove('active');
        viewSearch.classList.remove('hidden-view');
        viewLookup.classList.add('hidden-view');
        searchInput.focus();
    }
}

btnLookup.addEventListener('click', () => setMode('lookup'));
btnSearch.addEventListener('click', () => setMode('search'));

function createCard(char, name, hex) {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.onclick = () => {
        setMode('lookup');
        processCharacter(char, false);
    };
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'COPY';
    copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(char);
        copyBtn.textContent = 'COPIED!';
        setTimeout(() => copyBtn.textContent = 'COPY', 2000);
    };
    
    const charDiv = document.createElement('div');
    charDiv.className = 'card-char';
    charDiv.textContent = char;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'card-name';
    nameDiv.textContent = name;
    
    const hexDiv = document.createElement('div');
    hexDiv.className = 'card-hex';
    hexDiv.textContent = `U+${hex}`;
    
    card.append(copyBtn, charDiv, nameDiv, hexDiv);
    return card;
}

function updateHistory(char, name, hex) {
    charHistory = charHistory.filter(item => item.char !== char);
    charHistory.unshift({char, name, hex});
    if (charHistory.length > 5) charHistory.pop();
    renderHistory();
}

function renderHistory() {
    if (charHistory.length === 0) {
        historySection.classList.add('hidden');
        return;
    }
    historySection.classList.remove('hidden');
    historyContainer.innerHTML = '';
    charHistory.forEach(item => {
        historyContainer.appendChild(createCard(item.char, item.name, item.hex));
    });
}

function fuzzySearch(name, query) {
    let i = 0;
    for (let j = 0; j < name.length && i < query.length; j++) {
        if (name[j] === query[i]) i++;
    }
    return i === query.length;
}

function doSearch(query) {
    searchResultsContainer.innerHTML = '';
    query = query.toUpperCase().trim().replace(/\s+/g, ' ');
    if (!query || query.length < 2) return;
    
    const results = [];
    const seen = new Set();
    const queryWords = query.split(' ');
    
    function isMatch(name) {
        if (queryWords.every(w => name.includes(w))) return true;
        if (fuzzySearch(name.replace(/ /g, ''), query.replace(/ /g, ''))) return true;
        return false;
    }
    
    for (const [cpStr, name] of Object.entries(ASCII_NAMES)) {
        if (isMatch(name)) {
            const cp = parseInt(cpStr, 10);
            let displayChar = String.fromCodePoint(cp);
            if (cp <= 32 || cp === 127) displayChar = CONTROL_SYMBOLS[cp] || '#';
            const hex = cp.toString(16).toUpperCase().padStart(4, '0');
            results.push({char: displayChar, rawChar: String.fromCodePoint(cp), name, hex});
            seen.add(hex);
        }
    }
    
    if (unicodeDataMap) {
        for (const [hex, name] of unicodeDataMap.entries()) {
            if (isMatch(name) && !seen.has(hex)) {
                const cp = parseInt(hex, 16);
                const displayChar = String.fromCodePoint(cp);
                results.push({char: displayChar, rawChar: String.fromCodePoint(cp), name, hex});
                seen.add(hex);
            }
            if (results.length > 100) break;
        }
    }
    
    results.slice(0, 50).forEach(item => {
        searchResultsContainer.appendChild(createCard(item.char, item.name, item.hex));
    });
}

searchInput.addEventListener('input', (e) => doSearch(e.target.value));

function resetView() {
    isAwake = false;
    displayEl.style.display = 'none';
    infoContainer.classList.add('hidden');
    instructContainer.classList.remove('hidden');
    displayEl.textContent = '';
    nameEl.textContent = '';
    meaningEl.textContent = '';
}

async function processCharacter(char, addToHistory = true) {
    if (!char || char.length === 0) return;
    
    const cp = char.codePointAt(0);
    const hex = cp.toString(16).toUpperCase().padStart(4, '0');
    
    let name = "LOADING...";
    let meaning = "";
    
    if (cp <= 127) {
        name = ASCII_NAMES[cp];
        meaning = cp <= 31 || cp === 127 ? "Standard ASCII Control Character" : "Standard ASCII Character";
    }
    
    let displayChar = char;
    if (cp <= 32 || cp === 127) {
        displayChar = CONTROL_SYMBOLS[cp];
    }

    displayEl.textContent = displayChar;
    nameEl.textContent = name;
    meaningEl.textContent = meaning;
    codeEl.textContent = `DEC: ${cp}`;
    hexEl.textContent = `HEX: 0x${hex}`;
    
    if (!isAwake) {
        isAwake = true;
        instructContainer.classList.add('hidden');
        infoContainer.classList.remove('hidden');
        displayEl.style.display = 'flex';
        displayEl.style.opacity = '1';
    }

    // Resolving exact name if not standard ASCII
    if (cp > 127) {
        let asyncName = await getUnicodeName(hex);
        if (asyncName.startsWith('<') && asyncName.endsWith('>')) {
            // It's a control or private use char
            asyncName = asyncName.replace(/[<>]/g, '').toUpperCase();
            meaningEl.textContent = "Special formatting or private use character";
        } else {
            meaningEl.textContent = `Unicode block character (U+${hex})`;
        }
        
        nameEl.textContent = asyncName;
        if (addToHistory) updateHistory(char, asyncName, hex);
    } else {
        if (addToHistory) updateHistory(char, name, hex);
    }
}

// Prefetch unicode map as soon as app starts so it's instant later
fetch('https://cdn.jsdelivr.net/gh/unicode-org/icu@main/icu4c/source/data/unidata/UnicodeData.txt')
    .then(r => r.text())
    .then(data => {
        unicodeDataMap = new Map();
        data.split('\n').forEach(line => {
            if (!line) return;
            const parts = line.split(';');
            if (parts.length >= 2) {
                unicodeDataMap.set(parts[0], parts[1]);
            }
        });
        console.log('Unicode characters loaded to memory');
    }).catch(e => console.error('Failed to pre-cache UnicodeData:', e));

document.addEventListener('keydown', (e) => {
    if (currentMode === 'search' && e.key !== 'Escape') {
        // If in search input, don't trigger lookup typing unless escaping
        if (e.target.tagName === 'INPUT') return;
    }

    if (e.key === 'Escape') {
        if (currentMode === 'search') {
            setMode('lookup');
            searchInput.value = '';
            searchResultsContainer.innerHTML = '';
            return;
        }
        
        const now = Date.now();
        if (now - lastEscTime < 400) {
            resetView();
            return;
        }
        lastEscTime = now;
        processCharacter(String.fromCharCode(27));
        return;
    }

    // Ignore single keys if we are focused in input
    if (e.target.tagName === 'INPUT') return;

    if (e.key.length === 1) {
        if (e.key === " ") {
            processCharacter(" ");
        } else {
            processCharacter(e.key);
        }
    } else if (e.key === "Enter") {
        processCharacter("\n");
        e.preventDefault();
    } else if (e.key === "Tab") {
        processCharacter("\t");
        e.preventDefault();
    } else if (e.key === "Backspace") {
        processCharacter(String.fromCharCode(8));
    }
});

document.addEventListener('paste', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    if (pastedText && pastedText.length > 0) {
        setMode('lookup');
        processCharacter(Array.from(pastedText)[0]);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    displayEl.textContent = '';
    displayEl.style.display = 'none';
});