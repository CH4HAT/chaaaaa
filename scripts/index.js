/**
 * This program implements a simple card guessing game. 
 * A card is randomly selected from a list of 9 cards and 
 * hidden from view while the player attempts to guess which
 * card it is. 
 * The 9 cards are displayed face up in a 3x3 grid and the player
 * guesses by clicking on one of the cards.
 * The player can opt to be given multiple chances to guess the card.
 * If the player wins or runs out of guesses, a 'show' button is
 * displayed, allowing the player to reveal the answer.
 */
import {
    getCard,
    getCheckbox,
    getContinueBtn,
    getNumberInput,
    getOutput,
    getPanel,
    getRestartBtn,
    getShowBtn,
    getTiles,
    getTries,
    setCard,
    showCard,
    shuffle,
    toggleInputState,
} from './helpers.js';

// Global variable for keeping track of player preferences.
// Needed because it is accessed and updated by multiple functions
let tries;

function setup() {
    /**
     * Register all the event listeners. These include:
     * - click events on the card tiles in the right panel. The behavior is
     * as follows: when a tile is clicked, its name is compared to the name of
     * the card to guess. If they match, player wins. Otherwise, the game ends 
     * or the player is given the chance to guess again.
     * 
     * - click events on the show button. When clicked, the card to guess is revealed.
     * 
     * - click events on the restart button. When clicked, a new round of the game is started.
     * 
     * - click events on continue button. When clicked, the player is given the opportunity to make another guess
     * 
     * - change event on the checkbox. This results in the input being enabled or disabled depending on whether 
     * the state of the checkbox.
     * 
     * - input event on the input box. If no value is entered, nothing happens, otherwise, the new value is 
     * assigned to the 'tries' variable and the game is restarted.
     * 
     */

    getShowBtn().addEventListener('click', showCard);
    getRestartBtn().addEventListener('click', play);
    getContinueBtn().addEventListener('click', activate);
    getCheckbox().addEventListener('change', toggleInputState);
    getNumberInput().addEventListener('input', (event) => {
        const inputValue = event.target.value.trim();
        if (inputValue === '') {
            return;
        }
        restartGame();
    });


    for (let tile of getTiles()) {
        tile.addEventListener('click', (e) => {
            const outputNodes = getOutput().querySelectorAll('span');
    
            outputNodes.item(0).innerHTML = `You selected the <b>${e.target.alt}</b>`;
    
            if (tile.alt === getCard()) {
                outputNodes.item(1).textContent = 'You win!';
                showResults();
            } else {
                outputNodes.item(1).textContent = 'Not quite!';
                if (tries > 1) {
                    pause();
                } else {
                    showResults();
                }
            }
        })
    }
    
}

function deactivate() {
    /**
     * Called after each guess
     * - Disable click events on the card tiles and dim
     * the selection panel
     */
    for (let tile of getTiles()) {
        tile.toggleAttribute('disabled', true);
    }

    getPanel().classList.toggle('dim', true);
}

function activate() {
    /**
     * Called on page load or when the 'restart' button is clicked
     * - (Re-)enable click events on the card tiles and un-dim
     * the selection panel
     * - Uncheck the checkbox (if checked) and disable the input. 
     * - Hide the 'continue' button. 
     * - Restore the 'show' button (which might have been 
     * disabled in the previous round)to active state 
     */
    for (let tile of getTiles()) {
        tile.toggleAttribute('disabled', false);
    }
    getPanel().classList.toggle('dim', false);

    getCheckbox().toggleAttribute('checked', false);
    getContinueBtn().classList.toggle('hidden', true);
    getShowBtn().toggleAttribute('disabled', false);
}


function play() {
    /**
     * Called on page load or when the 'restart' button is clicked
     * - Randomly choose a card to guess
     * - Scramble the card tiles
     * - Restore number of tries
     * - Activate the selection panel
     * - Hide the 'show' and 'restart' buttons
     * - Clear the previous round's output
     */
    setCard();

    const tiles = getTiles(); // -> NodeList
    const randomizedTiles = shuffle(Array.from(tiles)) // first turn NodeList into Array
    for (let i = 0; i < randomizedTiles.length; i++) {
        randomizedTiles[i].parentElement.style.order = `${i}`;
    }

    tries = getTries();

    activate();

    getShowBtn().classList.toggle('hidden', true);
    getRestartBtn().classList.toggle('hidden', true);

    getOutput().querySelectorAll('span:not(:last-child)').forEach(el => el.textContent = '');
}


function pause() {
    /**
     * Called only if the player has more guesses to try. (tries > 1)
     * - De-activate the selection panel and dim it
     * - Show the number of tries left
     * - Show the continue button
     */
    deactivate();
    getOutput().querySelector('span:last-child').textContent = `You have ${--tries} left`;
    getContinueBtn().classList.toggle('hidden', false);
}


function showResults() {
    /**
     * Called in case the player wins or ran out of guesses.
     * - De-activate the selection panel
     * - Hide the continue button
     * - Show the 'show' and 'restart' buttons
     * - Stop showing the number of tries left
     */
    deactivate();
    getContinueBtn().classList.toggle('hidden', true);
    getShowBtn().classList.toggle('hidden', false);
    getRestartBtn().classList.toggle('hidden', false);
    getOutput().querySelector('span:last-child').textContent = '';
}

// Set up and start the game
setup();
play();