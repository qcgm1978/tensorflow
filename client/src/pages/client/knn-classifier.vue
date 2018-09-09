<template>
   <div id="console">
<!-- <script src='https://unpkg.com/@tensorflow-models/mobilenet'></script> -->
       <img id="img" crossOrigin src="https://i.imgur.com/JlUvsxa.jpg" width=227 height=227/>

   </div>
</template>

<script>
// import "https://unpkg.com/@tensorflow-models/mobilenet";
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
    async app() {
      // Load the model.
      this.net = await mobilenet.load();

      // Make a prediction through the model on our image.
      const imgEl = document.getElementById("img");
      const result = await net.classify(imgEl);
      console.log(result);
    }
  },
  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "https://unpkg.com/@tensorflow-models/mobilenet"
    );
    // plugin.async = true;
    document.head.appendChild(plugin);
    // let net;

    this.app();
  }
};
</script>

