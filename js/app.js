/**
 * [x] render tie on tie game
 * [ ] crown the winner
 * [ ] Fill board with 'N E W G A M E / Reset
 * [X] Can't replay when game is a tie
 * [x] Ties break off of tokens when the screen shrinkts. This is because tie is a smaller div inside the header.
 */

/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const message = document.querySelector('#message')
const boardSection = document.querySelector('.board')
const replayBtn = document.querySelector('#replay')
const header = document.querySelector('header')
const ties = document.querySelector('.ties')

/*----------------------------- Event Listeners -----------------------------*/
boardSection.addEventListener('click', handleBoardClick)
replayBtn.addEventListener('click', init)
header.addEventListener('click', setGameToken)


/*-------------------------------- Constants --------------------------------*/
/**
    [
        [0, 1, 2]
        [3, 4, 5]
        [6, 7, 8]
    ]
*/
const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]

// Convert htmlCollection to array 
// (https://www.gavsblog.com/blog/htmlcollection-foreach-loop-convert-object-to-array-javascript)
const headerChildren = [...header.children]
headerChildren.pop() // Get rid of the duplicate ties (workaround for now)

/*---------------------------- Variables (state) ----------------------------*/
// turn 1 = X, turn -1 = O
let boardSquares, turn, winState, firstPlayerToken, secondPlayerToken

/*-------------------------------- Main --------------------------------*/
init()

/*-------------------------------- Functions --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]
    
    // Hide the ties (when replay button is pressed)
    hideTies()

    // init tokens
    makeHeaderChildrenSelectable()
    firstPlayerToken = null
    secondPlayerToken = null

    // init turn
    turn = 1 

    // Reset turn indicator (opacity on tokens)
    resetTurnIndicator()

    // init winState to null
    winState = null

    // render
    render()
}

// Gives the game tokens at the top of the screen a class. This lets the players choose again if the game is reset.
function makeHeaderChildrenSelectable() {
    headerChildren.forEach(child =>  child.className = 'selectable')
}

function renderTie() {
    ties.removeAttribute('hidden')
}

function hideTies() {
    ties.setAttribute('hidden', true)
}


function render() {
    renderMessage()
    renderReplayButton()
    renderBoard()
}

function renderBoard() {
    sqrElements.forEach((sqr, idx) => {
        let boardSqr = boardSquares[idx]
        if(boardSqr) { // not null
            sqr.innerHTML = (boardSqr > 0 ) ?  firstPlayerToken : secondPlayerToken
        } else {
            sqr.innerHTML = ''
        }
    })
}

function renderTurnIndicator() {
    headerChildren.forEach(child => {
        if(turn > 0 ) {
            child.style.opacity = (child.className.includes('player1') === false) ? '40%' : '100%'
        } else {
            child.style.opacity = (child.className.includes('player-1') === false) ? '40%' : '100%'
        }
    })
}

function resetTurnIndicator() {
    headerChildren.forEach(child => child.style.opacity = '100%')
}

function renderMessage() {
    if(firstPlayerToken === null || secondPlayerToken === null) {
        // New game, show message and wait for players to select tokens
        renderPlayerSelectMessage()
    } else if(winState === null) {
        // Game in progress, hide message
        message.textContent = ''
        renderTurnIndicator()
    } else if(winState === 'T') {
        // Tie game, show the tie!
        resetTurnIndicator()
        message.textContent = 'Tie Game!'
        renderTie()
    } else {
        // Crown the winner!
        message.textContent = (winState > 0) ? "X wins!" : "O's wins!"
        confetti.start(2000)
    }
}

function renderPlayerSelectMessage() {
    bounceMessage() // Add animated prompt for selecting players.
    let player = (firstPlayerToken === null) ? 'Player 1' : 'Player 2'
    message.innerHTML = `${player}, pick a token!` 
}

function renderReplayButton() {
    if(winState === null) {
        replayBtn.style.visibility = 'hidden'
    } else {
        replayBtn.style.visibility = 'visible'
    }
}

function bounceMessage() {
    message.classList.add("animate__bounce", "animate__repeat-2", "animate__slow")
}

function handleBoardClick(eventObject) {
    let id = stripElementIdForIndex(eventObject.target)

    // players haven't picked tokens
    if(firstPlayerToken === null || secondPlayerToken === null) {
        return
    }

    // Square is already taken
    if(boardSquares[id] !== null) { 
        return
    }
    // Game is over
    if(winState !== null) {
        return 
    }

    boardSquares[id] = turn
    nextTurn()
    winState = getWinner()
    render()
}

function stripElementIdForIndex(element) {
    return parseInt(element.id.slice(2))    
}

function nextTurn() { turn *= -1}

function getWinner() {
    for(let i = 0; i < winningCombinations.length; i++) {
        let total = winningCombinations[i].reduce((prev, idx) => { 
            return prev + boardSquares[idx] 
        }, 0)
        if(Math.abs(total) === 3) {
            return boardSquares[winningCombinations[i][0]]
        }
    }
    return (boardSquares.some((square) => square === null)) ? null : 'T'
}

function setGameToken(eventObject) {
    // Don't do anything if both players selected a token
    if(firstPlayerToken && secondPlayerToken) {
        return
    }

    if(eventObject.target.className === 'selectable') {
        // Remove selectable class from the gameToken, this way it can't be chosen twice.
        eventObject.target.classList.remove('selectable')
        // Add the player's turn number to the gameToken as a class. This will be used for the turn indicator and can potentially be used to target the winner's pieces so they animate at the end.
        eventObject.target.classList.add(`player${turn}`)
        
        // init chosen token
        let chosenToken = eventObject.target.cloneNode()
        chosenToken.classList.add("token")

        // Animate selected token needs to be done last so chosenToken doesn't copy the animation class.
        eventObject.target.classList.add('animate__heartBeat')
    
        
        // Set token to player
        if(turn > 0) {
            firstPlayerToken = chosenToken.outerHTML
        } else {
            secondPlayerToken = chosenToken.outerHTML
        }
        

        // Go to the next turn so player 2 can select their token.
        nextTurn()
    }
    render()
}