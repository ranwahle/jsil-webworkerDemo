onmessage = (message) => {
    setTimeout(() => postMessage({...message.data, handled: true}), 1000)
}