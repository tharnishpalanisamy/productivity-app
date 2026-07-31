const heatmapData = [];

const startDate = new Date(2026, 0, 1);
const today = new Date(2026, 6, 29);

for (
    let date = new Date(startDate);
    date <= today;
    date.setDate(date.getDate() + 1)
) {
    heatmapData.push({
        date: date.toISOString().split("T")[0],
        completedTasks: Math.floor(Math.random() * 9)
    });
}

let user = JSON.parse(localStorage.getItem('user')) || {}; 

async function loadHeapmapData(){
    if(!user.heatmapData) {
        user.heatmapData = heatmapData 
        localStorage.setItem('user' , JSON.stringify(user)) 
        await fetch('http://localhost:3000/users/1' , {
        method:"PATCH" ,
        headers:{
            'Content-type' : 'application/json' 
        } , 
        body:JSON.stringify({heatmapData:user.heatmapData})
    })
    } 

    createHeatMap()
    
}


function createHeatMap(){
    let gridContainer = document.querySelector('.grid-container') 
    gridContainer.innerHTML ='' 
    let dataArr = user.heatmapData.slice(user.heatmapData.length - 210  , )  
    dataArr.forEach(data =>{
        let date = new Date(data.date)
        const fullMonth = date.toLocaleString('default', { month: 'long' }); 
        let contribution = data.completedTasks > 5 ? 'high' : 
        data.completedTasks > 1 ? 'medium' : data.completedTasks == 1 ? 'low' : 'zero' 
        
        gridContainer.innerHTML += `
        <div class = 'block ${contribution }' 
        data-bs-toggle="tooltip" data-bs-html="true" 
        data-bs-title="
        <p class = 'contribution-tooltip'>
            ${data.completedTasks} contributions on ${fullMonth} ${date.getDate()}th
        </p>"
        > </div>
        ` 
    })
}
loadHeapmapData()


console.log(heatmapData);

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')

const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => 
    new bootstrap.Tooltip(tooltipTriggerEl))


const profileImg = document.getElementById('profileImage');
const profileImgInput = document.getElementById('profileImageInput');
const chooseProfileImg = document.querySelector('.smile-logo-container');

const savedImg = localStorage.getItem('profileImg');

if (savedImg) {
    profileImg.src = savedImg;
}

chooseProfileImg.addEventListener('click', () => {
    profileImgInput.click();
});

profileImgInput.addEventListener('change', function () {
    const file = profileImgInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        profileImg.src = reader.result;

        localStorage.setItem('profileImg', reader.result);
    };

    reader.readAsDataURL(file);
});


//save changes 

let saveBtn = document.querySelector('.saveBtn') 

saveBtn.addEventListener('click' , async function(){
    let editName = document.getElementById('name') 
    let editUsername = document.getElementById('username') 
    let mood = document.getElementById('mood') 

    if(!editName.value || !editUsername.value || !mood.value) {
        alert('value cannot be empty') 
        return
    } 
    user = {...user , name:editName.value , username : editUsername.value , mood : mood.value}  

    localStorage.setItem('user' , JSON.stringify(user)) 
    await fetch('http://localhost:3000/users/1', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: user.name,
                username: user.username,
                mood: user.mood
            })
        });
    name.textContent = user.name
    username.textContent = `@${user.username}`

    //close modal 

    let modalElement = document.getElementById('exampleModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()
})


//loading stats card 
let sessionCount = document.querySelector('.sessionCount') 
let focusTime = document.querySelector('.hoursCount')  
let streakCount = document.querySelector('.streakCount') 
let thisMonth = document.querySelector('.thisMonth') 

async function loadStats(){
    let data = await fetch('http://localhost:3000/users/1')  
    user = await data.json() 
    sessionCount.innerHTML = user.session 
    focusTime.innerHTML = `${user.focusTime / 60 } hrs`
    streakCount.innerHTML = user.streak 
    thisMonth.innerHTML = user.thisMonth
}

loadStats()



