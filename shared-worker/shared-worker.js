const SQRT_OF_FIVE = Math.sqrt(5);
const phi = (SQRT_OF_FIVE + 1) / 2;

let state = {};
function calcFibunatcci(index) {
    return Math.round((Math.pow(phi, index) - Math.pow((-1) * phi, (-1) * index)) / SQRT_OF_FIVE);

}

ports = [];

self.addEventListener('connect', (e) => {

    const port = e.ports[0];
    ports.push(port)
    console.log('connect')
    port.onmessage = (message) => {
        port.postMessage({...self.state});
        const fibunatchiIndex = message.data.index;
        if (fibunatchiIndex) {
            state.result = 'Waiting';
            port.postMessage({result: 'waiting'});
            const result = calcFibunatcci(fibunatchiIndex)
            state.result = result;
            setTimeout(() => {
                ports.forEach(tempPort => tempPort.postMessage({result: result}))
                port.postMessage({result: result});

            }, 5000);

        } else {
        //    port.postMessage({...self.state});

        }
    };

});