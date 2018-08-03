/**
 * Implement sevent ML methods
 * @class ML
 */
// import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
import * as math from 'mathjs'
export default class ML {
    constructor(formula) {
        this.formula = formula;

    }
    /** * Returns a random number between min (inclusive) and max (exclusive) */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    getArray(arr) {
        return arr.map(item => item.dataSync()[0])
    }
    iniRandom(len) {
        const arr = []
        for (let i = 0; i < len; i++) {
            arr.push(tf.variable(tf.scalar(Math.random())));
        }
        return arr;
    }
    getRandomBetweenRange(points) {
        return tf.randomUniform([points], -1, 1);
    }
    trainSgdByRate(learningRate) {
        return tf.train.sgd(learningRate);
    }
    /**
 * Generate sevent methods that is defined or executed immediately
 * @param  {array} sevenSteps seven ml step methods to define or execute
 * @return {void}@memberof ML
 */
    generatePattern(sevenSteps) {
        if (sevenSteps.length < 6) {
            throw Error('Not Sevent ML methods')
        } else if (sevenSteps.length === 6) {
            sevenSteps.push({ sevenFeedData: this.sevenFeedData })
        }
        for (let item of sevenSteps) {
            if (item instanceof Function) {
                item.call(this);
            } else {
                this[Object.keys(item)[0]] = Object.values(item)[0];
            }
        }
    }
    tidy(arr, x) {
        const str = this.formula;
        return tf.tidy(() => {
            // const result = arr[0]
            //     .mul(x.pow(tf.scalar(3, 'int32')))
            //     .add(arr[1].mul(x.square()))
            //     .add(arr[2].mul(x))
            //     .add(arr[3]);

            // arr[0].mul(val.pow(tf.scalar(3, "int32"))).add(arr[1].mul(val.pow(tf.scalar(2, "int32")))).add(arr[2].mul(val.pow(tf.scalar(1, "int32")))).add(arr[3])

            const result = this.getFeaturesMatrics(arr, x);
            return result;
        });
    }
    getFeaturesMatrics(arr, val) {
        const strNoCoeff = arr.reduce((accumulator, item, index) => {
            return accumulator.replace(this.toLearn, `arr[${index}]`);
        }
            , this.formula);
        let formulaStr = ''
        try {

            formulaStr = strNoCoeff.replace(/\*x(\^(\d))?/g, (match, p1, p2) => {
                return `.mul(val.pow(tf.scalar(${p2 ? p2 : 1},"int32")))`;
            }).replace(/\+([^+]+)/g, '.add($1)');
        } catch (e) {
            debugger;
        }
        return eval(formulaStr);
    }
    getFeaturesEval(arr, val) {
        const strNoCoeff = arr.reduce((accumulator, item) => {
            return accumulator.replace(this.toLearn, item);
        }
            , this.formula);
        const formulaStr = strNoCoeff.replace(/x/g, `(${val})`);
        return math.eval(formulaStr);
    }
    tensor1d(values) {
        return tf.tensor1d(values);
    }
    async sevenFeedData(xs, ys) {
        for (let iter = 0; iter < this.numIterations; iter++) {
            // Plot where we are at this step.
            // const coeff = {
            //     a: a.dataSync()[0],
            //     b: b.dataSync()[0],
            //     c: c.dataSync()[0],
            //     d: d.dataSync()[0],
            // };
            this.calMetricDerivatives(xs, ys);

            // Use tf.nextFrame to not block the browser.
            await tf.nextFrame();
        }
    }
}