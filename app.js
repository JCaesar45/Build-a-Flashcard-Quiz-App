/**
 * Flashcard Quiz App — Compiled JavaScript
 * Transpiled from TypeScript source (app.ts) targeting ES2015.
 * All type annotations stripped; runtime behavior preserved.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions (runtime equivalents)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom error class for invalid user input in the entry form.
 */
var InvalidUserInputError = /** @class */ (function (_super) {
    __extends(InvalidUserInputError, _super);
    function InvalidUserInputError(message) {
        if (message === void 0) { message = "Question text and answer cannot be empty."; }
        var _this = _super.call(this, message) || this;
        _this.name = "InvalidUserInputError";
        Object.setPrototypeOf(_this, InvalidUserInputError.prototype);
        return _this;
    }
    return InvalidUserInputError;
}(Error));

function __extends(d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}

// ─────────────────────────────────────────────────────────────────────────────
// Application State
// ─────────────────────────────────────────────────────────────────────────────

var currentCards = [
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

var currentIndex = 0;

// ─────────────────────────────────────────────────────────────────────────────
// DOM Element References
// ─────────────────────────────────────────────────────────────────────────────

var flashcardEl = document.getElementById("flashcard");
var frontDisplayEl = document.getElementById("front-display");
var backDisplayEl = document.getElementById("back-display");
var deleteBtnEl = document.getElementById("delete-btn");
var prevBtnEl = document.getElementById("prev-btn");
var nextBtnEl = document.getElementById("next-btn");
var entryFormEl = document.getElementById("entry-form");
var frontTextEl = document.getElementById("front-text");
var backTextEl = document.getElementById("back-text");
var cardCountEl = document.getElementById("card-count");
var totalCountEl = document.getElementById("total-count");
var toastContainerEl = document.getElementById("toast-container");
var frontCountEl = document.getElementById("front-count");
var backCountEl = document.getElementById("back-count");

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

function renderCard() {
    if (currentCards.length === 0) {
        renderEmptyState();
        updateCounter();
        updateNavButtons();
        return;
    }

    var card = currentCards[currentIndex];

    if (frontDisplayEl) {
        frontDisplayEl.textContent = card.questionText;
    }

    if (backDisplayEl) {
        backDisplayEl.textContent = card.questionAnswer;
    }

    if (flashcardEl && flashcardEl.classList.contains("flipped")) {
        flashcardEl.classList.remove("flipped");
    }

    updateCounter();
    updateNavButtons();
}

function updateCounter() {
    if (cardCountEl) {
        cardCountEl.textContent = currentCards.length > 0
            ? String(currentIndex + 1)
            : "0";
    }

    if (totalCountEl) {
        totalCountEl.textContent = String(currentCards.length);
    }
}

function updateNavButtons() {
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

function renderEmptyState() {
    if (frontDisplayEl) {
        frontDisplayEl.textContent = "No cards available";
    }

    if (backDisplayEl) {
        backDisplayEl.textContent = "Add a new card to get started";
    }
}

function deleteCurrentCard() {
    if (currentCards.length === 0) {
        return;
    }

    currentCards.splice(currentIndex, 1);

    if (currentIndex >= currentCards.length) {
        currentIndex = Math.max(0, currentCards.length - 1);
    }

    renderCard();
    showToast("Card deleted successfully", "success");
}

function goToPreviousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        renderCard();
    }
}

function goToNextCard() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        renderCard();
    }
}

function handleCardFlip(event) {
    event.preventDefault();

    if (!flashcardEl) return;

    flashcardEl.classList.toggle("flipped");
}

function validateFormInput(frontText, backText) {
    var trimmedFront = frontText.trim();
    var trimmedBack = backText.trim();

    if (trimmedFront.length === 0 || trimmedBack.length === 0) {
        throw new InvalidUserInputError(
            "Both question text and answer must be provided."
        );
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (!frontTextEl || !backTextEl) {
        return;
    }

    var frontValue = frontTextEl.value;
    var backValue = backTextEl.value;

    frontTextEl.classList.remove("error");
    backTextEl.classList.remove("error");

    try {
        validateFormInput(frontValue, backValue);

        var newCard = {
            questionText: frontValue.trim(),
            questionAnswer: backValue.trim()
        };

        currentCards.push(newCard);

        currentIndex = currentCards.length - 1;

        renderCard();

        frontTextEl.value = "";
        backTextEl.value = "";
        updateCharCounts();

        showToast("Flashcard added successfully!", "success");

    } catch (error) {
        if (error instanceof InvalidUserInputError) {
            if (frontValue.trim().length === 0 && frontTextEl) {
                frontTextEl.classList.add("error");
            }
            if (backValue.trim().length === 0 && backTextEl) {
                backTextEl.classList.add("error");
            }

            showToast(error.message, "error");
        } else {
            throw error;
        }
    }
}

function showToast(message, type) {
    if (type === void 0) { type = "success"; }
    if (!toastContainerEl) return;

    var toast = document.createElement("div");
    toast.className = "toast " + type;

    var iconSvg = type === "success"
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    toast.innerHTML =
        '<div class="toast-icon">' + iconSvg + '</div>' +
        '<span>' + message + '</span>';

    toastContainerEl.appendChild(toast);

    setTimeout(function () {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3500);
}

function updateCharCounts() {
    if (frontTextEl && frontCountEl) {
        frontCountEl.textContent = frontTextEl.value.length + "/500";
    }

    if (backTextEl && backCountEl) {
        backCountEl.textContent = backTextEl.value.length + "/500";
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Listeners
// ─────────────────────────────────────────────────────────────────────────────

function initEventListeners() {
    if (flashcardEl) {
        flashcardEl.addEventListener("click", handleCardFlip);

        flashcardEl.setAttribute("tabindex", "0");
        flashcardEl.setAttribute("role", "button");
        flashcardEl.setAttribute("aria-label", "Flip flashcard");

        flashcardEl.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardFlip(event);
            }
        });
    }

    if (deleteBtnEl) {
        deleteBtnEl.addEventListener("click", function (event) {
            event.stopPropagation();
            deleteCurrentCard();
        });
    }

    if (prevBtnEl) {
        prevBtnEl.addEventListener("click", function (event) {
            event.stopPropagation();
            goToPreviousCard();
        });
    }

    if (nextBtnEl) {
        nextBtnEl.addEventListener("click", function (event) {
            event.stopPropagation();
            goToNextCard();
        });
    }

    if (entryFormEl) {
        entryFormEl.addEventListener("submit", handleFormSubmit);
    }

    if (frontTextEl) {
        frontTextEl.addEventListener("input", updateCharCounts);
    }

    if (backTextEl) {
        backTextEl.addEventListener("input", updateCharCounts);
    }

    document.addEventListener("keydown", function (event) {
        var target = event.target;
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

function init() {
    renderCard();
    updateCharCounts();
    initEventListeners();

    console.log("Flashcard Quiz App initialized. Cards loaded:", currentCards.length);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
