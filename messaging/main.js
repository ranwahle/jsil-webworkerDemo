class TasksHandler {

    constructor(numOfTasks, numOfWorkers) {
        this.numOftasks = numOfTasks;
        this.numOfWorkers = numOfWorkers;
        if (this.numOfWorkers > this.numOftasks) {
            this.numOfWorkers = this.numOftasks;
        }

    }



    checkTaskEnd(resolve) {
        const unterminatedWorkers = this.workers.filter(workerObj => workerObj.state !== 'terminated');
        if (unterminatedWorkers.length === 0) {
            this.end = new Date();
            resolve(this.end - this.start)
        }
    }
    assignTasks(resolve) {
        const tasksPerWorker = Math.round(this.numOftasks / this.numOfWorkers);
        for (let i = 0; i < tasksPerWorker; i++) {
            this.assignTasksToWorkers(i);
            this.handleTasksCompletion(resolve);

        }
    }

    handleTasksCompletion(resolve) {
        this.workers.forEach((workerObj) => {
            workerObj.worker.onmessage = message => {
                const data = message.data;
                if (data && data.handled) {
                    const handledTask = workerObj.tasks.find(task => task.taskNumber === data.taskNumber);
                    if (handledTask) {
                        handledTask.handled = true;
                        const unfinishedTasks = workerObj.tasks.filter(task => !task.handled);
                        if (unfinishedTasks.length === 0) {
                            console.log('Worker terminated')
                            workerObj.worker.terminate();
                            workerObj.state = 'terminated';
                            this.checkTaskEnd(resolve);
                        }
                    }
                }
            }
        })
    }

    assignTasksToWorkers(i) {
        this.workers.forEach((workerObj) => {
            const taskObj = {taskNumber: i};
            workerObj.tasks.push(taskObj);
            workerObj.worker.postMessage(taskObj)
        })
    }

    handleTasks() {
        return new Promise((resolve, reject) => {
            this.start = new Date();
            if (!this.numOfWorkers) {
                console.error('Workers are not set')
                return;
            }
            if (!window.Worker) {
                console.error('Browser does not support workers')
            }
            this.workers = [];
            for (let i = 0; i < this.numOfWorkers; i++) {
                this.workers.push({id: i, worker: new Worker('tasks-handler.js'), tasks: []})
            }

            this.assignTasks(resolve)
        });

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const numOfTasks = document.querySelector('#numOfTasks');
    const numOfWorkers = document.querySelector('#numOfWorkers');
    const btnHandleTasks = document.querySelector('#btnHandleTasks');
    const durationDiv =  document.querySelector('#durationDiv');
    btnHandleTasks.addEventListener('click', () => {
            const tasksHandler = new TasksHandler(numOfTasks.value, numOfWorkers.value);
            durationDiv.textContent = 'Wait...';
            tasksHandler.handleTasks().then(res => {
                console.log('duration', res)
              durationDiv.textContent = `Duration: ${res} ms`
            });
        }
    )
})


