// import './style.css'
// import $ from "jquery";
import FitCurveToData from './scaffold';
export default {
    init({ arr, calcNum, coefs, iterations, rate }) {
        this.formula = arr
        const obj = {
            formula: this._formula,
            toLearn: 'coef',
            coefs,
            NUM_POINTS: calcNum,
            numIterations: iterations,
            rate
        }
        this.ml = new FitCurveToData(obj);

    },
    async doALearning() {
        debugger;
        return await this.ml.doALearning();
    },
    getData() {
        return this.ml.data;
    },
    // get formula() {
    //     return this.formula;
    // },
    set formula(arr) {
        this._formula = this.getFormula(arr)
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