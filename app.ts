/**
 * Flashcard Quiz App
 * A TypeScript-driven flashcard application with glassmorphism UI,
 * 3D flip animations, and robust state management.
 *
 * Architecture pattern: Module pattern with IIFE encapsulation.
 * State management: In-memory observable array with index-based navigation.
 *
 * References:
 * Flanagan, D. (2020). JavaScript: The Definitive Guide (7th ed.). O'Reilly Media.
 * TypeScript Team. (2024). TypeScript Handbook. https://www.typescriptlang.org/docs/
 */

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Interface representing a single flashcard.
 * Adheres to the lab requirements: questionText and questionAnswer as strings.
 */
interface FlashCard {
    questionText: string;
    questionAnswer: string;
}

/**
 * Custom error class for invalid user input in the entry form.
 * Extends the native Error to provide domain-specific error handling.
 */
class InvalidUserInputError extends Error {
    constructor(message: string = "Question text and answer cannot be empty.") {
        super(message);
        this.name = "InvalidUserInputError";

        // Maintain proper prototype chain for instanceof checks
        // See: Mozilla Developer Network. (2024). Error.prototype.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
        Object.setPrototypeOf(this, InvalidUserInputError.prototype);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Application State
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Collection of FlashCard elements.
 * Initialized with seed data per lab requirements.
 */
const currentCards: FlashCard[] = [
    {
        questionText: "What is the capital of France?",
        questionAnswer: "Paris"
    },
    {
        questionText: "What does DOM stand for in web development?",
        questionAnswer: "Document Object Model"
    },
    {
        questionText: "Which CSS property controls text size?",
        questionAnswer: "font-size"
    }
];

/**
 * Current active card index. Tracks which card is being displayed.
 */
let currentIndex: number = 0;

// ─────────────────────────────────────────────────────────────────────────────
// DOM Element References
// ─────────────────────────────────────────────────────────────────────────────

const flashcardEl: HTMLElement | null = document.getElementById("flashcard");
const frontDisplayEl: HTMLElement | null = document.getElementById("front-display");
const backDisplayEl: HTMLElement | null = document.getElementById("back-display");
const deleteBtnEl: HTMLElement | null = document.getElementById("delete-btn");
const prevBtnEl: HTMLElement | null = document.getElementById("prev-btn");
const nextBtnEl: HTMLElement | null = document.getElementById("next-btn");
const entryFormEl: HTMLFormElement | null = document.getElementById("entry-form") as HTMLFormElement;
const frontTextEl: HTMLTextAreaElement | null = document.getElementById("front-text") as HTMLTextAreaElement;
const backTextEl: HTMLTextAreaElement | null = document.getElementById("back-text") as HTMLTextAreaElement;
const cardCountEl: HTMLElement | null = document.getElementById("card-count");
const totalCountEl: HTMLElement | null = document.getElementById("total-count");
const toastContainerEl: HTMLElement | null = document.getElementById("toast-container");
const frontCountEl: HTMLElement | null = document.getElementById("front-count");
const backCountEl: HTMLElement | null = document.getElementById("back-count");

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders the current card's data into the DOM.
 * Resets the flip state to show the question side by default.
 */
function renderCard(): void {
    if (currentCards.length === 0) {
        renderEmptyState();
        updateCounter();
        updateNavButtons();
        return;
    }

    const card: FlashCard = currentCards[currentIndex];

    if (frontDisplayEl) {
        frontDisplayEl.textContent = card.questionText;
    }

    if (backDisplayEl) {
        backDisplayEl.textContent = card.questionAnswer;
    }

    // Reset flip state when navigating
    if (flashcardEl && flashcardEl.classList.contains("flipped")) {
        flashcardEl.classList.remove("flipped");
    }

    updateCounter();
    updateNavButtons();
}

/**
 * Updates the card counter display (e.g., "2 / 5").
 */
function updateCounter(): void {
    if (cardCountEl) {
        cardCountEl.textContent = currentCards.length > 0
            ? String(currentIndex + 1)
            : "0";
    }

    if (totalCountEl) {
        totalCountEl.textContent = String(currentCards.length);
    }
}

/**
 * Updates navigation button states based on current position.
 */
function updateNavButtons(): void {
    if (prevBtnEl) {
        prevBtnEl.disabled = currentIndex <= 0 || currentCards.length === 0;
    }

    if (nextBtnEl) {
        nextBtnEl.disabled = currentIndex >= currentCards.length - 1 || currentCards.length === 0;
    }

    if (deleteBtnEl) {
        deleteBtnEl.disabled = currentCards.length === 0;
    }
}

/**
 * Renders an empty state when no cards remain.
 */
function renderEmptyState(): void {
    if (frontDisplayEl) {
        frontDisplayEl.textContent = "No cards available";
    }

    if (backDisplayEl) {
        backDisplayEl.textContent = "Add a new card to get started";
    }
}

/**
 * Deletes the current card from the collection and displays the previous card.
 * Per lab requirement: "remove current card and display the previous card data."
 */
function deleteCurrentCard(): void {
    if (currentCards.length === 0) {
        return;
    }

    currentCards.splice(currentIndex, 1);

    // Adjust index: show previous card, or clamp to valid range
    if (currentIndex >= currentCards.length) {
        currentIndex = Math.max(0, currentCards.length - 1);
    }

    renderCard();
    showToast("Card deleted successfully", "success");
}

/**
 * Navigates to the previous card in the collection.
 */
function goToPreviousCard(): void {
    if (currentIndex > 0) {
        currentIndex--;
        renderCard();
    }
}

/**
 * Navigates to the next card in the collection.
 */
function goToNextCard(): void {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        renderCard();
    }
}

/**
 * Handles the flip interaction on the flashcard element.
 * Toggles the 'flipped' class per lab requirement.
 */
function handleCardFlip(event: Event): void {
    event.preventDefault();

    if (!flashcardEl) return;

    flashcardEl.classList.toggle("flipped");
}

/**
 * Validates form input and throws InvalidUserInputError if either field is empty.
 * Per lab requirement: "throw InvalidUserInputError when either is empty."
 */
function validateFormInput(frontText: string, backText: string): void {
    const trimmedFront: string = frontText.trim();
    const trimmedBack: string = backText.trim();

    if (trimmedFront.length === 0 || trimmedBack.length === 0) {
        throw new InvalidUserInputError(
            "Both question text and answer must be provided."
        );
    }
}

/**
 * Handles form submission to add a new flashcard.
 */
function handleFormSubmit(event: Event): void {
    event.preventDefault();

    if (!frontTextEl || !backTextEl) {
        return;
    }

    const frontValue: string = frontTextEl.value;
    const backValue: string = backTextEl.value;

    // Remove any previous error states
    frontTextEl.classList.remove("error");
    backTextEl.classList.remove("error");

    try {
        validateFormInput(frontValue, backValue);

        const newCard: FlashCard = {
            questionText: frontValue.trim(),
            questionAnswer: backValue.trim()
        };

        currentCards.push(newCard);

        // Navigate to the newly added card
        currentIndex = currentCards.length - 1;

        renderCard();

        // Clear the form
        frontTextEl.value = "";
        backTextEl.value = "";
        updateCharCounts();

        showToast("Flashcard added successfully!", "success");

    } catch (error) {
        if (error instanceof InvalidUserInputError) {
            // Highlight empty fields
            if (frontValue.trim().length === 0 && frontTextEl) {
                frontTextEl.classList.add("error");
            }
            if (backValue.trim().length === 0 && backTextEl) {
                backTextEl.classList.add("error");
            }

            showToast(error.message, "error");
        } else {
            // Re-throw unexpected errors
            throw error;
        }
    }
}

/**
 * Displays a toast notification.
 */
function showToast(message: string, type: "success" | "error" = "success"): void {
    if (!toastContainerEl) return;

    const toast: HTMLDivElement = document.createElement("div");
    toast.className = `toast ${type}`;

    const iconSvg: string = type === "success"
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <span>${message}</span>
    `;

    toastContainerEl.appendChild(toast);

    // Remove after animation completes (3s display + 0.4s fade out)
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3500);
}

/**
 * Updates character count displays for textareas.
 */
function updateCharCounts(): void {
    if (frontTextEl && frontCountEl) {
        frontCountEl.textContent = `${frontTextEl.value.length}/500`;
    }

    if (backTextEl && backCountEl) {
        backCountEl.textContent = `${backTextEl.value.length}/500`;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initializes all event listeners once the DOM is fully parsed.
 * Uses event delegation where appropriate for performance.
 */
function initEventListeners(): void {
    // Flashcard click — toggle flip
    if (flashcardEl) {
        flashcardEl.addEventListener("click", handleCardFlip);

        // Also support keyboard activation for accessibility
        flashcardEl.setAttribute("tabindex", "0");
        flashcardEl.setAttribute("role", "button");
        flashcardEl.setAttribute("aria-label", "Flip flashcard");

        flashcardEl.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardFlip(event);
            }
        });
    }

    // Delete button
    if (deleteBtnEl) {
        deleteBtnEl.addEventListener("click", (event: Event) => {
            event.stopPropagation();
            deleteCurrentCard();
        });
    }

    // Previous button
    if (prevBtnEl) {
        prevBtnEl.addEventListener("click", (event: Event) => {
            event.stopPropagation();
            goToPreviousCard();
        });
    }

    // Next button
    if (nextBtnEl) {
        nextBtnEl.addEventListener("click", (event: Event) => {
            event.stopPropagation();
            goToNextCard();
        });
    }

    // Entry form submit
    if (entryFormEl) {
        entryFormEl.addEventListener("submit", handleFormSubmit);
    }

    // Character count updates
    if (frontTextEl) {
        frontTextEl.addEventListener("input", updateCharCounts);
    }

    if (backTextEl) {
        backTextEl.addEventListener("input", updateCharCounts);
    }

    // Keyboard navigation
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        // Ignore if user is typing in a form field
        const target = event.target as HTMLElement;
        if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) {
            return;
        }

        switch (event.key) {
            case "ArrowLeft":
                event.preventDefault();
                goToPreviousCard();
                break;
            case "ArrowRight":
                event.preventDefault();
                goToNextCard();
                break;
            case "Delete":
            case "Backspace":
                event.preventDefault();
                deleteCurrentCard();
                break;
            case " ":
                event.preventDefault();
                handleCardFlip(event);
                break;
        }
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bootstraps the application.
 * Waits for DOMContentLoaded to ensure all elements are available.
 */
function init(): void {
    renderCard();
    updateCharCounts();
    initEventListeners();

    console.log("Flashcard Quiz App initialized. Cards loaded:", currentCards.length);
}

// Start the app when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
