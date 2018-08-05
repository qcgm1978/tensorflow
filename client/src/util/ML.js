/**
 * Implement sevent ML methods
 * @class ML
 */
// import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
window.tf = tf;
import * as math from 'mathjs';
import Plotly from 'plotly.js-geo-dist';
export default class ML {
    constructor(formula) {
        this.formula = formula;
        this.data = []
    }
    /** * Returns a random number between min (inclusive) and max (exclusive) */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    plotly(lines, layout) {
        Plotly.newPlot('graph', lines, layout, {
            displayModeBar: false
        });
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
    // get data() {
    //     return this.data;
    // }
    // set data(data) {
    //     // this.data = data;
    // }
    /**
     * magic TF to give you points between [-1, 1]
     * @param  {int32} points 
     * @return tf.Tensor length is len and range is [-1,1]
     * @memberof ML
     */
    getRandomBetweenRange(len) {
        return tf.randomUniform([len], -1, 1);
    }
    /**
     *  Create an optimizer. This is the thing that does the learning.
     *  👉 you can play if you want to change the rate at which the algorithm is learning
     * @return 
     * @memberof ML
     */
    trainSgdByRate() {
        return tf.train.sgd(this.rate);
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

            // debugger;
            this.calMetricDerivatives(xs, ys);
            // if (iter === this.numIterations - 1) {
            //     this.data.push({ xs, ys })
            // }
            // Use tf.nextFrame to not block the browser.
            await tf.nextFrame();
        }
        return { xs: xs.dataSync(), ys: ys.dataSync() }
    }
}