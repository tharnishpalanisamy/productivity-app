async function fetchUser() {
    let data = await fetch('http://localhost:3000/users/1') 
    let user = await data.json() 
    console.log(user);
    
    localStorage.setItem('user' , JSON.stringify(user))
}
fetchUser() 
let user = JSON.parse(localStorage.getItem('user')) || {} 
let currentState = 'pomodoro'
//timer 
let timer = document.querySelector('.timer') 
let val = 30  
timer.textContent = `${val}:00`
val --
let interval ; 
let sessionEnded = false 
let curVal = {
    minutes : 29 , 
    seconds : 60
}
function startTimer(minutes , seconds  ){
    
    interval = setInterval(() => {
    seconds--;
    timer.textContent = `${minutes>10?minutes : `0${minutes}`}:${seconds>=10?seconds : '0'+seconds}`;
    console.log('hi');

    if (seconds === 0) {
        seconds = 60 
        minutes -- 
    }
    if(minutes == 0 && seconds == 0) {
        sessionEnded = true 
        clearInterval(interval) 
        sessionCompleted()
        
    } 
    curVal.minutes =  minutes
    curVal.seconds = seconds

}, 1000);

}

function sessionCompleted(){
    user.session = user.session ? user.session + 1 : 1 
    user.focusTime = user.focusTime ? user.focusTime + curVal.minutes + 1 : curVal.minutes + 1 
    user.streak = user.streak ? user.streak + 1 : 1 
    user.thisMonth = user.thisMonth ? user.thisMonth + 1 : 1 
}

function changeIcon(){
    let favIcon = document.getElementById('favicon')
    if(currentState == 'pomodoro'){
        favIcon.setAttribute('href' , 'assets/favicon/blue.ico')
    }
    else if(currentState == 'shortBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/green.ico')
    }
    else if(currentState == 'lonfBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/red.ico')
    }
}

let timerStarted = false 
let btnContainer = document.querySelector('.start-btn-container') 



btnContainer.addEventListener('click' , function(event){
    const button = event.target.closest('.pomodoro-timer-btn') 
    if (button) { 
        console.log('hi');
        
        let text = document.querySelector('.start-text') 
        let spinner = document.querySelector('.start-spinner') 

        if(!timerStarted) {
            startTimer(curVal.minutes , curVal.seconds) 
            timerStarted = true  

            button.disabled = true 
            text.classList.add('d-none') 
            spinner.classList.remove('d-none') 
            
            setTimeout(() => {
                button.disabled = false 
                text.classList.remove('d-none') 
                spinner.classList.add('d-none') 
                text.textContent = 'Stop'
            }, 500);
        }
        else{
            console.log('stopped');
            
            clearInterval(interval)
            timerStarted = false 

            button.disabled = true 
            text.classList.add('d-none') 
            spinner.classList.remove('d-none') 

            setTimeout(() => {
                button.disabled = false 
                text.classList.remove('d-none') 
                spinner.classList.add('d-none') 
                text.textContent = 'Start'
            }, 500);

        }
    }
})