onmessage = (message) => {
    const data = message.data;
    if (data.startIndex !== undefined && data.endIndex !== undefined) {
        self.startIndex = data.startIndex;
        self.endIndex = data.endIndex;
        for (let i = self.startIndex; i < self.endIndex; i++) {
            setTimeout(() => {
                self.array[i] = 1;
                if (i === (self.endIndex - 1)) {
                    postMessage({...message.data, handled: true})
                } else {
                }
            }, 1000)
        }
    } else {
        self.array = new Int32Array(data)



    }
}

