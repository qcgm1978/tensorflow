<template>
    <div><h1>TensorFlow.js Example:
      <br/>Reinforcement Learning: Cart Pole </h1>

    <div>
      <div>
        <span id="app-status">Standing by.</span>
      </div>

      <div>
        <canvas id="cart-pole-canvas" height="150px" width="500px"></canvas>
      </div>

      <div>
        <div class="horizontal-sections">
          <div class="input-div">
            <span class="input-label">Locally-stored network</span>
            <input id="stored-model-status" value="N/A" disabled="true" readonly="true"></input>
            <button id="delete-stored-model" disabled="true">Delete</button>
          </div>

          <div class="horizontal-sections">
            <div class="input-div">
              <span class="input-label">Hidden layer size(s) (e.g.: "5", "8,6"):</span>
              <input id="hidden-layer-sizes" value="4"></input>
              <button id="create-model" disabled="true">Create model</button>
            </div>
          </div>

          <div class="input-div">
            <span class="input-label">Number of iterations:</span>
            <input id="num-iterations" value="20"></input>
          </div>
          <div class="input-div">
            <span class="input-label">Games per iteration:</span>
            <input id="games-per-iteration" value="20"></input>
          </div>
          <div class="input-div">
            <span class="input-label">Max. steps per game:</span>
            <input id="max-steps-per-game" value="500"></input>
          </div>
          <div class="input-div">
            <span class="input-label">Reward discount rate:</span>
            <input id="discount-rate" value="0.95"></input>
          </div>
          <div class="input-div">
            <span class="input-label">Learning rate:</span>
            <input id="learning-rate" value="0.05"></input>
          </div>
          <div class="input-div">
            <span class="input-label">Render during training:</span>
            <input type="checkbox" id="render-during-training" />
          </div>
          <div class="buttons-section">v-on:click='startTrain'
            <button id="train" disabled="true" >Train</button>
            <button id="test" disabled="true">Test</button>
          </div>
        </div>

        <div class="horizontal-sections">
          <div>
            <span id="iteration-status" class="status-span"></span>
            <progress value="0" max="100" id="iteration-progress"></progress>
          </div>
          <div>
            <span id="train-status" class="status-span"></span>
            <progress value="0" max="100" id="train-progress"></progress>
          </div>
          <div>
            <span class="status-span">Training speed:</span>
            <span id="train-speed" class="status-span"></span>
          </div>
          <div class="canvases" id="steps-canvas"></div>
        </div>
      </div>
    </div></div>
</template>
<script>
import "../../util/index";
// import { setUpUI } from "../../util/ui";
// console.log(setUpUI);
export default {
  name: "cart-pole",
  data() {
    return {};
  },
  methods: {
    // startTrain
  },
  mounted() {
    // this.startTrain = setUpUI();
    // setUpUI();
  }
};
</script>

<style lang="css">
#app-status {
  color: blue;
  font-family: monospace;
  font-size: 150%;
  padding-bottom: 1em;
}

#cart-pole-canvas {
  display: none;
}

button {
  font-size: 105%;
  min-width: 120px;
}

input {
  font-family: monospace;
  width: 200px;
}

.input-div {
  padding: 5px;
  font-family: monospace;
}

.input-label {
  display: inline-block;
  width: 15em;
}

.canvases {
  display: inline-block;
}

.horizontal-sections {
  display: inline-block;
  padding-left: 0px;
  padding-right: 10px;
  vertical-align: top;
  border: 1px #aaa solid;
}

.status-span {
  display: inline-block;
  width: 150px;
}

.buttons-section {
  float: right;
}

input :disabled {
  background-color: #aaa;
}
</style>