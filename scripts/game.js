import {celebrateSession} from './utilities.js'

let gamesContainer = document.querySelector('.games-container')

let tenzies = document.querySelector('.tenziesContainer') 
let ticTacToe = document.querySelector('.tictactoeContainer') 
let reaction = document.querySelector('.reactionContainer') 
let rps = document.querySelector('.rpsContainer') 
// let memory = document.querySelector('.memeory') 
// let math = document.querySelector('.math')  

let games = [tenzies , ticTacToe , reaction , rps ] 
function showGame(item) {
    games.forEach(item => {
        item.classList.add('d-none')
    })
    item.classList.remove('d-none')
}
gamesContainer.addEventListener('click', function(event) {

    const game = event.target.closest('.game')
    if (game){
        const selectedGame = game.dataset.game
        console.log('hi'); 
        
        
        if (selectedGame === 'tenzies') {
            showGame(tenzies)
        } 

        else if (selectedGame === 'reaction') {
            showGame(reaction)

        }

        else if (selectedGame === 'tictactoe') {
            showGame(ticTacToe)

        }

        else if (selectedGame === 'rps') {
            showGame(rps)
        }
        else if(selectedGame === 'memory') {

        }
        else if(selectedGame === 'math'){

        }
    }
})




//tic tac toe

const cells = document.querySelectorAll('.tic-cell')
const statusText = document.querySelector('.game-status')
const restartBtn = document.querySelector('.restart-game')

let board = ['', '', '', '', '', '', '', '', '']

const PLAYER = 'X'
const AI = 'O'

let gameRunning = true
let aiThinking = false

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]


cells.forEach(cell => {

    cell.addEventListener('click', function () {

        const index = Number(cell.dataset.index)

        if (
            board[index] !== '' || !gameRunning || aiThinking) {
                return
            }
        board[index] = PLAYER
        cell.textContent = PLAYER

        if (checkGameEnd(PLAYER)) {
            return
        }

        aiThinking = true
        statusText.textContent = 'AI is thinking...'

        setTimeout(() => {

            aiMove()
            aiThinking = false
        }, 500)
    })

})

function minimax(board, isMaximizing) {

    if (checkWinner(AI)) return 1;
    if (checkWinner(PLAYER)) return -1;
    if (!board.includes('')) return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {

            if (board[i] === '') {

                board[i] = AI;

                let score = minimax(board, false);

                board[i] = '';

                bestScore = Math.max(bestScore, score);
            }
        }

        return bestScore;
    }

    else {

        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {

            if (board[i] === '') {

                board[i] = PLAYER;

                let score = minimax(board, true);

                board[i] = '';

                bestScore = Math.min(bestScore, score);
            }
        }

        return bestScore;
    }
}

function checkWinner(player) {

    return winningConditions.some(condition => {

        const [a, b, c] = condition;

        return (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        );

    });

}



function aiMove() {

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {

        if (board[i] === '') {

            board[i] = AI;

            let score = minimax(board, false);

            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== -1) {

        board[bestMove] = AI;
        cells[bestMove].textContent = AI;
    }

    if (checkGameEnd(AI)) return;

    statusText.textContent = "Your turn";
}


function checkGameEnd(player) {

    const won = winningConditions.some(condition => {
        const [a, b, c] = condition
        return (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        )
    })


    if (won) {

        if (player === PLAYER) {
            statusText.textContent = 'You win! 🎉'
            celebrateSession()
        }
        else {
            statusText.textContent = 'AI wins! 🤖'
        }

        gameRunning = false

        return true
    }


    if (!board.includes('')) {

        statusText.textContent = "It's a draw!"

        gameRunning = false

        return true
    }


    return false
}


restartBtn.addEventListener('click', restartGame)

let aiStarts = false;
function restartGame() {

    board = ['', '', '', '', '', '', '', '', ''];

    gameRunning = true;
    aiThinking = false;
    

    cells.forEach(cell => cell.textContent = '');

    aiStarts = !aiStarts;

    if (aiStarts) {

        statusText.textContent = "AI starts...";

        aiThinking = true;

        setTimeout(() => {

            aiMove();

            aiThinking = false;

        }, 500);

    }

    else {

        statusText.textContent = "Your turn";
    }

}



//tenzies 
let tenziesWinText = document.querySelector('.tenzies-win') 
let startNewTenzies = false;
let dice = document.querySelector('.dice-container') 
function rollRemainingDice(){ 
    tenziesWinText.textContent = '' 
    rollDice.textContent = 'Roll Dice'
    if(startNewTenzies) {
        dice.querySelectorAll('.die').forEach(die=>{
        die.dataset.status = 'notSelected'   
        die.classList.remove('die-selected')  
        die.classList.remove('win-die')
        startNewTenzies = false 
    })
    }
    dice.querySelectorAll('.die').forEach(die=>{
        if(die.dataset.status == 'notSelected') {
            die.textContent = Math.floor(Math.random() * 6) + 1 
        } 
    })
}

let rollDice = document.querySelector('.rollDice') 
rollDice.addEventListener('click' , function(event){
    rollRemainingDice()
    
})

dice.querySelectorAll('.die').forEach(die=>{
    die.addEventListener('click' , function(){ 
        if(die.dataset.status == 'notSelected') {
            die.classList.add('die-selected') 
            die.dataset.status = 'selected'
        }
        else if(die.dataset.status == 'selected') {
            die.classList.remove('die-selected') 
            die.dataset.status = 'notSelected'
        }

        let game = checkTenzies() 
        if (game) {
            // dice.querySelectorAll('.die').forEach(die=>{
            //     die.dataset.status == 'notCompleted'   
            //     die.classList.remove('die-selected')
            // })
            celebrateTenziesWin()
            tenziesWinText.textContent = 'You win! 🎉' 
            rollDice.textContent = 'Start Game'
            startNewTenzies = true  
        }
    })
})


function checkTenzies(){ 
    let selectedVal = dice.querySelector('.die').textContent 
    let end = true  
    dice.querySelectorAll('.die').forEach(die=>{
        if(die.dataset.status == 'notSelected' || die.textContent != selectedVal) {
            end =  false 
        }
    })
    return end  


}


function celebrateTenziesWin() {
    tenziesWinText.textContent = 'TENZIES! 🎉'
    tenziesWinText.classList.add('show-win')

    rollDice.textContent = 'Play Again'
    startNewTenzies = true

    const allDice = dice.querySelectorAll('.die')

    allDice.forEach((die, index) => {
        setTimeout(() => {
            die.classList.add('win-die')
        }, index * 70)
    })

    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    })
}

