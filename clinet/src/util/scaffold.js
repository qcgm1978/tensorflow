/**
 * fit a curve to a bunch of data
 * @class FitCurveToData
 * @memberOf ML
 */
// import 'babel-polyfill';
import ML from './ML';
// import * as tf from '@tensorflow/tfjs';
export default class FitCurveToData extends ML {
    /**
     * Implement ML ini, plot and learn
     * @param {object} obj is an object
     * @param  {string} obj.formula the secret formula, parsed by math.js
     * @param  {string} obj.toLearn the coefficients of the formula
     * @param {float} obj.rate  How fast we are learning.
     * @param  {array} obj.coefs initial coef data set
     * @param {number} obj.numIterations How many passes through the data we're doing.
     * @param {number} obj.NUM_POINTS Home many tf.Tensor generated between [-1, 1]
     * @memberof ML
     */
    constructor({ formula, toLearn, rate, coefs = [], NUM_POINTS = 100, numIterations = 75 }) {
        super(formula)
        this.toLearn = toLearn;
        this.rate = rate;
        this.NUM_POINTS = NUM_POINTS;
        this.numIterations = numIterations;
        var arr = this.getTolearnNum(formula, toLearn);
        this.def = this.getDef(arr, coefs);
        super.generatePattern(this.defineSevenTimeSeries())

        this.plot()
    }
    defineSevenTimeSeries() {
        const sevenSteps = [
            { figureOutFeatures: super.getFeaturesEval },
            this.iniPredict,
            this.generateTrainTarget,
            {
                getCloser: this.getCloser
            },
            this.gengerateOptimizer,
            { calMetricDerivatives: this.calMetricDerivatives },
            //             { sevenFeedData: super.tfTrain }
        ];
        return sevenSteps;
    }

    getDef(arr, def) {
        let arrIniCoffies = [];
        if (arr.length === def.length) {
            arrIniCoffies = def;
        } else if (arr.length < def.length) {
            arrIniCoffies = def.slice(0, arr.length);
        } else {
            const arrCoffies = new Array(arr.length - def.length);
            const arrInit = arrCoffies.fill(0).map(item => ML.getRandomArbitrary(-1, 1));
            arrIniCoffies = def.concat(arrInit);
        }
        return arrIniCoffies;
    }



    generateTrainTarget() {
        this.training = this.generateData(this.def)
    }
    plot() {
        const trace1 = {
            x: this.training.x,
            y: this.training.y,
            mode: 'lines+markers',
            name: 'Training',
            marker: {
                size: 12,
                color: '#29B6F6'
            }
        };

        const trace2 = {
            x: this.prediction.x,
            y: this.prediction.y,
            mode: 'lines+markers',
            name: 'Initial Prediction',
            marker: {
                size: 12,
                color: '#F06292'
            }
        };

        let trace3 = {};
        if (this.learning) {
            trace3 = {
                x: this.learning.x,
                y: this.learning.y,
                mode: 'lines+markers',
                name: 'Learning',
                marker: {
                    size: 12,
                    color: '#00E676'
                }
            };
        }

        const layout = {
            margin: {
                l: 20,
                r: 0,
                b: 0,
                t: 0,
                pad: 0
            },
            legend: {
                xanchor: "left",
                yanchor: "top",
                y: 1,
                //tbh i don't know what these numbers mean?!
                x: 0,
                orientation: "v"
            },
        };
        const lines = [trace1, trace2, trace3];
        this.plotly(lines, layout);
    }


    getTolearnNum(formula, toLearn) {
        const len = formula.length;
        const reg = new RegExp(toLearn, 'g')
            , arr = [];
        for (let i = 0; i < len; i++) {
            const match = reg.exec(formula);
            if (match) {

                arr.push(match.index)
            } else {
                break;
            }
        }
        return arr;
    }


    iniPredict() {
        this.iniRandomArr = this.iniRandom(this.def.length);
        this.iniCoeff = this.getArray(this.iniRandomArr);
        this.prediction = this.generateData(this.iniCoeff)
    }
    generateData(arr) {
        let x = [];
        let y = [];
        const pointsLen = this.NUM_POINTS;
        // Normalize the x values to be between -1 and 1.
        // 🚨 This is super important! TensorFlow requires this
        // for the algorithm to work, and if you don't do this
        // you learn NaN for every coefficient.
        const xs = this.getRandomBetweenRange(pointsLen);
        for (let i = 0; i < pointsLen; i++) {
            x[i] = xs.get(i);
            // goes from a TF tensor (i.e. array) to a number.
        }
        x = x.sort(function (a, b) {
            return a - b
        })

        // Generate the random y values.  
        for (let i = 0; i < pointsLen; i++) {
            const val = x[i];
            y[i] = this.figureOutFeatures(arr, val);
        }

        // Normalize the y values to be between 0 and 1
        const ymin = Math.min(...y);
        const ymax = Math.max(...y);
        const yrange = ymax - ymin;

        for (let i = 0; i < pointsLen; i++) {
            const val = y[i];
            y[i] = (y[i] - ymin) / yrange;
        }

        return {
            x: x,
            y: y
        }
    }




    async doALearning() {
        const that = this;
        // Use the training data, and do numIteration passes over it. 
        return await this.sevenFeedData(this.tensor1d(this.training.x), this.tensor1d(this.training.y));
        // return this.data;
        // Once that is done, this has updated our coefficients! 
        // Here you could see what our predictions look like now, and use them!
        // Example:
        // const coeff = {
        //   a: a.dataSync()[0],
        //   b: b.dataSync()[0],
        //   c: c.dataSync()[0],
        //   d: d.dataSync()[0],
        // };


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
    loss(prediction, labels) {
        // This is the mean squared error between the prediction and the correct answer
        // If you had n data points (NUM_POINTS = n) then it would be:
        // error = 1/n * ( (prediction_1 - answer_1)^2 + ... + (prediction_n - answer_n)^2  )
        // see https://en.wikipedia.org/wiki/Mean_squared_error.
        // There are other error functions you could use, but if you're doing numeric things,
        // MSE is one of the best and also the easiest.

        // Also, this is also why TensorFlow is great! Doing this by hand sucks!
        const error = prediction.sub(labels).square().mean();
        return error;
    }
    calMetricDerivatives(xs, ys) {
        // debugger;
        this.learning = this.generateData(this.getArray(this.iniRandomArr));
        this.plot();
        // Learn! This is where the step happens, and when the training takes place.
        this.getCloser(xs, ys);
    }

    gengerateOptimizer() {
        /*
          Docs: https://js.tensorflow.org/api/0.11.1/#train.sgd
          - sgd means "stochastic gradient descent".
          - stochastic means "probabilistic"
          - gradient descent means that at every step, we move our predictions
          in the direction of the answer. How much to move involves derivatives (the "gradient")
          - the full algorithm is here but it's...mathy: https://en.wikipedia.org/wiki/Stochastic_gradient_descent
          - this is why having tensorflow is good!!
        */
        this.optimizer = super.trainSgdByRate();
    }



    getCloser(xs, ys) {
        const that = this;
        this.optimizer.minimize(() => {
            // Using our estimated coeff, predict all the ys for all the xs 
            const pred = that.predict(xs);
            // Need to return the loss i.e how bad is our prediction from the 
            // correct answer. The optimizer will then adjust the coefficients to minimize this loss.
            return that.loss(pred, ys);
        }
        );
    }
}