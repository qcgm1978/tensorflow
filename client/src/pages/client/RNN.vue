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
        <input id="trainingSize" v-model="data.trainingSize">
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
        <input id="rnnLayers" v-model="data.layers">
      </div>
      <div class="setting">
        <span class="setting-label">RNN Hidden Layer Size:</span>
        <input id="rnnLayerSize" v-model="data.layerSize">
      </div>
      <div class="setting">
        <span class="setting-label">Batch Size:</span>
        <input id="batchSize" v-model="data.batchSize">
      </div>
      <div class="setting">
        <span class="setting-label">Train Iterations:</span>
        <input id="trainIterations" v-model="data.iterations">
      </div>
      <div class="setting">
        <span class="setting-label"># of test examples:</span>
        <input id="numTestExamples" v-model="data.examples">
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
      stopRequested: [],
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
      if (this.demo) {
        this.demo.stop = true;
        this.demo = null;
        return;
      }
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

      this.demo = new AdditionRNNDemo(
        digits,
        trainingSize,
        rnnType,
        layers,
        hiddenSize
      );
      await this.demo.train({
        iterations: trainIterations,
        batchSize,
        numTestExamples,
        callback: this.visualizeAndSave,
        stopRequested: this.stopRequested
      });
    },
    visualizeAndSave({
      i,
      trainLoss,
      trainAccuracy,
      valLoss,
      valAccuracy,
      examplesPerSec,
      isCorrect,
      examples
    }) {
      this.isCorrect = isCorrect;
      this.examples = examples;
      trainLoss = trainLoss.toFixed(6);
      examplesPerSec = examplesPerSec.toFixed(1);
      trainAccuracy = trainAccuracy.toFixed(6);
      const validationLoss = valLoss.toFixed(6),
        validationAccuracy = valAccuracy.toFixed(6);
      this.trainStatus = `Iteration ${i}: train loss = ${trainLoss}
                train accuracy = ${trainAccuracy}
                validation loss = ${validationLoss}
                validation accuracy = ${validationAccuracy}
                (${examplesPerSec} examples/s)`;
      if (i === this.data.iterations - 1) {
        const correctLen = isCorrect.filter(item => item).length;
        if (correctLen === 0) {
          console.error(
            "No correct calculation. Update the train iterations and retry."
          );
          return;
        }
        const wrongLen = this.data.iterations - correctLen,
          obj = this.examples.reduce(
            (accumulator, item, index) => {
              isCorrect[index]
                ? accumulator.correct.push(item)
                : accumulator.wrong.push(item);
              return accumulator;
            },

            {
              correct: [],
              wrong: []
            }
          );
        const [correct, wrong] = [obj.correct, obj.wrong];
        saveData({
          data: {
            configData: this.data,
            trainLoss,
            trainAccuracy,
            validationLoss,
            validationAccuracy,
            examplesPerSec,
            correct,
            wrong,
            correctLen,
            wrongLen
          },
          url: "/api/ml/saveRNNData"
        });
      }
    }
  },
  mounted() {
    getDefaultData("/api/ml/getRNNDefaultData?id=1").then(data => {
      // debugger;
      // todo for speed
      // data.iterations = 1;
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