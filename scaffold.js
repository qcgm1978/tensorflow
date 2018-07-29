/**
 * fit a curve to a bunch of data
 * @class ML
 */
class FitCurveToData extends ML {
    /**
     * Implement ML ini, plot and learn
     * @param  {string} formula the secret formula, parsed by math.js
     * @param  {string} toLearn the coefficients of the formula
     * @param  {array} def initial data set
     * @memberof ML
     */
    constructor(formula, toLearn, def = []) {
        super(formula)
        this.toLearn = toLearn;

        var arr = this.getTolearnNum(formula, toLearn);
        this.def = this.getDef(arr, def);
        super.generatePattern(this.defineSevenTimeSeries())

        this.plot()
    }
    defineSevenTimeSeries() {
        const sevenSteps = [
            { figureOutFeatures: super.getFeaturesEval },
            this.iniPredict,
            this.generateTrainTarget,
            {
                watchLoops: this.getCloser
            },
            this.gengerateOptimizer,
            { sixthStep: this.calMetricDerivatives },
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

    /** * Returns a random number between min (inclusive) and max (exclusive) */
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    generateTrainTarget() {
        this.training = this.generateData(ML.private.NUM_POINTS, this.def)
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
        Plotly.newPlot('graph', [trace1, trace2, trace3], layout, {
            displayModeBar: false
        });
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
    iniPredict() {
        this.iniRandomArr = this.iniRandom(this.def.length);
        this.iniCoeff = this.getArray(this.iniRandomArr);
        this.prediction = this.generateData(ML.private.NUM_POINTS, this.iniCoeff)
    }
    generateData(points, arr) {
        let x = [];
        let y = [];

        // Normalize the x values to be between -1 and 1.
        // 🚨 This is super important! TensorFlow requires this
        // for the algorithm to work, and if you don't do this
        // you learn NaN for every coefficient.
        const xs = tf.randomUniform([points], -1, 1);
        // magic TF to give you points between [-1, 1]
        for (let i = 0; i < points; i++) {
            x[i] = xs.get(i);
            // goes from a TF tensor (i.e. array) to a number.
        }
        x = x.sort(function (a, b) {
            return a - b
        })

        // Generate the random y values.  
        for (let i = 0; i < points; i++) {
            const val = x[i];
            y[i] = this.figureOutFeatures(arr, val);
        }

        // Normalize the y values to be between 0 and 1
        const ymin = Math.min(...y);
        const ymax = Math.max(...y);
        const yrange = ymax - ymin;

        for (let i = 0; i < points; i++) {
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
        // Create an optimizer. This is the thing that does the learning.
        // 👉 you can play with these two numbers if you want to change the 
        // rate at which the algorithm is learning

        // How many passes through the data we're doing.
        const numIterations = parseInt(document.getElementById('iterations').value || 75);

        // Use the training data, and do numIteration passes over it. 
        await this.sevenFeedData(tf.tensor1d(this.training.x), tf.tensor1d(this.training.y), numIterations);

        // Once that is done, this has updated our coefficients! 
        // Here you could see what our predictions look like now, and use them!
        // Example:
        // const coeff = {
        //   a: a.dataSync()[0],
        //   b: b.dataSync()[0],
        //   c: c.dataSync()[0],
        //   d: d.dataSync()[0],
        // };
        // this.prediction = generateData(NUM_POINTS, coeff);
        // plot();

    }
   
    /*
         * Predicts all the y values for all the x values.
         */
    predict(x) {
        const that = this;
        // Calculate a y according to the formula
        // y = a * x ^ 3 + b * x ^ 2 + c * x + d
        // where a, b, c, d are the coefficients we have currently calculated.
        return tf.tidy(() => {
            const result = that.iniRandomArr[0].mul(x.pow(tf.scalar(3, 'int32'))).add(that.iniRandomArr[1].mul(x.square())).add(that.iniRandomArr[2].mul(x)).add(that.iniRandomArr[3]);
            return result;
        }
        );
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
        this.learning = this.generateData(ML.private.NUM_POINTS, this.getArray(this.iniRandomArr));
        this.plot();
        // Learn! This is where the step happens, and when the training takes place.
        this.watchLoops(xs, ys);
    }

    gengerateOptimizer() {
        // How fast we are learning.
        const learningRate = 0.5;
        /*
          Docs: https://js.tensorflow.org/api/0.11.1/#train.sgd
          - sgd means "stochastic gradient descent".
          - stochastic means "probabilistic"
          - gradient descent means that at every step, we move our predictions
          in the direction of the answer. How much to move involves derivatives (the "gradient")
          - the full algorithm is here but it's...mathy: https://en.wikipedia.org/wiki/Stochastic_gradient_descent
          - this is why having tensorflow is good!!
        */
        this.optimizer = tf.train.sgd(learningRate);
    }

    getCloser(xs, ys) {
        this.optimizer.minimize(() => {
            // Using our estimated coeff, predict all the ys for all the xs 
            const pred = this.predict(xs);
            // Need to return the loss i.e how bad is our prediction from the 
            // correct answer. The optimizer will then adjust the coefficients
            // to minimize this loss.
            return this.loss(pred, ys);
        }
        );
    }
}
ML.private = {
    NUM_POINTS: 100,

}
const ml = new FitCurveToData('coef*x^3+coef*x^2+coef*x+coef', 'coef', [-0.8, -0.2, 0.9, 0.7, -0.5]);
const doALearning = ml.doALearning.bind(ml);
