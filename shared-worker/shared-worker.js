const state = {};

const SQRT_OF_FIVE  = math.sqrt(5);
const phi = (SQRT_OF_FIVE + 1) / 2;


function calcFibunatcci(index) {
    state.index = index;
    return Math.round((Math.pow(phi, index) - Math.pow((-1) * phi, (-1) * index)) / SQRT_OF_FIVE);

}


self.addEventListener('connect', function (e) {
    const port = e.ports[0];
    port.onmessage = (message) => {

        const fibunatchiIndex = message.data.index;
        if (fibunatchiIndex) {
            state.result = 'Waiting';
            port.postMessage({result: 'waiting'});
            const result = calcFibunatcci(fibunatchiIndex)
            setTimeout(() => {
                state.result = result, 15000
                port.postMessage({result: result});
            });

        } else {
            if (state.index > 0  && !state.result) {
                console.log('message date', message.data)
                port.postMessage({index: state.index});
            } else {
                port.postMessage({result: state.result});
            }
        }
    };

});