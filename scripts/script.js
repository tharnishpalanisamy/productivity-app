import { getTodayData, getTodayDate, fetchUser , celebrateSession } from "./utilities.js";
import { fetchTasks } from "./todolist.js";

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
    minutes : 30, 
    seconds : 0
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

    let todayData = getTodayData(user) 
    todayData.sessions += 1 
    todayData.focusTime += curVal.minutes + 1  
    todayData.completedTasks = todayData.completedTasks ? todayData.completedTasks : 0 
    localStorage.setItem('user' , JSON.stringify(user)) 
    const sessionCompleteSound = new Audio('./assets/music/pomodoro alaram sound.mp3') 
    // sessionCompleteSound.play()  
    celebrateSession()

    let selectedTask = localStorage.getItem('selectedTask') 
    if (selectedTask) { 

        let data = await fetch(`http://localhost:3000/tasks/${selectedTask}`) 
        let taskData = await data.json()

        taskData.completed = taskData.completed + 1 

        if(taskData.estimate == taskData.completed) {
            completeTask(taskData)
        }

        await fetch(`http://localhost:3000/tasks/${selectedTask}` , {
            method:'PATCH' , 
            headers:{
                'Content-type' : 'application/json'
            } , 
            body:JSON.stringify({completed : taskData.completed  })
        }) 
        await fetchTasks()

    }
    await fetch('http://localhost:3000/users/1' , {
        method:'PATCH' , 
        headers:{
            'Content-type' : 'application/json' 
        } , 
        body: JSON.stringify({
            session: user.session,
            focusTime: user.focusTime,
            streak: user.streak,
            thisMonth: user.thisMonth,
            heatmapData: user.heatmapData
        })
    })

    setdefaultTimer()
}

function setdefaultTimer(){
    if (currentState == 'pomodoro') { 
        timer.innerHTML = '30:00' 
        curVal.minutes = 29 
    }
    else if(currentState == 'shortBreak'){
        curVal.minutes = 4  
        timer.innerHTML = '05:00' 
    }
    else{
        curVal.minutes = 19
        timer.innerHTML = '20:00' 
    }
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

let taskContainer = document.querySelector('.task-container') 
let shortBreakContainer = document.querySelector('.shortBreak-container') 
let longBreakContainer = document.querySelector('.longBreak-container') 

function showSection(section){
    taskContainer.classList.add('d-none') 
    shortBreakContainer.classList.add('d-none') 
    longBreakContainer.classList.add('d-none') 

    section.classList.remove('d-none')
}
showSection(taskContainer)
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

        showSection(taskContainer)
        
        
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
        showSection(shortBreakContainer)
        
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
        showSection(longBreakContainer)
    }
})



