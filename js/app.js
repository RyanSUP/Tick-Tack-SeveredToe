
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
let boardSquares, turn, winState

/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const gameStatus = document.querySelector('#message')
const boardSection = document.querySelector('.board')

/*----------------------------- Event Listeners -----------------------------*/
boardSection.addEventListener('click', handleBoardClick)


/*-------------------------------- Functions --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]
    
    // init turn
    turn = 1 

    // init winState to null
    winState = null

    // render
    render()
}


function render() {
    renderBoard()
    renderGameStateMessage()
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
    if(winState === null) {
        gameStatus.textContent = (turn > 0) ? "X's turn!" : "O's turn!"
    } else if(winState === 'T'){
        gameStatus.textContent = 'Tie game!'
    } else {
        gameStatus.textContent = (winState > 0) ? "X wins!" : "O's wins!"
        confetti.start(2000)
    }
}


function handleBoardClick(eventObject) {
    let id = stripElementIdForIndex(eventObject.target)

    // Square is already taken
    if(boardSquares[id] !== null) { 
        return
    }
    // Game is over
    if(winState !== null) {
        return 
    }

    boardSquares[id] = turn
    turn *= -1
    winState = getWinner()
    render()
}

function stripElementIdForIndex(element) {
    return parseInt(element.id.slice(2))    
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

/*-------------------------------- Main --------------------------------*/
init()