<template>
  <div class="RNN">
     <h1>TensorFlow.js: Addition RNN</h1>
  <div>
    <div>
      <div class="setting">
        <span class="setting-label">Digits:</span>
        <input id="digits" v-model="data.digits" type='range' min="1" max="5"/>
        <label for="digits">{{data.digits}}</label>
      </div>
      <div class="setting">
        <span class="setting-label">Training Size:</span>
        <input id="trainingSize" v-bind:value="data.trainingSize">
      </div>
      <div class="setting">
        <span class="setting-label">RNN Type:</span>
        <select id="rnnType" v-model="data.type">
          <option value="GRU">GRU</option>
          <option value="SimpleRNN">SimpleRNN</option>
          <option value="LSTM">LSTM</option>
        </select>
      </div>
      <div class="setting">
        <span class="setting-label">RNN Layers:</span>
        <input id="rnnLayers" v-bind:value="data.layers">
      </div>
      <div class="setting">
        <span class="setting-label">RNN Hidden Layer Size:</span>
        <input id="rnnLayerSize" v-bind:value="data.layerSize">
      </div>
      <div class="setting">
        <span class="setting-label">Batch Size:</span>
        <input id="batchSize" v-bind:value="data.batchSize">
      </div>
      <div class="setting">
        <span class="setting-label">Train Iterations:</span>
        <input id="trainIterations" v-model="data.iterations">
      </div>
      <div class="setting">
        <span class="setting-label"># of test examples:</span>
        <input id="numTestExamples" v-bind:value="data.examples">
      </div>
    </div>
    <button id="trainModel" v-on:click='runAdditionRNNDemo'>Train Model</button>
    <div id="trainStatus">{{trainStatus}}</div>
    <div>
      <div class="canvases" id="lossCanvas"></div>
      <div class="canvases" id="accuracyCanvas"></div>
      <div class="canvases" id="examplesPerSecCanvas"></div>
    </div>
    <div id="testExamples">
      <div v-for="(example,index) in examples" :key="index" v-bind:class="isCorrect[index] ? 'answer-correct' : 'answer-wrong'">
        {{example}}
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import AdditionRNNDemo from "../../util/AdditionRNNDemo";
import { getDefaultData, saveData } from "../../api/ml";
export default {
  name: "start",

  data() {
    return {
      examples: [],
      isCorrect: [],
      trainStatus: "",
      data: {
        digits: 0,
        trainingSize: 0,
        type: "",
        layers: 0,
        layerSize: 0,
        batchSize: 0,
        iterations: 0,
        examples: 0
      }
    };
  },

  methods: {
    async runAdditionRNNDemo() {
      const digits = +this.data.digits;
      const trainingSize = +this.data.trainingSize;
      const rnnType = this.data.type;
      const layers = +this.data.layers;
      const hiddenSize = +this.data.layerSize;
      const batchSize = +this.data.batchSize;
      const trainIterations = +this.data.iterations;
      const numTestExamples = +this.data.examples;

      // Do some checks on the user-specified parameters.
      if (digits < 1 || digits > 5) {
        this.trainStatus = "digits must be >= 1 and <= 5";
        return;
      }
      const trainingSizeLimit = Math.pow(Math.pow(10, digits), 2);
      if (trainingSize > trainingSizeLimit) {
        this.trainStatus =
          `With digits = ${digits}, you cannot have more than ` +
          `${trainingSizeLimit} examples`;
        return;
      }

      const demo = new AdditionRNNDemo(
        digits,
        trainingSize,
        rnnType,
        layers,
        hiddenSize
      );
      await demo.train({
        iterations: trainIterations,
        batchSize,
        numTestExamples,
        callback: ({
          i,
          trainLoss,
          trainAccuracy,
          valLoss,
          valAccuracy,
          examplesPerSec,
          isCorrect,
          examples
        }) => {
          this.isCorrect = isCorrect;
          this.examples = examples;
          this.trainStatus = `Iteration ${i}: train loss = ${trainLoss.toFixed(
            6
          )}
                train accuracy = ${trainAccuracy.toFixed(6)}
                validation loss = ${valLoss.toFixed(6)}
                validation accuracy = ${valAccuracy.toFixed(6)}
                (${examplesPerSec.toFixed(1)} examples/s)`;
        }
      });
    }
  },
  mounted() {
    getDefaultData("/api/ml/getRNNDefaultData?id=1").then(data => {
      // debugger;
      // todo for speed
      data.iterations = 10;
      this.data = data;
    });
  }
};
</script>
<style scoped lang="css">
@import "../../assets/css/material.cyan-teal.min.css";
body {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  margin-top: 50px;
  margin-left: 50px;
}
.setting {
  padding-bottom: 6px;
}
.setting-label {
  display: inline-block;
  width: 12em;
}
.answer-correct {
  color: green;
}
.answer-wrong {
  color: red;
}
.canvases {
  display: inline-block;
}
</style>