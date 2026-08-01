//heatmap 
export function getTodayDate(){
    let today = new Date()

    let year = today.getFullYear() 
    let month = today.getMonth() + 1 
    let date = today.getDate() 
    console.log( typeof month);
    
    return `${year}-${month>9 ? month : '0'+month}-${date>9 ? date : '0'+date}`
}


export function getTodayData(user) {
    const today = getTodayDate();

    let todayData = user.heatmapData.find(
        data => data.date === today
    );
    if (!todayData) {
        todayData = {
            date: today,
            sessions: 0,
            focusTime: 0
        };
        user.heatmapData.push(todayData);
    }

    return todayData;
}



//getting the user
export async function fetchUser() {
    let data = await fetch('http://localhost:3000/users/1') 
    let user = await data.json() 
    console.log(user);
    
    localStorage.setItem('user' , JSON.stringify(user))
}




//dummy heapmap data
export function createheatmapData(){
    const heatmapData = [];
    const startDate = new Date(2026, 0, 1);
    const today = new Date();

    for (
        let date = new Date(startDate);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {
        heatmapData.push({
            date: date.toISOString().split("T")[0],
            completedTasks: Math.floor(Math.random() * 9) ,
            sessions : Math.floor(Math.random() * 8) , 
            focusTime : Math.floor(Math.random() * 100) , 
        });
    }
}


export function celebrateSession() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: {
            y: 0.6
        }
    })
}



export function fillMissingDays(heatmapData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(heatmapData[heatmapData.length - 1].date);
    lastDate.setHours(0, 0, 0, 0);

    // Start from the next day after the last saved date
    lastDate.setDate(lastDate.getDate() + 1);

    while (lastDate <= today) {
        heatmapData.push({
            date: lastDate.toISOString(),
            sessions: 0
        });

        lastDate.setDate(lastDate.getDate() + 1);
    }
}