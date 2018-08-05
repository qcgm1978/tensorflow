<template>
  <div class="Ml">
   

    <h2 id="demo">A fun demo!</h2>
    <p>
        If you want to get started, predicting numbers tends to be easier than predicting images, so in this example we're trying
        to fit a curve to a bunch of data (this is the same example from the
        <a href="https://js.tensorflow.org/tutorials/fit-curve.html">TensorFlow</a> site but with waaaaay more code comments and a prettier graph).
        <br>
        <br> We are given a bunch of points (for
        <code>x</code> between -1 and 1, calculate a
        <code>y</code> according to
        <code>y = a * x^3 + b * x^2 + c * x + d</code> -- we know this is the secret formula but we don't know the values of those
        <code>a,b,c,d</code> coefficients.) Our goal is to learn these coefficients, so that if we're given a new
        <code>x</code> value, we can say what the
        <code>y</code> value should be.</p>

    <p>
        The
        <b>blue</b> dots are the training points we were given. The
        <b>red</b> dots would be our guesses, based on our initial, default coefficients (hella incorrect!). Once you click
        the
        <code>train</code> button, the
        <b>green</b> dots show how our coefficients are getting better. After you see the default example, check what happens
        if you change the shape of the data, or we are given fewer data points or fewer iterations!
    </p>

    <div class="settings" id="demo-content">

        <div class="input-container formula">
            <b>Secret formula: </b>
            <code>
<span v-if='formula.length' v-for="item in formula" v-bind:key="item.degree"><input  v-bind:placeholder="item.coef" v-bind:value="item.coef" v-on:change="init" type="number">{{item.degree?'*x':''}}<sup>{{item.degree}}</sup> 
{{item.degree?'+':''}}
</span>


      
        </code>
        </div>
        <br>
        <div class="input-container">
            <label for="points">initial points</label>
            <input id="calcNum" v-bind:placeholder="defaultVal.calcNum" v-bind:value="calcNum" type="number" v-on:change="init">
        </div>
        <div class="input-container">
            <label for="iterations">iterations</label>
            <input id="iterations" v-bind:placeholder="defaultVal.iterations" v-bind:value="iterations" type="number" v-on:change="init">
        </div>
 <div class="input-container">
            <label for="rate">rate</label>
            <input id="rate" v-bind:placeholder="defaultVal.rate" v-bind:value="rate" type="number" v-on:change="init">
        </div>        <button v-on:click="doALearning">Learn!</button>
        <button v-on:click="addPolyDegree">Add Degree of the polynomial</button>
    </div>

    <div id="graph"></div>

    
   
   
  </div>
</template>

<script>
import { mapState } from "vuex";
import MlObj from "../../util/index";
import { getDefaultData, saveData } from "../../api/ml";
export default {
  name: "Ml",
  computed: {
    ...mapState(["clientToken", "clientName"])
  },
  //   defaultVal: {},
  data() {
    let defaultVal = {
      formula: [],
      calcNum: 0,
      iterations: 0,
      rate: 0
    };
    return {
      ...defaultVal,
      defaultVal,
      curPath: this.$route.path,

      config: {}
    };
  },
  methods: {
    async doALearning() {
      const data = await MlObj.doALearning();
      debugger;
      saveData({
        data: {
          data,
          formula: MlObj._formula,
          rate: this.rate,
          periods: this.calcNum,
          iterations: this.iterations
        }
      });
    },
    navTo(route) {
      this.$router.push(route);
    },
    addPolyDegree: () => {
      MlObj.addPolyDegree(this.formulaData[0].degree);
    },
    addPolyDegree(degree) {
      const toAddDegree = degree - 0 + 1;
      this.formula.unshift({
        degree: this.formula[0].degree + 1,
        coef: -0.8
      });
      this.initLearningClass();
    },
    initLearningClass() {
      this.$nextTick(() => {
        MlObj.init({
          arr: this.formula.map(item => item.degree),
          coefs: this.formula.map(item => item.coef),
          calcNum: this.calcNum,
          iterations: this.iterations,
          rate: this.rate
        });
      });
    },
    init(evt) {
      debugger;
      const val = evt.target.id;
      this[val] = parseFloat(evt.target.value);
      this.initLearningClass();
    }
  },

  mounted() {
    getDefaultData().then(data => {
      this.formula = data.degreeCoefs;
      this.calcNum = data.points;
      this.iterations = data.iterations;
      this.rate = data.rate;
      console.log(this.formula);
      this.initLearningClass();
    });
  },

  watch: {
    $route(to, from) {
      this.curPath = to.path;
    }
  }
};
</script>

<style scoped lang="css">
@import "../../assets/css/style.css";
</style>