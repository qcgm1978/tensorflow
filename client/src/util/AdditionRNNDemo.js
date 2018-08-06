import embed from 'vega-embed';
import CharacterTable from "./CharacterTable";
export default class AdditionRNNDemo {
    constructor(digits, trainingSize, rnnType, layers, hiddenSize) {
        // Prepare training data.
        const chars = '0123456789+ ';
        this.charTable = new CharacterTable(chars);
        console.log('Generating training data');
        const data = generateData(digits, trainingSize, false);
        const split = Math.floor(trainingSize * 0.9);
        this.trainData = data.slice(0, split);
        this.testData = data.slice(split);
        [this.trainXs, this.trainYs] =
            convertDataToTensors(this.trainData, this.charTable, digits);
        [this.testXs, this.testYs] =
            convertDataToTensors(this.testData, this.charTable, digits);
        this.model = createAndCompileModel(
            layers, hiddenSize, rnnType, digits, chars.length);
    }

    async train(iterations, batchSize, numTestExamples) {
        const lossValues = [];
        const accuracyValues = [];
        const examplesPerSecValues = [];
        for (let i = 0; i < iterations; ++i) {
            const beginMs = performance.now();
            const history = await this.model.fit(this.trainXs, this.trainYs, {
                epochs: 1,
                batchSize,
                validationData: [this.testXs, this.testYs],
            });
            const elapsedMs = performance.now() - beginMs;
            const examplesPerSec = this.testXs.shape[0] / (elapsedMs / 1000);
            const trainLoss = history.history['loss'][0];
            const trainAccuracy = history.history['acc'][0];
            const valLoss = history.history['val_loss'][0];
            const valAccuracy = history.history['val_acc'][0];
            document.getElementById('trainStatus').textContent =
                `Iteration ${i}: train loss = ${trainLoss.toFixed(6)}; ` +
                `train accuracy = ${trainAccuracy.toFixed(6)}; ` +
                `validation loss = ${valLoss.toFixed(6)}; ` +
                `validation accuracy = ${valAccuracy.toFixed(6)} ` +
                `(${examplesPerSec.toFixed(1)} examples/s)`;

            lossValues.push({ 'epoch': i, 'loss': trainLoss, 'set': 'train' });
            lossValues.push({ 'epoch': i, 'loss': valLoss, 'set': 'validation' });
            embed(
                '#lossCanvas', {
                    '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                    'data': { 'values': lossValues },
                    'mark': 'line',
                    'encoding': {
                        'x': { 'field': 'epoch', 'type': 'ordinal' },
                        'y': { 'field': 'loss', 'type': 'quantitative' },
                        'color': { 'field': 'set', 'type': 'nominal' },
                    },
                    'width': 400,
                },
                {});
            accuracyValues.push(
                { 'epoch': i, 'accuracy': trainAccuracy, 'set': 'train' });
            accuracyValues.push(
                { 'epoch': i, 'accuracy': valAccuracy, 'set': 'validation' });
            embed(
                '#accuracyCanvas', {
                    '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                    'data': { 'values': accuracyValues },
                    'mark': 'line',
                    'encoding': {
                        'x': { 'field': 'epoch', 'type': 'ordinal' },
                        'y': { 'field': 'accuracy', 'type': 'quantitative' },
                        'color': { 'field': 'set', 'type': 'nominal' },
                    },
                    'width': 400,
                },
                {});
            examplesPerSecValues.push({ 'epoch': i, 'examples/s': examplesPerSec });
            embed(
                '#examplesPerSecCanvas', {
                    '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                    'data': { 'values': examplesPerSecValues },
                    'mark': 'line',
                    'encoding': {
                        'x': { 'field': 'epoch', 'type': 'ordinal' },
                        'y': { 'field': 'examples/s', 'type': 'quantitative' },
                    },
                    'width': 400,
                },
                {});

            if (this.testXsForDisplay == null ||
                this.testXsForDisplay.shape[0] !== numTestExamples) {
                if (this.textXsForDisplay) {
                    this.textXsForDisplay.dispose();
                }
                this.testXsForDisplay = this.testXs.slice(
                    [0, 0, 0],
                    [numTestExamples, this.testXs.shape[1], this.testXs.shape[2]]);
            }

            const examples = [];
            const isCorrect = [];
            tf.tidy(() => {
                const predictOut = this.model.predict(this.testXsForDisplay);
                for (let k = 0; k < numTestExamples; ++k) {
                    const scores =
                        predictOut
                            .slice(
                                [k, 0, 0], [1, predictOut.shape[1], predictOut.shape[2]])
                            .as2D(predictOut.shape[1], predictOut.shape[2]);
                    const decoded = this.charTable.decode(scores);
                    examples.push(this.testData[k][0] + ' = ' + decoded);
                    isCorrect.push(this.testData[k][1].trim() === decoded.trim());
                }
            });

            const examplesDiv = document.getElementById('testExamples');
            while (examplesDiv.firstChild) {
                examplesDiv.removeChild(examplesDiv.firstChild);
            }
            for (let i = 0; i < examples.length; ++i) {
                const exampleDiv = document.createElement('div');
                exampleDiv.textContent = examples[i];
                exampleDiv.className = isCorrect[i] ? 'answer-correct' : 'answer-wrong';
                examplesDiv.appendChild(exampleDiv);
            }

            await tf.nextFrame();
        }
    }
}
function generateData(digits, numExamples, invert) {
    const digitArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const arraySize = digitArray.length;

    const output = [];
    const maxLen = digits + 1 + digits;

    const f = () => {
        let str = '';
        while (str.length < digits) {
            const index = Math.floor(Math.random() * arraySize);
            str += digitArray[index];
        }
        return Number.parseInt(str);
    };

    const seen = new Set();
    while (output.length < numExamples) {
        const a = f();
        const b = f();
        const sorted = b > a ? [a, b] : [b, a];
        const key = sorted[0] + '`' + sorted[1];
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        // Pad the data with spaces such that it is always maxLen.
        const q = `${a}+${b}`;
        const query = q + ' '.repeat(maxLen - q.length);
        let ans = (a + b).toString();
        // Answer can be of maximum size `digits + 1`.
        ans += ' '.repeat(digits + 1 - ans.length);

        if (invert) {
            throw new Error('invert is not implemented yet');
        }
        output.push([query, ans]);
    }
    return output;
}

