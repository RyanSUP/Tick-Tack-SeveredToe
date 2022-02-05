/**
 * [ ] Hide message when game starts
 * [ ] indicate player by adding a border to the current player's token (in the game title)
 * [ ] render tie on tie game
 * [ ] render token and crown when winner
 * [ ] after a delay, fade all images on the board
 * [ ] Fill board with 'N E W G A M E
 * [x] fix bug that allows you to click unselected game token during game
 */


/*-------------------------------- Constants --------------------------------*/
/**
    [
        [0, 1, 2]
        [3, 4, 5]
        [6, 7, 8]
    ]
*/
const winningCombinations = [
    [0, 1, 2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]


/*---------------------------- Variables (state) ----------------------------*/
// turn 1 = X, turn -1 = O
let boardSquares, turn, winState, firstPlayerToken, secondPlayerToken

/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const message = document.querySelector('#message')
const boardSection = document.querySelector('.board')
const replayBtn = document.querySelector('#replay')
const gameTokens = document.querySelector('header')

/*----------------------------- Event Listeners -----------------------------*/
boardSection.addEventListener('click', handleBoardClick)
replayBtn.addEventListener('click', init)
gameTokens.addEventListener('click', setGameToken)

/*-------------------------------- Functions --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]

    initGameTokens()

    // init tokens
    firstPlayerToken = null
    secondPlayerToken = null

    // init turn
    turn = 1 

    // init winState to null
    winState = null

    // render
    render()
}

function initGameTokens() {
    // Convert htmlColelction to array 
    // https://www.gavsblog.com/blog/htmlcollection-foreach-loop-convert-object-to-array-javascript
    let arr = [...gameTokens.children]
    arr.forEach(child => {
        child.className = 'selectable'
    })

}

function render() {
    renderTurnIndicator()
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
    if(firstPlayerToken !== null && secondPlayerToken !== null) {
        if(turn > 0) {
            document.querySelector('.player-1').classList.remove('turn')
            document.querySelector('.player1').classList.add('turn')
        } else {
            document.querySelector('.player1').classList.remove('turn')
            document.querySelector('.player-1').classList.add('turn')
        }
    }

}

function renderMessage() {
    bounceMessage() // Add animated prompt for selecting players.
    if(firstPlayerToken === null) {
        message.innerHTML = '<span>^ </span>Player 1, pick!<span> ^</span>'
    } else if(secondPlayerToken === null) {
        message.innerHTML = '<span>^ </span>Player 2, pick!<span> ^</span>'
    } else if(winState === null) {
        message.textContent = (turn > 0) ? "X's turn!" : "O's turn!"
    } else if(winState === 'T'){
        message.textContent = 'Tie game!'
    } else {
        message.textContent = (winState > 0) ? "X wins!" : "O's wins!"
        confetti.start(2000)
    }
}

function renderReplayButton() {
    if(winState === null) {
        replayBtn.setAttribute('hidden', true)
    } else {
        replayBtn.removeAttribute('hidden')
    }
}

function bounceMessage() {
    message.classList.add("animate__bounce", "animate__repeat-3", "animate__slow")
}

function toggleMessageHidden() {
    if(message.hasAttribute('hidden')) {
        message.removeAttribute('hidden')
    } else {
        message.setAttribute('hidden', true)
    }
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

        // Animate selected token. Needs to be done last so the chosen token doesn't copy the class
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


/*-------------------------------- Main --------------------------------*/
init()