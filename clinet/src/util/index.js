// import './style.css'
// import $ from "jquery";
import FitCurveToData from './scaffold';
export default {
    init(arr, points) {
        const obj = {
            formula: this.getFormula(arr),
            toLearn: 'coef',
            def: Array.from(document.querySelectorAll('#demo-content code input')).map(item => item.value),
            NUM_POINTS: parseInt(points),
            numIterations: parseInt(document.getElementById('iterations').value)
        }
        const ml = new FitCurveToData(obj);
        window.doALearning = ml.doALearning.bind(ml);

    },
    // window.init();



    getFormula(arr) {
        // return 'coef*x^3+coef*x^2+coef*x+coef';
        debugger;
        const str = arr.reduce(((accumulator, item) => {
            const degree = item ? `*x^${item}+` : ''
            return accumulator + `coef${degree}`
        }), '');
        return str;
    }
}