function convertDataToTensors(data, charTable, digits) {
    const maxLen = digits + 1 + digits;
    const questions = data.map(datum => datum[0]);
    const answers = data.map(datum => datum[1]);
    return [
        charTable.encodeBatch(questions, maxLen),
        charTable.encodeBatch(answers, digits + 1),
    ];
}

function createAndCompileModel(
    layers, hiddenSize, rnnType, digits, vocabularySize) {
    const maxLen = digits + 1 + digits;

    const model = tf.sequential();
    switch (rnnType) {
        case 'SimpleRNN':
            model.add(tf.layers.simpleRNN({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                inputShape: [maxLen, vocabularySize]
            }));
            break;
        case 'GRU':
            model.add(tf.layers.gru({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                inputShape: [maxLen, vocabularySize]
            }));
            break;
        case 'LSTM':
            model.add(tf.layers.lstm({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                inputShape: [maxLen, vocabularySize]
            }));
            break;
        default:
            throw new Error(`Unsupported RNN type: '${rnnType}'`);
    }
    model.add(tf.layers.repeatVector({ n: digits + 1 }));
    switch (rnnType) {
        case 'SimpleRNN':
            model.add(tf.layers.simpleRNN({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                returnSequences: true
            }));
            break;
        case 'GRU':
            model.add(tf.layers.gru({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                returnSequences: true
            }));
            break;
        case 'LSTM':
            model.add(tf.layers.lstm({
                units: hiddenSize,
                recurrentInitializer: 'glorotNormal',
                returnSequences: true
            }));
            break;
        default:
            throw new Error(`Unsupported RNN type: '${rnnType}'`);
    }
    model.add(tf.layers.timeDistributed(
        { layer: tf.layers.dense({ units: vocabularySize }) }));
    model.add(tf.layers.activation({ activation: 'softmax' }));
    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy']
    });
    return model;
}