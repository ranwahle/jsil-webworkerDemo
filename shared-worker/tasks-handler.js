onmessage = (message) => {

    const worker = new SharedWorker('shered-worker.js');
    setTimeout(() => postMessage({...message.data, handled: true}), 1000)
}