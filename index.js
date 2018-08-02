import './style.css'
import FitCurveToData from './scaffold'
window.init = () => {
    const ml = new FitCurveToData('coef*x^3+coef*x^2+coef*x+coef', 'coef', Array.from(document.querySelectorAll('#demo-content code input')).map(item => item.value));
    window.doALearning = ml.doALearning.bind(ml);

}
window.init();