
let currentState = 'pomodoro'
//timer 
let timer = document.querySelector('.timer') 
let val = 30  
timer.textContent = `${val}:00`
let seconds = 60 
val --
const interval = setInterval(() => {
    seconds--;
    timer.textContent = `${val}:${seconds}`;
    console.log('hi');
    
    console.log(seconds) ; 
    console.log(val);
    
    
    if (seconds === 0) {
        seconds = 60 
        val -- 
    }
    if(val == 0 && seconds == 0) {
        clearInterval(interval)
    } 
}, 1000);



function changeIcon(){
    let favIcon = document.getElementById('favicon')
    if(currentState == 'pomodoro'){
        favIcon.setAttribute('href' , 'assets/favicon/blue.ico')
    }
    else if(currentState == 'shortBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/green.ico')
    }
    else if(currentState == 'shortBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/red.ico')
    }
}