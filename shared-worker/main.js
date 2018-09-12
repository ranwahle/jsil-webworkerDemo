
document.addEventListener('DOMContentLoaded', () => {

    const fibunatchiIndex = document.querySelector('#fibunatchiIndex');
    function calcWithSharedWorker() {

        const worker = new SharedWorker('shared-worker.js');

        worker.onerror = err => console.error('error on worker', err)
        worker.port.postMessage({index: +fibunatchiIndex.value})
        worker.port.onmessage = message => {
            console.log("message data", message.data)
            if (message.data.index !== undefined) {
                document.querySelector('#stateDiv').textContent = `Calculating : ${message.data.index}`
            } else if (message.data.result !== undefined) {
                document.querySelector('#stateDiv').textContent = `Result : ${message.data.result}`
            } else {
                document.querySelector('#stateDiv').textContent = `Waiting...`

            }
        }
    }


    document.querySelector('#btnCalculate').addEventListener('click', () => {
        calcWithSharedWorker();
    })
})