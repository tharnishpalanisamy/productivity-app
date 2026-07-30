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

const taskTitle = document.querySelector('.title');
const estimatedSessions = document.querySelector('.pomo-input');

const addTaskButton = document.querySelector('.add-task-button');
const addTaskModal = document.querySelector('.add-task');

const addSessionBtn = document.querySelector('.addSession');
const subtractSessionBtn = document.querySelector('.subtractSession');

const saveBtn = document.querySelector('.save-task-btn');
const cancelBtn = document.querySelector('.cancel-btn');

const tasks = document.querySelector('.tasks');

let allTasks = [];

let currentTask = null;


addTaskButton.addEventListener('click', function () {
    document.querySelector('.edit-task')?.remove();

    addTaskModal.classList.remove('d-none');
    addTaskButton.classList.add('d-none');
});

addSessionBtn.addEventListener('click', function () {
    estimatedSessions.value = Number(estimatedSessions.value) + 1;
});


subtractSessionBtn.addEventListener('click', function () {
    if (Number(estimatedSessions.value) > 1) {
        estimatedSessions.value = Number(estimatedSessions.value) - 1;
    }

});

saveBtn.addEventListener('click', async function () {

    const title = taskTitle.value;
    const estimate = Number(estimatedSessions.value);

    if (!title) {
        alert('Please enter the title of the task!');
        return;
    }

    if (!estimate || estimate < 1) {
        alert('Estimate must be at least 1.');
        return;
    }

    const task = {
        title: title,
        estimate: estimate,
        createdOn: new Date().toISOString(),
        completed:0 ,
        userId: user.id
    };

    try {
        const response = await fetch( 'http://localhost:3000/tasks',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }
        );

        taskTitle.value = '';
        estimatedSessions.value = 1;

        addTaskModal.classList.add('d-none');
        addTaskButton.classList.remove('d-none');

        await fetchTasks();

    } catch (error) {
        console.log(error);
    }

});

cancelBtn.addEventListener('click', function () {

    addTaskModal.classList.add('d-none');
    addTaskButton.classList.remove('d-none');

    taskTitle.value = '';
    estimatedSessions.value = 1;

});

async function fetchTasks() {

    try {
        const response = await fetch(
            'http://localhost:3000/tasks'
        );
        allTasks = await response.json();
        allTasks = allTasks.filter(
            task => String(task.userId) === String(user.id)
        );


        tasks.innerHTML = '';


        if (allTasks.length === 0) {

            tasks.innerHTML = `
                <div class="empty-tasks">
                    <p>No tasks yet</p>
                    <span>
                        Add a task and start focusing.
                    </span>
                </div>
            `
            return
        }


        allTasks.forEach(task => {
            tasks.innerHTML += `
                <div class="task-card" data-id="${task.id}">
                    <div class="task-card-left">
                        <button class="task-check" type="button" >
                            <i class="fa-solid fa-check text-dark"></i>
                        </button>
                        <div class="task-info">
                            <p class="task-title">
                                ${task.title}
                            </p>
                            <p class="task-progress">
                                ${task.completed ? task.estimate : '0'} / ${task.estimate} sessions
                            </p>
                        </div>
                    </div>
                    <button class="task-options editTaskBtn " data-id="${task.id}" type="button">
                        <i class="fa-solid fa-ellipsis-vertical text-dark"></i>
                    </button>
                </div>
            `
        });

    } catch (error) {
        console.log(error);

    }
}

tasks.addEventListener('click', async function (event) {
    const editBtn = event.target.closest('.editTaskBtn');

    if (editBtn) {
        currentTask = editBtn.dataset.id;
        console.log(currentTask);
        const task = allTasks.find(
            task => String(task.id) === String(currentTask)
        );
        document.querySelector('.edit-task')?.remove();
        addTaskModal.classList.add('d-none');
        addTaskButton.classList.remove('d-none');

        const editForm = document.createElement('div');
        editForm.classList.add('add-task','edit-task' );

        editForm.innerHTML = `

            <input type="text" class="title edit-title" value="${task.title}" placeholder="What are you working on?">
            <p class="session-label">
                Estimate sessions
            </p>
            <div class="session-controls">

                <input type="number" class="pomo-input edit-estimate" value="${task.estimate}" min="1">
                <button class="edit-subtract-session" type="button" >
                    −
                </button>
                <button class="edit-add-session" type="button">+</button>
            </div>

            <div class="add-task-footer">
                <div class="edit-task-footer">
                    <button class="delete-task-btn" type="button" >
                        Delete
                    </button>
                    <div class="edit-actions">
                        <button class="cancel-edit-btn" type="button" >
                            Cancel
                        </button>
                        <button class="save-edit-btn" type="button">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        `;
        const taskCard = editBtn.closest('.task-card');
        taskCard.after(editForm); 

        editForm.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

        return;
    }

    const addEditSession = event.target.closest('.edit-add-session');

    if (addEditSession) {
        const editForm = addEditSession.closest('.edit-task');
        const input = editForm.querySelector('.edit-estimate');

        input.value = Number(input.value) + 1;

        return;
    }

    const subtractEditSession = event.target.closest('.edit-subtract-session');

    if (subtractEditSession) {

        const editForm = subtractEditSession.closest('.edit-task');
        const input = editForm.querySelector('.edit-estimate');

        if (Number(input.value) > 1) {
            input.value = Number(input.value) - 1;
        }
        return;
    }
    const cancelEdit = event.target.closest('.cancel-edit-btn');

    if (cancelEdit) {
        cancelEdit.closest('.edit-task').remove();
        currentTask = null;
        return;
    }

    const saveEdit = event.target.closest('.save-edit-btn');
    if (saveEdit) {
        const editForm = saveEdit.closest('.edit-task');
        const title = editForm.querySelector('.edit-title').value 
        const estimate = Number(editForm.querySelector('.edit-estimate').value); 
        if (!title) {
            alert('Please enter the task title!');
            return;
        }
        if (!estimate || estimate < 1) {
            alert('Estimate must be at least 1.');
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3000/tasks/${currentTask}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        title: title,
                        estimate: estimate
                    })
                }
            );
            currentTask = null;
            await fetchTasks();
        } catch (error) {
            console.log(error)
        }
        return;
    }

    const deleteBtn = event.target.closest('.delete-task-btn');
    if (deleteBtn) {
        const shouldDelete = confirm('Are you sure you want to delete this task?'); 
        if (!shouldDelete) {
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3000/tasks/${currentTask}`,
                {
                    method: 'DELETE'
                }
            );
            currentTask = null;
            await fetchTasks();
        } catch (error) {
            console.log(error);
        }
        return
    }
});

fetchTasks();



//selecting task