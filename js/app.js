/**
 * [ ] Replace the x and o with images
 * [x] Allow user to select tic, tac, or toe as a token
 *      [x] Users should not be able to select the same token
 *      [x] Users cannot pick a new token once the game starts
 *      [x] Prompt user with message (bonus points for using animation!)
 * [ ] Update message to display the token instead of x o (I think I;m going to underline the current player)
 * [ ] Give player token a classname of token / remove selectable (try setting tokens = to html element instead of outerhtml)
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
const gameTokens = document.querySelector('.token-select')

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

function renderMessage() {
    if(firstPlayerToken === null) {
        message.innerHTML = '<span>^ </span>Player 1, pick!<span> ^</span>'
        bounceMessage() // Add animated prompt for selecting players.
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

function resetBouncingMessage() {
    // Don't animate forever...
    message.classList.remove("animate__repeat-3", "animate__slow")
    // ... but animate 2 more times
    // message.classList.add("animate__repeat-2")
}

function hideMessage() {
    
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
        // Remove selectable class from the selected token, this way it can't be chosen twice.
        eventObject.target.className = ''

        // Setup the player token
        let chosenToken = eventObject.target.cloneNode()
        chosenToken.className = 'token'
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