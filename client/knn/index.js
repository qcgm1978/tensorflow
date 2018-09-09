const webcamElement = document.getElementById('webcam');
let net;
const classifier = knnClassifier.create();

async function app() {
    // Load the model.
    net = await mobilenet.load();

    await setupWebcam();
    const arr = []
    let isChanged = false;
    while (true) {
        const result = await net.classify(webcamElement);
        const className = result[0].className;
        const currentNames = className.split(',').map(item => item.trim()).reduce((accumulator, item) => {
            if (!arr.includes(item)) {
                arr.push(item);
                accumulator.push(item)
                isChanged = true;
            }
            return accumulator;
        }, []);
        if (isChanged) {
            console.log(currentNames);
            isChanged = false;
        }

        document.getElementById('console').innerText = `
      prediction: ${className}\n
      probability: ${result[0].probability}
    `;

        // Give some breathing room by waiting for the next animation frame to
        // fire.
        await tf.nextFrame();
    }
}
translate('Hello world', { to: 'Chinese', engine: 'google', key: 'YOUR-KEY-HERE' }).then(text => {
    console.log(text);  // Hola mundo
});
async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener('loadeddata', () => resolve(), false);
                },
                error => reject());
        } else {
            reject();
        }
    });
}
app();