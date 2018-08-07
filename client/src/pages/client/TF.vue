<template>
<div>
    <PatternVue/>

      <router-view></router-view>
</div>
</template>
<script>
import PatternVue from "./Pattern";
export default {
  components: {
    PatternVue
  },
  data() {
    return {};
  }
};
</script>
