async function summaryInit(){
    await init('tabsummary')
    let allTasksCount = document.getElementById('allTasksCount');
    let tasksProgressCount = document.getElementById('tasksProgressCount');
    let tasksAwaitingCount = document.getElementById('tasksAwaitingCount');
    let urgentCount = document.getElementById('urgentCount');
    let urgentDeadlineDate = document.getElementById('urgentDeadlineDate');
    let taskToDoCount = document.getElementById('toDoCount');
    let taskDoneCount = document.getElementById('doneCount');
    let greetingUser = document.getElementById('greetingText');
    let username = document.getElementById('greetingName');
    let today= new Date;


    let progressCount = 0;
    let awaitingCount = 0;
    let prioCount = 0;
    let toDoCount = 0;
    let doneCount = 0;
    let deadlineCount = [];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        upcommingDeadline = (task['deadline']);
        allTasksCount.innerHTML = tasks.length;
        if (task.condit == '1'){
            progressCount += 1;            
        }
        tasksProgressCount.innerHTML = progressCount;
        if (task.condit == '2'){
            awaitingCount += 1;            
        }
        tasksAwaitingCount.innerHTML = awaitingCount;
        if (task.prio == '2'){
            prioCount += 1;
            let dates = new Date(upcommingDeadline)
            /*let pushdates = dates.toLocaleDateString('en-GB', {year:"numeric", month:"long", day:"2-digit"});*/
            deadlineCount.push(dates);                      
        }
        urgentCount.innerHTML = prioCount;
        if (task.condit == '0'){
            toDoCount += 1;            
        }
        taskToDoCount.innerHTML = toDoCount;
        if (task.condit == '3'){
            doneCount += 1;            
        }
        taskDoneCount.innerHTML = doneCount;
    }
    let sortdates = deadlineCount.sort(function(a, b){
        return a - b 
    });
    
    urgentDeadlineDate.innerHTML = deadlineCount[0].toLocaleDateString('en-GB', {year:"numeric", month:"long", day:"2-digit"});
    if (today.getHours() >= 0 && today.getHours() <= 12) {
        greetingUser.innerHTML = 'Good morning';
                
    }
    if (today.getHours() > 12 && today.getHours() <= 18) {
        greetingUser.innerHTML = 'Hey';        
    }
    if (today.getHours() > 18 && today.getHours() <= 24) {
        greetingUser.innerHTML = 'Good evening';     
    }
    if(USER){
        let users = await getItem('users');
        
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let userId = user['id'].toString();            
            if (USER == user['id'].toString()) {
                greetingUser.innerHTML += ',';
                username.innerHTML = user['name'];
            }            
        }
    }    
}