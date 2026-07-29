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

function createHeatMap(){
    let gridContainer = document.querySelector('.grid-container') 
    gridContainer.innerHTML =''
    heatmapData.forEach(data =>{
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
createHeatMap()


console.log(heatmapData);

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')

const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => 
    new bootstrap.Tooltip(tooltipTriggerEl))





const profileImg = document.getElementById('profileImage');
const profileImgInput = document.getElementById('profileImageInput');
const chooseProfileImg = document.querySelector('.smile-logo-container');

let user = JSON.parse(localStorage.getItem('user')) || {};

if (user.img) {
    profileImg.src = user.img;
}

let name = document.querySelector('.profile-name') 
name.textContent = user.name || 'Tharnish' 
document.getElementById('name').value = name.textContent
let username = document.querySelector('.profile-username') 
username.textContent = `@${user.username || 'tharnishpalanisamy'}`
document.getElementById('username').value = username.textContent.slice(1,)
chooseProfileImg.addEventListener('click', () => {
    profileImgInput.click();
});

profileImgInput.addEventListener('change', () => {
    const file = profileImgInput.files[0];

    if (!file){
        return
    }

    const reader = new FileReader()

    reader.onload = () => {
        profileImg.src = reader.result
        user.img = reader.result
        localStorage.setItem('user', JSON.stringify(user))
    };

    reader.readAsDataURL(file)
}); 


//save changes 

let saveBtn = document.querySelector('.saveBtn') 

saveBtn.addEventListener('click' , function(){
    let editName = document.getElementById('name') 
    let editUsername = document.getElementById('username') 
    let mood = document.getElementById('mood') 

    if(!editName.value || !editUsername.value || !mood.value) {
        alert('value cannot be empty') 
        return
    } 
    user = {...user , name:editName.value , username : editUsername.value , mood : mood.value}  
    localStorage.setItem('user' , JSON.stringify(user)) 

    name.textContent = user.name
    username.textContent = `@${user.username}`

    //close modal 

    let modalElement = document.getElementById('exampleModal') 
    let modal = bootstrap.Modal.getInstance(modalElement) 
    modal.hide()
})