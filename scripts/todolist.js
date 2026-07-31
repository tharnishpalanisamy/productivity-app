import { getTodayData, getTodayDate, fetchUser } from "./utilities.js";
fetchUser() 

let user = JSON.parse(localStorage.getItem('user')) || {}

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
        status:'pending',
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

export async function fetchTasks() {

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
                <div class="task-card ${task.status == 'completed' ? 'selected' :''}"
                 data-id="${task.id}" data-status=${task.status} 
                >
                    <div class="task-card-left">
                        <button class="task-check completeTask ${task.status == 'completed' ? 'btnSelected' :''}"
                         data-id=${task.id} data-status=${task.status} type="button"  >
                            <i class="fa-solid fa-check text-dark tick 
                            ${task.status == 'completed' ? 'fs-5 bg-none btnSelected' :''}" 
                            ></i>
                        </button>
                        <div class="task-info">
                            <p class="task-title ${task.status == 'completed' ? 'strike' :''}">
                                ${task.title}
                            </p>
                            <p class="task-progress ${task.status == 'completed' ? 'strike' :''}">
                                ${task.completed ? task.completed : '0'} / ${task.estimate} sessions
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
        Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this task!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
        if (result.isConfirmed) 
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
            
            Swal.fire({
            title: "Deleted!",
            text: "Your Task has been deleted.",
            icon: "success"
        });
        });
        
        return
    }
});

fetchTasks();




//completed Task
let selectedTask
tasks.addEventListener('click' , async  function(event){
    if(event.target.closest('.completeTask')) {

        selectedTask = event.target.closest('.completeTask').dataset.id  
        let selectedBtn = event.target.closest('.completeTask') 
        let selectedIcon = selectedBtn.querySelector('.tick')
        let selectedTaskCard = event.target.closest('.task-card')

        let selectedTitle = selectedTaskCard.querySelector('.task-title') 
        let selectedProgress = selectedTaskCard.querySelector('.task-progress')
        let allTaskCards = document.querySelectorAll('.task-card') 

        let data = await fetch('http://localhost:3000/users/1') 
        let user = await data.json() 
        let todayData = getTodayData(user) 

        if (selectedBtn.dataset.status === 'completed') {

            selectedTaskCard.classList.remove('selected')
            selectedBtn.classList.remove('btnSelected')

            selectedIcon.classList.remove('btnSelected','bg-none','fs-5')
            selectedIcon.classList.add('text-dark')

            selectedTitle.classList.remove('strike')
            selectedProgress.classList.remove('strike')

            selectedBtn.dataset.status = 'pending'

            user.completedTasks = Math.max(0, user.completedTasks - 1)
            todayData.completedTasks = Math.max(0, todayData.completedTasks - 1)

            await fetch(`http://localhost:3000/tasks/${selectedTask}`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ status: 'pending' })
            })
    } 
    else {

        selectedTaskCard.classList.add('selected')
        selectedBtn.classList.add('btnSelected')
        selectedBtn.dataset.status = 'completed'

        selectedIcon.classList.add('btnSelected','bg-none','fs-5')
        selectedIcon.classList.remove('text-dark')

        selectedTitle.classList.add('strike')
        selectedProgress.classList.add('strike')

        user.completedTasks = (user.completedTasks || 0) + 1
        todayData.completedTasks = (todayData.completedTasks || 0) + 1

        await fetch(`http://localhost:3000/tasks/${selectedTask}`, {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        })
    }

    await fetch('http://localhost:3000/users/1', {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            completedTasks: user.completedTasks,
            heatmapData: user.heatmapData
        })
    })
        // tasks.appendChild(selectedTaskCard)
        
    }
})

//selecting specific task 
let selectedTaskForSession 
tasks.addEventListener('click' , function(event){

    if(event.target.closest('.task-card')) { 
        console.log( 'namma' , event.target);
        
        selectedTaskForSession = event.target.closest('.task-card').dataset.id
        let taskCard = event.target.closest('.task-card') 
        tasks.querySelectorAll('.task-card').forEach(task=>{
            task.classList.remove('task-selected')
        })
        taskCard.classList.add('task-selected') 
        localStorage.setItem('selectedTask' , selectedTaskForSession)
        
    }
})


function completeTask(taskData) {
    tasks.querySelectorAll('.task-card').forEach(task =>{
        if(task.dataset.id == taskData.id) {
            task.classList.add('selected') 
        }
})
}