<template>
    <div></div>
</template>

<script>
import p5 from "p5";
export default {
  methods: {
    setup() {
      creatCanvas(400, 400);
      let r = floor(random(256));
      let g = floor(random(256));
      let b = floor(random(256));
      background(r, g, b);
      let dropdown = createSelect();
      dropdown.option("red-ish");
      dropdown.option("green-ish");
      dropdown.option("blue-ish");
      let submit = createButton("submit");
      submit.mousePressed(sendData);
    },
    sendData() {}
  },
  mounted() {
    this.setup();
  }
};
</script>