//reaction game 
// Reaction game
let reactiongameBtn = document.getElementById('reactionGame')

let reactionTimeout
let startTime = 0
let gameState = 'idle' 

reactiongameBtn.addEventListener('click', function () {
    startReactionGame()
})

function startReactionGame() {

    let reaction = document.querySelector('.reactionContainer')
    let reactionText = document.querySelector('.reaction-text')
    let reactionBody = document.querySelector('.reactionGame-body')
    let dots = document.querySelector('.dot')
    let icon = document.querySelector('.reaction-icon')
    let tryAgain = document.querySelector('.try-again')

    reaction.classList.remove('click-screen', 'screen-clicked')
    reaction.classList.add('reaction-waiting')

    reactionBody.classList.remove('click-screen')

    reactionText.textContent = 'Wait for Green'
    dots.textContent = '...'
    icon.textContent = ''
    tryAgain.textContent = ''

    gameState = 'waiting'

    let waitTime = Math.floor(Math.random() * 4) + 2

    console.log('Wait:', waitTime)

    clearTimeout(reactionTimeout)

    reactionTimeout = setTimeout(() => {
        reaction.classList.remove('reaction-waiting')
        reaction.classList.add('click-screen')

        reactionBody.classList.add('click-screen')

        reactionText.textContent = 'CLICK!'
        dots.textContent = ''

        gameState = 'ready'

        startTime = performance.now()

    }, waitTime * 1000)
}


// Handle clicks on game screen
document
    .querySelector('.reactionGame-body')
    .addEventListener('click', function () {

        let reaction = document.querySelector('.reactionContainer')
        let reactionText = document.querySelector('.reaction-text')
        let reactionBody = document.querySelector('.reactionGame-body')
        let dots = document.querySelector('.dot')
        let icon = document.querySelector('.reaction-icon')
        let tryAgain = document.querySelector('.try-again')

        if (gameState === 'waiting') {

            clearTimeout(reactionTimeout)

            gameState = 'result'

            reaction.classList.remove('reaction-waiting')
            reaction.classList.add('screen-clicked')

            reactionBody.classList.remove('click-screen')

            dots.textContent = ''
            icon.textContent = '⚠️'
            reactionText.textContent = 'Too Early!'
            tryAgain.textContent = 'Click to try again'

            return
        }
        //correct click
        if (gameState === 'ready') {

            let endTime = performance.now()

            let reactionTime = Math.round(endTime - startTime) 

            gameState = 'result'

            reaction.classList.remove('click-screen')
            reaction.classList.add('screen-clicked')

            reactionBody.classList.remove('click-screen')

            dots.textContent = ''
            icon.textContent = '⚡'

            reactionText.textContent = `${reactionTime} ms`

            if (reactionTime < 200) {
                tryAgain.textContent = 'Insane reaction! Click to try again'
            }
            else if (reactionTime < 300) {
                tryAgain.textContent = 'Great reaction! Click to try again'
            }
            else if (reactionTime < 400) {
                tryAgain.textContent = 'Not bad! Click to try again'
            }
            else {
                tryAgain.textContent = 'You sleeping da? 😭 Click to try again'
            }

            return
        }

        if (gameState === 'result') {
            startReactionGame()
        }
    })



//rock paper scissor 

let optionsContainer = document.querySelector('.options-container')  
let resContainer = document.querySelector('.result-container' )  

let choiceText = document.querySelector('.choice') 
let computerText = document.querySelector('.computer-choice') 

let resText = document.querySelector('.rps-result') 

const options = ['Rock' , 'Paper' , 'Scissor']
const optionEmoji = ['✊' , '✋' , '✌️']  

let playAgain = document.querySelector('.play-again') 

optionsContainer.addEventListener('click' , function(){ 
    if(event.target.closest('.option-btn')) {

        let userChoice = Number(event.target.closest('.option-btn').dataset.value ) -1 
        let computerChoice = Math.floor(Math.random() * 3)  
        console.log('user' , userChoice);
        
        
        optionsContainer.classList.add('d-none') 
        resContainer.classList.remove('d-none') 
        choiceText.textContent = optionEmoji[userChoice] 
        computerText.textContent = optionEmoji[computerChoice] 

        if(userChoice === computerChoice) {
            resText.textContent = 'It is a Draw !'
        }
        else if(userChoice == 2 && computerChoice === 0) {
            resText.textContent = 'Computer Won !' 
        }
        else if(userChoice == 0 && computerChoice == 2) {
            resText.textContent = 'You Won 🎉!'
        }
        else if(userChoice > computerChoice) {
            resText.textContent = 'You Won 🎉!'
        }
        else if(userChoice < computerChoice) {
            resText.textContent = 'Computer Won !'
        }

    
        playAgain.addEventListener('click' , function(){
            optionsContainer.classList.remove('d-none')
            resContainer.classList.add('d-none')
 
        })
    }
}) 