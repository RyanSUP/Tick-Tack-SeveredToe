/**
 * [ ] Replace the x and o with images
 * [ ] Allow user to select tic, tac, or toe as a token
 *      [ ] Users should not be able to select the same token
 *      [ ] Users cannot pick a new token once the game starts
 *      [ ] Prompt user with message (bonus points for using animation!)
 * [ ] Update message to display the token instead of x o
 * [ ] 
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
const gameStatus = document.querySelector('#message')
const boardSection = document.querySelector('.board')
const replayBtn = document.querySelector('#replay')
const gameTokens = document.querySelector('.token-select')

/*----------------------------- Event Listeners -----------------------------*/
boardSection.addEventListener('click', handleBoardClick)
replayBtn.addEventListener('click', init)
gameTokens.addEventListener('click', setGameToken)

/*-------------------------------- Functions --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]

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


function render() {
    renderGameStateMessage()
    renderReplayButton()
    renderBoard()
}

function renderBoard() {
    sqrElements.forEach((sqr, idx) => {
        let boardSqr = boardSquares[idx]
        if(boardSqr) { // not null
            sqr.textContent = (boardSqr > 0 ) ?  'X' : 'O'
        } else {
            sqr.textContent = ''
        }
    })
}

function renderGameStateMessage() {
    if(firstPlayerToken === null) {
        gameStatus.innerHTML = '<span>^ </span>Player 1, pick!<span> ^</span>'
    } else if(secondPlayerToken === null) {
        gameStatus.innerHTML = '<span>^ </span>Player 2, pick!<span> ^</span>'
    } else if(winState === null) {
        gameStatus.textContent = (turn > 0) ? "X's turn!" : "O's turn!"
    } else if(winState === 'T'){
        gameStatus.textContent = 'Tie game!'
    } else {
        gameStatus.textContent = (winState > 0) ? "X wins!" : "O's wins!"
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
    if(eventObject.target.className === 'selectable') {
        if(turn > 0) {
            firstPlayerToken = eventObject.target.outerHTML
        } else {
            secondPlayerToken = eventObject.target.outerHTML
        }
        eventObject.target.className = ''
        nextTurn()
    }
    render()
}

/*-------------------------------- Main --------------------------------*/
init()