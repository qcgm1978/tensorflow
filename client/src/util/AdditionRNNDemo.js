import embed from 'vega-embed';
import CharacterTable from "./CharacterTable";
import { ML } from './ML';
export default class AdditionRNNDemo extends ML {
    constructor(digits, trainingSize, rnnType, layers, hiddenSize) {
        super()
        this.digits = digits;
        this.trainingSize = trainingSize;
        this.layers = layers;
        this.hiddenSize = hiddenSize;
        this.rnnType = rnnType;
        this.chars = '0123456789+ ';
        // Prepare training data.
        this.split = Math.floor(this.trainingSize * 0.9);

        super.generatePattern(this.defineSevenTimeSeries())
    }
    sixth() {
        this.createAndCompileModel(
        );

    }
    fifth() {
        switch (this.rnnType) {
            case 'SimpleRNN':
                this.model.add(tf.layers.simpleRNN({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    returnSequences: true
                }));
                break;
            case 'GRU':
                this.model.add(tf.layers.gru({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    returnSequences: true
                }));
                break;
            case 'LSTM':
                this.model.add(tf.layers.lstm({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    returnSequences: true
                }));
                break;
            default:
                throw new Error(`Unsupported RNN type: '${this.rnnType}'`);
        }
    }
    fourth() {
        this.charTable = new CharacterTable(this.chars);
        console.log('Generating training data');

        this.testData = this.data.slice(this.split);
        [this.trainXs, this.trainYs] =
            convertDataToTensors(this.trainData, this.charTable, this.digits);
        [this.testXs, this.testYs] =
            convertDataToTensors(this.testData, this.charTable, this.digits);
    }
    third() {
        this.trainData = this.data.slice(0, this.split);
    }
    second() {
        this.data = generateData(this.digits, this.trainingSize, false);

    }
    first() {
        this.loss = 'categoricalCrossentropy'
    }
    defineSevenTimeSeries() {
        const sevenSteps = [
            this.first,
            this.second,
            this.third,
            this.fourth,
            { fifth: this.fifth },
            this.sixth,
            //             { sevenFeedData: super.tfTrain }
        ];
        return sevenSteps;
    }
    createAndCompileModel() {
        const vocabularySize = this.chars.length
        const maxLen = this.digits + 1 + this.digits;

        this.model = tf.sequential();
        switch (this.rnnType) {
            case 'SimpleRNN':
                this.model.add(tf.layers.simpleRNN({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    inputShape: [maxLen, vocabularySize]
                }));
                break;
            case 'GRU':
                this.model.add(tf.layers.gru({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    inputShape: [maxLen, vocabularySize]
                }));
                break;
            case 'LSTM':
                this.model.add(tf.layers.lstm({
                    units: this.hiddenSize,
                    recurrentInitializer: 'glorotNormal',
                    inputShape: [maxLen, vocabularySize]
                }));
                break;
            default:
                throw new Error(`Unsupported RNN type: '${rnnType}'`);
        }
        this.model.add(tf.layers.repeatVector({ n: this.digits + 1 }));
        this.fifth();
        this.model.add(tf.layers.timeDistributed(
            { layer: tf.layers.dense({ units: vocabularySize }) }));
        this.model.add(tf.layers.activation({ activation: 'softmax' }));
        this.model.compile({
            loss: this.loss,
            optimizer: 'adam',
            metrics: ['accuracy']
        });
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

