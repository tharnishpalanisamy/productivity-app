import {createheatmapData , fillMissingDays} from './utilities.js'

let user = {}
let heatmapData = [] 
async function loadheatmapData(){
    let data = await fetch('http://localhost:3000/users/1') 
    user = await data.json()  
    heatmapData = user.heatmapData 
    fillMissingDays(heatmapData) 
    if((!user.heatmapData || user.heatmapData.length === 0)) {
        heatmapData = createheatmapData() 
        await fetch('http://localhost:3000/users/1' , {
        method:"PATCH" ,
        headers:{
            'Content-type' : 'application/json' 
        } , 
        body:JSON.stringify(
            {heatmapData:heatmapData}
        )
    })
    } 

    createHeatMap()
    initializeTooltips()
    
}


function createHeatMap(){
    let gridContainer = document.querySelector('.grid-container') 
    gridContainer.innerHTML ='' 
    let dataArr = heatmapData.slice( -210  )  
    dataArr.forEach(data =>{
        let date = new Date(data.date)
        const fullMonth = date.toLocaleString('default', { month: 'long' }); 
        let contribution = data.sessions > 5 ? 'high' : 
        data.sessions > 1 ? 'medium' : data.sessions == 1 ? 'low' : 'zero' 
        
        gridContainer.innerHTML += `
        <div class = 'block ${contribution }' 
        data-bs-toggle="tooltip" data-bs-html="true" 
        data-bs-title="
        <p class = 'contribution-tooltip'>
            ${data.sessions} contributions on ${fullMonth} ${date.getDate()}th
        </p>"
        > </div>
        ` 
    })
}
loadheatmapData()


console.log(heatmapData);

function initializeTooltips() {
    const tooltipTriggerList =
        document.querySelectorAll('[data-bs-toggle="tooltip"]');

    [...tooltipTriggerList].forEach(element => {
        new bootstrap.Tooltip(element);
    });
}

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
    focusTime.innerHTML = `${Math.round(Number(user.focusTime / 60).toFixed(1))  } hrs`
    streakCount.innerHTML = user.streak 
    thisMonth.innerHTML = user.thisMonth
}

loadStats()



