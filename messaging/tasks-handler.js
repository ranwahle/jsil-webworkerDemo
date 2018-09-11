onmessage = (message) => {

    for (let i = 0; i < 1000; i++) {

    }
    postMessage({...message.data, handled: true})

    //setTimeout(() => postMessage({...message.data, handled: true}), 1000)
}