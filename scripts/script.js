import { getTodayData, getTodayDate, fetchUser } from "./utilities.js";

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
    minutes : 0, 
    seconds : 6
}
function startTimer(minutes , seconds  ){
    
    interval = setInterval(() => {
    seconds--;
    timer.textContent = `${minutes>10?minutes : `0${minutes}`}:${seconds>=10?seconds : '0'+seconds}`;
    console.log('hi');

    if(minutes == 0 && seconds == 0) {
        sessionEnded = true 
        stopTimer() 
        sessionCompleted()
        
    } 
    if (seconds === 0) {
        seconds = 60 
        minutes -- 
    }

    curVal.minutes =  minutes
    curVal.seconds = seconds

}, 1000);

}

async function sessionCompleted(){
    user.session = user.session ? user.session + 1 : 1 
    user.focusTime = user.focusTime ? user.focusTime + curVal.minutes + 1 : curVal.minutes + 1 
    user.streak = user.streak ? user.streak + 1 : 1 
    user.thisMonth = user.thisMonth ? user.thisMonth + 1 : 1  

    let todayData = getTodayData() 
    todayData.sessions += 1 
    todayData.focusTime += curVal.minutes + 1 
    localStorage.setItem('user' , JSON.stringify(user)) 

    await fetch('http://localhost:3000/users/1' , {
        method:'PATCH' , 
        headers:{
            'Content-type' : 'application/json' 
        } , 
        body:JSON.stringify({heatmapData:user.heatmapData})
    })
}


let timerStarted = false 
let btnContainer = document.querySelector('.start-btn-container') 

const startBtn = document.querySelector('.pomodoro-timer-btn');
const startText = document.querySelector('.start-text');
const startSpinner = document.querySelector('.start-spinner');

function stopTimer(){
    console.log('stopped');
    
    clearInterval(interval)
    timerStarted = false 

    startBtn.disabled = true 
    startText.classList.add('d-none') 
    startSpinner.classList.remove('d-none') 

    setTimeout(() => {
        startBtn.disabled = false 
        startText.classList.remove('d-none') 
        startSpinner.classList.add('d-none') 
        startText.textContent = 'Start'
    }, 200);
}


function toggleTimer(){ 
    if (timerStarted) {
        stopTimer()
    }
    else{
        startTimer(curVal.minutes , curVal.seconds) 
            timerStarted = true  
            startBtn.disabled = true 
            startText.classList.add('d-none') 
            startSpinner.classList.remove('d-none') 
            
            setTimeout(() => {
                startBtn.disabled = false 
                startText.classList.remove('d-none') 
                startSpinner.classList.add('d-none') 
                startText.textContent = 'Pause'
            }, 500);
    }

}

btnContainer.addEventListener('click' , function(event){
    
    if (event.target.closest('.pomodoro-timer-btn')) { 
        toggleTimer()
    }
})


//sections (pomo , short , long) 

function changeIcon(value){
    let favIcon = document.getElementById('favicon')
    let pomodoro = document.querySelector('.pomodoro') 

    if(value == 'pomodoro'){
        favIcon.setAttribute('href' , 'assets/favicon/blue.ico')
        pomodoro.classList.remove('longBreak')
        pomodoro.classList.remove('shortBreak') 
        document.title = 'Time to focus!'
    }
    else if(value == 'shortBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/green.ico') 
        pomodoro.classList.remove('longBreak')
        pomodoro.classList.add(value)
        document.title = 'Time for a break!'
    }
    else if(value == 'longBreak') {
        favIcon.setAttribute('href' , 'assets/favicon/red.ico')
        pomodoro.classList.remove('shortBreak')
        pomodoro.classList.add(value)
    }
}



function activeButton(value){
    buttons.forEach(button=>{
            if(button.classList.contains(value) ) {
                button.classList.add('active') 
            }
            else{
                button.classList.remove('active')
            }
        })
    if (value == 'pomodoro-btn'){
        changeIcon('pomodoro') 
    }
    else if(value == 'shortBreak-btn') {
        changeIcon('shortBreak')
    }
    else{
        changeIcon('longBreak')
    }
}

let sectionContainer = document.querySelector('.btn-container') 

let buttons = document.querySelectorAll('.pomo-btn')
sectionContainer.addEventListener('click' , function(event){
    if (event.target.classList.contains('pomodoro-btn') ) { 
        if(timerStarted){
            stopTimer()
        }
        curVal.minutes = 30 
        curVal.seconds = 60 
        timer.textContent = `${curVal.minutes}:00`
        curVal.minutes -- 
        activeButton('pomodoro-btn')  
        startBtn.classList.remove('startShortBreak')
        startBtn.classList.remove('startLongBreak') 
        
        
    }
    else if(event.target.classList.contains('shortBreak-btn')) {
        if(timerStarted){
            stopTimer()
        } 
        curVal.minutes = 5 
        curVal.seconds = 60
        activeButton('shortBreak-btn')
        timer.textContent = `0${curVal.minutes}:00`
        curVal.minutes -- 
        startBtn.classList.add('startShortBreak')
        startBtn.classList.remove('startLongBreak')
        
    }
    else if(event.target.classList.contains('longBreak-btn')) {
        if(timerStarted){
            stopTimer()
        }
        curVal.minutes = 20 
        curVal.seconds = 60
        timer.textContent = `${curVal.minutes}:00`
        curVal.minutes -- 
        activeButton('longBreak-btn')
        startBtn.classList.remove('startShortBreak')
        startBtn.classList.add('startLongBreak')
    }
})


