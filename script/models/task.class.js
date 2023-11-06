class Task {
    title;
    descr;
    group;
    users = [];
    deadline;
    prio;
    condit;
    subTask = [];

    constructor(title, descr, group, users, deadline, prio, condit, subTask) {
        this.title = title;
        this.descr = descr;
        this.group = group;
        this.users = users;
        this.deadline = deadline;
        this.prio = prio;
        this.condit = condit;
        this.mapSubTask(subTask)
    }

    mapSubTask(subTask) {
        this.subTask = subTask.map(subTask => new SubTask(
            subTask.descr,
            subTask.state,
        ))
    }
}

class SubTask {
    descr;
    state;

    constructor(descr, state) {
        this.descr = descr;
        this.state = state;
    }
}


