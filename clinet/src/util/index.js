// import './style.css'
// import $ from "jquery";
import FitCurveToData from './scaffold';
export default {
    init() {
        const obj = {
            formula: this.getFormula(),
            toLearn: 'coef',
            def: Array.from(document.querySelectorAll('#demo-content code input')).map(item => item.value),
            NUM_POINTS: parseInt($('#points').val()),
            numIterations: parseInt(document.getElementById('iterations').value)
        }
        const ml = new FitCurveToData(obj);
        window.doALearning = ml.doALearning.bind(ml);

    },
    // window.init();

    addPolyDegree() {
        const degree = $('#demo-content code sup:first').text();
        const toAddDegree = degree - 0 + 1;
        $('#demo-content code').prepend(`
    <input id="i_${toAddDegree}" placeholder="-0.8" value="-0.8" onchange="init()" type="number">*x<sup>${toAddDegree}</sup>+
    `);
        this.init()
    },

    getFormula() {
        // return 'coef*x^3+coef*x^2+coef*x+coef';
        const str = $('#demo-content code sup').toArray().reduce(((accumulator, item) => {
            return accumulator + `coef*x^${$(item).text()}+`
        }), '');
        return str + `coef*x+coef`;
    }
}