onmessage = (message) => {
    console.log('message', message);
    postMessage({...message.data, handled: true})
}