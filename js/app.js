

/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const message = document.querySelector('#message')
const boardSection = document.querySelector('.board')
const replayBtn = document.querySelector('#replay')
const header = document.querySelector('.game-tokens')
const ties = document.querySelector('.ties')
const crown = document.querySelector('.crown')
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

// This is a janky way around needing more cached references - grab everything in the div and trash what I dont want.
// I need to fix this.
headerChildren.pop()
headerChildren.shift()

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
    hideCrown()
    setAllHeaderChildrenVisible()

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

function renderCrown() {
    crown.removeAttribute('hidden')
}

function hideCrown() {
    crown.setAttribute('hidden', true)
}

function setAllHeaderChildrenVisible() {
    headerChildren.forEach(child => child.removeAttribute('hidden'))
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
        renderCrown()
        renderWinnerOnly()
        confetti.start(2000)
    }
}

function renderPlayerSelectMessage() {
    bounceMessage() // Add animated prompt for selecting players.
    let player = (firstPlayerToken === null) ? 'Player 1' : 'Player 2'
    message.innerHTML = `${player}, pick a token!` 
}

function renderReplayButton() {
    replayBtn.style.visibility = (winState === null) ? 'hidden' : 'visible'
}

function bounceMessage() {
    message.classList.add("animate__bounce", "animate__repeat-2", "animate__slow")
}

function handleBoardClick(eventObject) {
    let id = parseInt(eventObject.target.id.slice(2))

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

function nextTurn() { turn *= -1} 

function renderWinnerOnly() {
    // if the winstate is 1, hide everything that doesn't have a class of player1
    let winnerClass = (winState > 0) ? 'player1' : 'player-1'
    headerChildren.forEach(child => {
        if(!child.className.includes(winnerClass)) {
            child.setAttribute('hidden', true)
        }
    })
}

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