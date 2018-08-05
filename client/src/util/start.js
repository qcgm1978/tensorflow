/**
 * fit a curve to a bunch of data
 * @class FitCurveToData
 * @memberOf ML
 */
// import 'babel-polyfill';
import { ML } from './ML';
// import * as tf from '@tensorflow/tfjs';
export default class Start extends ML {

    constructor() {
        super()
        super.generatePattern(this.defineSevenTimeSeries())

    }
    defineSevenTimeSeries() {
        const sevenSteps = [
            this.getFeaturesEval,
            this.iniPredict,
            this.generateTrainTarget,
            this.getCloser,
            this.gengerateOptimizer,
            { calMetricDerivatives: this.calMetricDerivatives },
            // { sevenFeedData: super.tfTrain }

        ];
        return sevenSteps;
    }
    // Use the model to do inference on a data point the model hasn't seen.
    async doALearning() {
        const data = await this.calMetricDerivatives();
        const arr = this.model.predict(tf.tensor2d([20], [1, 1]));
        const val = arr.dataSync()[0];
        // let val = 36;
        if (val < this.training[1] && val > this.training[0]) {
            return val;
        } else {
            throw new Error('algorithm to update');
        }


    }
    getFeaturesEval() {
        // Create a simple model.
        this.model = tf.sequential();
    }
    // Should print approximately 39.
    generateTrainTarget() {
        this.training = [38, 39];
    }
    iniPredict() {
        this.model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    }
    /*
         * Predicts all the y values for all the x values.
         */
    predict(x) {
        const arr = this.iniRandomArr;
        // Calculate a y according to the formula
        return this.tidy(arr, x)
    }

    /*
         * Loss function: how good the prediction is based on what you expected.
         */

    async calMetricDerivatives() {
        // Train the model using the data.
        return await this.model.fit(this.xs, this.ys, { epochs: 250 });
    }

    gengerateOptimizer() {
        // Generate some synthetic data for training. (y = 2x - 1)
        this.xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
        this.ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
    }



    getCloser(xs, ys) {
        // Prepare the model for training: Specify the loss and the optimizer.
        this.model.compile({
            loss: "meanSquaredError",
            optimizer: "sgd"
        });

    }
}