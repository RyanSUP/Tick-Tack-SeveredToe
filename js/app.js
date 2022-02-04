
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
    boardSquares = [-1, -1, -1, null, 1, -1, 1, -1, -1,]
    
    // init turn
    turn = 1 

    // init winState to null
    winState = null
    // render
    renderBoard()
}

function renderBoard() {
    sqrElements.forEach( (sqr, idx) => {
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
}

// [ ] 5.6) Set the winner variable if there's a winner by calling a new function: getWinner.
	  // The getWinner function will...

		  // [x] 5.6.1.1) Loop through the each of the winning combination arrays defined.
		  // [x] 5.6.1.2) Total up the three board positions using the three indexes in the current combo.
		  // [x] 5.6.1.3) Convert the total to an absolute value (convert any negative total to positive).
		  // [x] 5.6.1.4) If the total equals 3, we have a winner! Set the winner variable to the board's value at the index specified by the first index of that winning combination's array by returning that value.

		// 5.6.3) Next, If there's no winner, check if there's a tie:

		// 5.6.4) Set the winner varible to "T" if there are no more nulls in the board array by returning the string "T".
	  
		// 5.6.5) Otherwise return null.

/*-------------------------------- Main --------------------------------*/
init()