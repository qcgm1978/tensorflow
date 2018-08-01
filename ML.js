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
    /**
     * Generate sevent methods that is defined or executed immediately
     * @param  {array} sevenSteps seven ml step methods to define or execute
     * @return {void}@memberof ML
     */
    generatePattern(sevenSteps) {
        if (sevenSteps.length < 6) {
            throw Error('Not Sevent ML methods')
        } else if (sevenSteps.length === 6) {
            sevenSteps.push({ sevenFeedData: this.tfTrain })
        }
        for (let item of sevenSteps) {
            if (item instanceof Function) {
                item.call(this);
            } else {
                this[Object.keys(item)[0]] = Object.values(item)[0];
            }
        }
    }
    getFeaturesEval(arr, val) {
        const strNoCoeff = arr.reduce((accumulator, item) => {
            return accumulator.replace(this.toLearn, item);
        }
            , this.formula);
        const formulaStr = strNoCoeff.replace(/x/g, `(${val})`);
        return math.eval(formulaStr);
    }

    async tfTrain(xs, ys, numIterations) {
        for (let iter = 0; iter < numIterations; iter++) {
            // Plot where we are at this step.
            // const coeff = {
            //     a: a.dataSync()[0],
            //     b: b.dataSync()[0],
            //     c: c.dataSync()[0],
            //     d: d.dataSync()[0],
            // };
            this.sixthStep(xs, ys);

            // Use tf.nextFrame to not block the browser.
            await tf.nextFrame();
        }
    }
}