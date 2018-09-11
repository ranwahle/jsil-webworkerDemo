class TasksHandler {

    constructor(numOfTasks, numOfWorkers) {
        this.numOftasks = +numOfTasks;
        this.numOfWorkers = +numOfWorkers;
        if (this.numOfWorkers > this.numOftasks) {
            this.numOfWorkers = this.numOftasks;
        }

    }


    checkTaskEnd(resolve) {
        const unfinishedTasks = this.tasksdArray.filter(item => item === 0)
        if (unfinishedTasks.length === 0) {
            this.end = new Date();
            resolve(this.end - this.start)
        } else {
            console.log('array', this.tasksdArray)
        }
    }

    assignTasks(resolve) {
        const tasksPerWorker = Math.round(this.numOftasks / this.numOfWorkers);
        for (let i = 0; i < this.numOftasks; i += (tasksPerWorker)) {
            this.assignTasksToWorkers(i, i + tasksPerWorker);
            this.handleTasksCompletion(resolve);

        }
    }

    handleTasksCompletion(resolve) {
        this.workers.forEach((workerObj) => {
            workerObj.worker.onmessage = message => {
                workerObj.worker.terminate();
                this.checkTaskEnd(resolve);

            }
        })
    }

    assignTasksToWorkers(startIndex, endIndex) {
        this.workers.forEach((workerObj) => {
            workerObj.worker.postMessage(this.sharedBuffer)
            const taskObj = {startIndex, endIndex};
            workerObj.tasks.push(taskObj);
            workerObj.worker.postMessage(taskObj)
        })
    }

    handleTasks() {
        this.sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * this.numOftasks)
        this.tasksdArray = new Int32Array(this.sharedBuffer)


        for (let i = 0; i < length; i++) this.tasksdArray[i] = 0;


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
    const durationDiv = document.querySelector('#durationDiv');
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


