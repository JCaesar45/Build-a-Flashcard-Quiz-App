// FlashCard interface
interface FlashCard {
  questionText: string;
  questionAnswer: string;
}

// Custom error class
class InvalidUserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUserInputError";
  }
}

// Collection of FlashCard elements
const currentCards: FlashCard[] = [
  { questionText: "What is the capital of France?", questionAnswer: "Paris" },
  { questionText: "How many continents are there?", questionAnswer: "7" },
  { questionText: "What is 5 × 7?", questionAnswer: "35" }
];

// Track current index
let currentIndex: number = 0;
let isFlipped: boolean = false;

// DOM elements
const flashcardElement = document.getElementById('flashcard') as HTMLDivElement;
const flashcardContent = document.getElementById('flashcard-content') as HTMLDivElement;
const deleteBtn = document.getElementById('delete-btn') as HTMLButtonElement;
const entryForm = document.getElementById('entry-form') as HTMLFormElement;
const frontTextArea = document.getElementById('front-text') as HTMLTextAreaElement;
const backTextArea = document.getElementById('back-text') as HTMLTextAreaElement;
const cardCounterSpan = document.getElementById('card-counter') as HTMLSpanElement;

// Render current card
function renderCard(): void {
  if (!flashcardContent || !flashcardElement) return;

  flashcardElement.classList.remove('flipped');

  if (currentCards.length === 0) {
    flashcardContent.innerHTML = '<span style="opacity:0.7;">📭 No flashcards</span>';
    updateCounter();
    isFlipped = false;
    return;
  }

  if (currentIndex >= currentCards.length) {
    currentIndex = currentCards.length - 1;
  }
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const card: FlashCard = currentCards[currentIndex];
  let displayText: string = '';
  let label: string = '';

  if (isFlipped) {
    displayText = card.questionAnswer;
    label = 'Answer';
    flashcardElement.classList.add('flipped');
  } else {
    displayText = card.questionText;
    label = 'Question';
  }

  flashcardContent.innerHTML = `<div class="card-label">${label}</div><div>${displayText}</div>`;
  updateCounter();
}

function updateCounter(): void {
  if (cardCounterSpan) {
    if (currentCards.length === 0) {
      cardCounterSpan.textContent = 'No cards';
    } else {
      cardCounterSpan.textContent = `${currentIndex + 1} / ${currentCards.length}`;
    }
  }
}

// Flip card handler
function handleFlashcardClick(): void {
  if (currentCards.length === 0) return;
  isFlipped = !isFlipped;
  renderCard();
}

// Delete current card handler
function handleDelete(): void {
  if (currentCards.length === 0) return;

  currentCards.splice(currentIndex, 1);

  if (currentCards.length === 0) {
    currentIndex = 0;
    isFlipped = false;
    renderCard();
    return;
  }

  if (currentIndex > 0) {
    currentIndex = currentIndex - 1;
  } else {
    currentIndex = 0;
  }

  isFlipped = false;
  renderCard();
}

// Form submit handler
function handleFormSubmit(event: Event): void {
  event.preventDefault();

  const questionText: string = frontTextArea.value.trim();
  const questionAnswer: string = backTextArea.value.trim();

  if (questionText === '' || questionAnswer === '') {
    throw new InvalidUserInputError('Both question and answer must be provided.');
  }

  const newCard: FlashCard = {
    questionText: questionText,
    questionAnswer: questionAnswer
  };

  currentCards.push(newCard);
  currentIndex = currentCards.length - 1;
  isFlipped = false;
  renderCard();

  frontTextArea.value = '';
  backTextArea.value = '';
}

// Event listeners
flashcardElement.addEventListener('click', handleFlashcardClick);
deleteBtn.addEventListener('click', handleDelete);
entryForm.addEventListener('submit', handleFormSubmit);

// Initial render
renderCard();
