// import './style.css'
// import $ from "jquery";
import FitCurveToData from './scaffold';
export default {
    init({ arr, calcNum, coefs, iterations, rate }) {
        const obj = {
            formula: this.getFormula(arr),
            toLearn: 'coef',
            coefs,
            NUM_POINTS: calcNum,
            numIterations: iterations,
            rate
        }
        this.ml = new FitCurveToData(obj);

    },
    doALearning: function () {
        // debugger;
        this.ml.doALearning()
    },
    getData() {
        return this.ml.data;
    },


    getFormula(arr) {
        // return 'coef*x^3+coef*x^2+coef*x+coef';
        // debugger;
        const str = arr.reduce(((accumulator, item) => {
            const degree = item ? `*x^${item}+` : ''
            return accumulator + `coef${degree}`
        }), '');
        return str;
    }
}