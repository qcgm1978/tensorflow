<template>
  <div class="start">
     <h4>Tiny TFJS example<hr/></h4>
    <div id="micro_out_div">{{data}}</div>
  </div>
</template>

<script>
import Start from "../../util/start";
export default {
  name: "start",

  data() {
    return {
      data: ""
    };
  },

  methods: {
    // This tiny example illustrates how little code is necessary build /
    // train / predict from a model in TensorFlow.js.  Edit this code
    // and refresh the index.html to quickly explore the API.

    // Tiny TFJS train / predict example.
    async myFirstTfjs() {}
  },
  mounted() {
    // this.myFirstTfjs();
    const start = new Start();
    debugger;
    start.doALearning().then(data => {
      this.data = data;
    });
  }
};
</script>

