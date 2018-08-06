<template>
  <div class="RNN">
     <h1>TensorFlow.js: Addition RNN</h1>
  <div>
    <div>
      <div class="setting">
        <span class="setting-label">Digits:</span>
        <input id="digits" value="2"></input>
      </div>
      <div class="setting">
        <span class="setting-label">Training Size:</span>
        <input id="trainingSize" value="5000"></input>
      </div>
      <div class="setting">
        <span class="setting-label">RNN Type:</span>
        <select id="rnnType">
          <option value="SimpleRNN">SimpleRNN</option>
          <option value="GRU">GRU</option>
          <option value="LSTM">LSTM</option>
        </select>
      </div>
      <div class="setting">
        <span class="setting-label">RNN Layers:</span>
        <input id="rnnLayers" value="1"></input>
      </div>
      <div class="setting">
        <span class="setting-label">RNN Hidden Layer Size:</span>
        <input id="rnnLayerSize" value="128"></input>
      </div>
      <div class="setting">
        <span class="setting-label">Batch Size:</span>
        <input id="batchSize" value="128"></input>
      </div>
      <div class="setting">
        <span class="setting-label">Train Iterations:</span>
        <input id="trainIterations" value="100"></input>
      </div>
      <div class="setting">
        <span class="setting-label"># of test examples:</span>
        <input id="numTestExamples" value="20"></input>
      </div>
    </div>
    <button id="trainModel">Train Model</button>
    <div id="trainStatus"></div>
    <div>
      <div class="canvases" id="lossCanvas"></div>
      <div class="canvases" id="accuracyCanvas"></div>
      <div class="canvases" id="examplesPerSecCanvas"></div>
    </div>
    <div id="testExamples"></div>
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
      data: ""
    };
  },

  methods: {
    async runAdditionRNNDemo() {
      document
        .getElementById("trainModel")
        .addEventListener("click", async () => {
          const digits = +document.getElementById("digits").value;
          const trainingSize = +document.getElementById("trainingSize").value;
          const rnnTypeSelect = document.getElementById("rnnType");
          const rnnType = rnnTypeSelect.options[
            rnnTypeSelect.selectedIndex
          ].getAttribute("value");
          const layers = +document.getElementById("rnnLayers").value;
          const hiddenSize = +document.getElementById("rnnLayerSize").value;
          const batchSize = +document.getElementById("batchSize").value;
          const trainIterations = +document.getElementById("trainIterations")
            .value;
          const numTestExamples = +document.getElementById("numTestExamples")
            .value;

          // Do some checks on the user-specified parameters.
          const status = document.getElementById("trainStatus");
          if (digits < 1 || digits > 5) {
            status.textContent = "digits must be >= 1 and <= 5";
            return;
          }
          const trainingSizeLimit = Math.pow(Math.pow(10, digits), 2);
          if (trainingSize > trainingSizeLimit) {
            status.textContent =
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
          await demo.train(trainIterations, batchSize, numTestExamples);
        });
    }
  },
  mounted() {
    getDefaultData("/api/ml/getRNNDefaultData?id=1").then(data => {
      debugger;
    });
    this.runAdditionRNNDemo();
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