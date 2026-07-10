// ---- EDIT ME: add, remove, or change players in this list ----
const players = [
  { name: "Kylian Mbappé", nationality: "France", position: "Forward", club: "Real Madrid", age: 27 },
  { name: "Erling Haaland", nationality: "Norway", position: "Forward", club: "Manchester City", age: 25 },
  { name: "Jude Bellingham", nationality: "England", position: "Midfielder", club: "Real Madrid", age: 22 },
  { name: "Vinícius Júnior", nationality: "Brazil", position: "Forward", club: "Real Madrid", age: 25 },
  { name: "Bukayo Saka", nationality: "England", position: "Forward", club: "Arsenal", age: 24 },
  { name: "Pedri", nationality: "Spain", position: "Midfielder", club: "Barcelona", age: 23 },
];
// ----------------------------------------------------------------

const maxGuesses = 6;

const guessesLeftEl = document.getElementById('guesses-left');
const winCountEl = document.getElementById('win-count');
const resultEl = document.getElementById('game-result');
const statusEl = document.getElementById('game-status');
const clueListEl = document.getElementById('clue-list');
const guessHistoryEl = document.getElementById('guess-history');
const guessForm = document.getElementById('guess-form');
const guessInput = document.getElementById('guess-input');
const resetBtn = document.getElementById('reset-btn');

let currentPlayer = null;
let guessesUsed = 0;
let winCount = 0;
let gameOver = false;

// The order clues get revealed in, one per wrong guess
const clueOrder = [
  { key: 'nationality', label: 'Nationality' },
  { key: 'position', label: 'Position' },
  { key: 'club', label: 'Club' },
  { key: 'age', label: 'Age' },
];

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .trim();
}

function startGame() {
  currentPlayer = players[Math.floor(Math.random() * players.length)];
  guessesUsed = 0;
  gameOver = false;
  guessesLeftEl.textContent = maxGuesses;
  resultEl.textContent = '—';
  statusEl.textContent = 'Type a player name to guess';
  clueListEl.innerHTML = '';
  guessHistoryEl.innerHTML = '';
  guessInput.value = '';
  guessInput.disabled = false;
  guessForm.querySelector('.shot-btn').disabled = false;
  revealNextClue(); // give one free clue to start
}

function revealNextClue() {
  const revealedCount = clueListEl.children.length;
  if (revealedCount >= clueOrder.length) return;
  const clue = clueOrder[revealedCount];
  const li = document.createElement('li');
  li.innerHTML = `<span class="clue-label">${clue.label}:</span> ${currentPlayer[clue.key]}`;
  clueListEl.appendChild(li);
}

function addHistoryEntry(text, isCorrect) {
  const li = document.createElement('li');
  li.textContent = text;
  li.className = isCorrect ? 'correct' : 'wrong';
  guessHistoryEl.prepend(li);
}

function endGame(won) {
  gameOver = true;
  guessInput.disabled = true;
  guessForm.querySelector('.shot-btn').disabled = true;

  if (won) {
    winCount++;
    winCountEl.textContent = winCount;
    resultEl.textContent = 'WON';
    statusEl.textContent = `Correct! It was ${currentPlayer.name}.`;
  } else {
    resultEl.textContent = 'LOST';
    statusEl.textContent = `Out of guesses. It was ${currentPlayer.name}.`;
  }
}

guessForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (gameOver) return;

  const guess = guessInput.value.trim();
  if (!guess) return;

  const isCorrect = normalize(guess) === normalize(currentPlayer.name);

  if (isCorrect) {
    addHistoryEntry(`${guess} — correct!`, true);
    endGame(true);
    return;
  }

  guessesUsed++;
  addHistoryEntry(`${guess} — wrong`, false);
  guessInput.value = '';

  const remaining = maxGuesses - guessesUsed;
  guessesLeftEl.textContent = remaining;

  if (remaining <= 0) {
    endGame(false);
    return;
  }

  revealNextClue();
  statusEl.textContent = 'Wrong guess — new clue revealed';
});

resetBtn.addEventListener('click', startGame);

startGame();
