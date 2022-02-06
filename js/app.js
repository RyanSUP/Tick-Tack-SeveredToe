/*------------------------ Cached Element References ------------------------*/
const sqrElements = document.querySelectorAll('.sq') // Returns a node-list
const message = document.querySelector('#message')
const boardSection = document.querySelector('.board')
const replayBtn = document.querySelector('#replay')
const ties = document.querySelector('.ties')
const crown = document.querySelector('.crown')
const avatars = document.querySelectorAll('.avatar')

/*----------------------------- Event Listeners -----------------------------*/
boardSection.addEventListener('click', handleBoardClick)
replayBtn.addEventListener('click', handleReplay)
// Don't want to take advantage of bubbling with the avatars because it allows the player
// to select the entire div as an avatar.
avatars.forEach(avatar => avatar.addEventListener('click', handleSelectAvatar))


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

/*---------------------------- Variables (state) ----------------------------*/
// turn 1 = X, turn -1 = O
let boardSquares, turn, winState, player1Avatar, player2Avatar

/*-------------------------------- Main --------------------------------*/
init()

/*-------------------------------- Functions --------------------------------*/

/*-------------------------------- 🥩  Meat n' Taters 🥔  --------------------------------*/
function init() {
    // init boardSquares to 9 nulls
    boardSquares = [null, null, null, null, null, null, null, null, null,]
    
    // init tokens
    player1Avatar = null
    player2Avatar = null

    // init turn
    turn = 1 

    // init winState to null
    winState = null

    // render
    render()
}

function handleBoardClick(eventObject) {
    let id = parseInt(eventObject.target.id.slice(2))

    // players haven't picked tokens
    if(player1Avatar === null || player2Avatar === null) {
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

function handleSelectAvatar(eventObject) {
    // Don't do anything if both players selected a piece
    if(player1Avatar && player2Avatar) {
        return
    }

    // Don't let a plater pick an avatar that is already claimed!
    if(eventObject.target.className.includes('player') === false) {
        
        // Copy the HTML of the selected piece
        let selectedAvatar = eventObject.target.cloneNode()
        selectedAvatar.classList.add("player-avatar")
        if(turn > 0) {
            player1Avatar = selectedAvatar.outerHTML
        } else {
            player2Avatar = selectedAvatar.outerHTML
        }
        
        // Animate selected token needs to be done last so selectedAvatar doesn't copy the animation class,
        // otherwise every time a player puts a piece on the board it will animate.
        // Add the player's turn number to the avatar as a class. Needed by helper functions.
        eventObject.target.classList.add("animate__heartBeat", `player${turn}`)

        // After animation, indicate to the other play that an avatar can't be picked
        setTimeout(() => eventObject.target.style.opacity = '40%', 700);
        
        // Go to the next turn so player 2 can select their avatar.
        nextTurn()
    }
    render()
}

/*-------------------------------- 🔌 Reseting the game 💾 --------------------------------*/

function handleReplay() {
    resetHTML()
    // Animations break on the next replay without this quick delay. Something to do with the event loop?
    setTimeout(() => {
        wobbleBoard()
        init()
    }, 5)
}

function resetHTML() {
    // Remove animation classes
    message.className = ""
    boardSection.className = "board"
    ties.className = "ties"
    // Reset avatars
    turnOffTurnIndicator()
    avatars.forEach(avatar => {
        avatar.className="avatar" // strip a player's claim to the avatar
        avatar.removeAttribute('hidden') // Show all avatars (Losers get hidden)
    })
    // Hide avatar accesories
    crown.setAttribute('hidden', true)
    ties.setAttribute('hidden', true)
    // Hide the replay
    replayBtn.style.visibility = 'hidden'

}

/*-------------------------------- 🖥  Rendering 🧾 --------------------------------*/
function render() {
    if(player1Avatar === null || player2Avatar === null) {
        // New game, show message and wait for players to select tokens
        renderPlayerSelectMessage()
    } else if(winState === null) {
        // Game in progress, hide message
        message.textContent = ''
        showTurnIndicator()
    } else if(winState === 'T') {
        // Tie game, show the ties!
        renderTieScreen()
    } else {
        // Winner!
        renderWinScreen()
    }
    renderBoard()
}

function renderPlayerSelectMessage() {
    bounceMessage() // Add animated prompt for selecting players.
    let player = (player1Avatar === null) ? 'Player 1' : 'Player 2'
    message.innerHTML = `${player}, pick a token!` 
}

function renderTieScreen() { 
    message.textContent = 'Tie Game!'
    replayBtn.style.visibility = 'visible'
    turnOffTurnIndicator()
    // Don the ties!  👔  👔  👔 
    ties.removeAttribute('hidden') 
    ties.classList.add("animate__animated", "animate__fadeInDown")
}

function renderWinScreen() {
    hideLosingPieces() // This makes crowning the winning piece easier since the winner will always be centered. (No one wants to see the loser anyway)
    replayBtn.style.visibility = 'visible'
    // Commence coronation! 👑
    crown.removeAttribute('hidden')
    confetti.start(2000)
}

function renderBoard() {
    sqrElements.forEach((sqr, idx) => {
        let boardSqr = boardSquares[idx]
        if(boardSqr) { // not null
            sqr.innerHTML = (boardSqr > 0 ) ?  player1Avatar : player2Avatar
        } else {
            sqr.innerHTML = ''
        }
    })
}

/*-------------------------------- 👷‍♂️ Helpers 🏗 --------------------------------*/
function bounceMessage() {
    message.classList.add(
        "animate__animated",
        "animate__bounce", 
        "animate__repeat-2", 
        "animate__slow"
    )
}

function wobbleBoard() {
    boardSection.classList.add(
        "animate__animated",
        "animate__wobble", 
        "animate__fast"
    )
}

function hideLosingPieces() {
    let winnerClass = (winState > 0) ? 'player1' : 'player-1'
    avatars.forEach(avatar => {
        // Hide if not the winner
        if(!avatar.className.includes(winnerClass)) {
            avatar.setAttribute('hidden', true)
        }
    })
}

function showTurnIndicator() {
    avatars.forEach(avatar => {
        if(turn > 0 ) {
            avatar.style.opacity = (avatar.className.includes('player1') === false) ? '40%' : '100%'
        } else {
            avatar.style.opacity = (avatar.className.includes('player-1') === false) ? '40%' : '100%'
        }
    })
}

function turnOffTurnIndicator() { avatars.forEach(avatar => avatar.style.opacity = '100%')}

function nextTurn() { turn *= -1} 
