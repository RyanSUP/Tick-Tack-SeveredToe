/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/
// turn 1 = X, turn -1 = O
let boardSquares, turn, winState

/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const gameStatus = document.querySelector('#message')


/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]
    
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

	// 3.3) The render function should:
	  // [x] 3.3.1) Loop over the board array (which represents the squares on the page), and for each iteration:   
		  // [x] 3.3.1.1) Use the index of the iteration to access the square in the squares array that corresponds with the current cell being iterated over in the board array
		  // [x] 3.3.1.2) Style that square however you wish dependant on the value contained in the current cell being iterated over (-1, 1, or null)
	  // 3.3.2) [ ] Render a message reflecting the currrent game state:
	    // [x] 3.3.2.1) If winner has a value other than null (game still in progress), render whose turn it is.
	      // Hint: Maybe use a ternary inside of a template literal here?
	    // [x] 3.3.2.2) If winner is equal to 'T' (tie), render a tie message.
	    // [x] 3.3.2.3) Otherwise, render a congratulatory message to which player has won.
	      // Hint (again): Maybe use a ternary inside a template literal here
