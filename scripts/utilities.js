//heatmap 
export function getTodayDate(){
    let today = new Date()

    let year = today.getFullYear() 
    let month = today.getMonth() + 1 
    let date = today.getDate() 
    console.log( typeof month);
    
    return `${year}-${month>9 ? month : '0'+month}-${date>9 ? date : '0'+date}`
}

console.log(getTodayDate());

export function getTodayData(){
    let today = getTodayDate() 
    let todayData = user.heatmapData.find(data => data.date === today) 
    if(!todayData){
        todayData = {
            date:today , 
            sessions:0 , 
            focusTime:0 
        }
        user.heatmapData.push(todayData)
    }

    return todayData
}



//getting the user
export async function fetchUser() {
    let data = await fetch('http://localhost:3000/users/1') 
    let user = await data.json() 
    console.log(user);
    
    localStorage.setItem('user' , JSON.stringify(user))
}