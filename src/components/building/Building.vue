<template>
  <div class="lucheng">
    <header>
      <ul>
        <li
          v-for="(item, key, index) in lists "
          :key="index"
          @click="selectT(item.value,item.title)"
          :class="{active:activeName==item.value,li_tab_active:activeName==item.value}"
        >{{item.title}}</li>
      </ul>
    </header>
    <div class="page_container">
      <transition enter-class="fade-in-enter" enter-active-class="fade-in-active">
        <!-- <keep-alive include="buildpic"> -->
        <components :is="activeName" :item="item" :search="search" ref="StyleTool"></components>
        <!-- </keep-alive> -->
      </transition>
    </div>
  </div>
</template>

<script>
import buildingLayer from "./BuildEconomy/build.vue";
import buildPic from "./BuildPicture/buildPicture.vue";
import buildAnalyze from "./BuildAnalyze/buildAnalyze.vue";
export default {
  name: "building",
  data() {
    return {
      activeName: "buildingLayer",
      lists: [
        { value: "buildingLayer", title: "楼宇总述" },
        { value: "buildPic", title: "楼宇画像" },
        { value: "buildAnalyze", title: "楼宇分析" }
      ],
      item: {},
      search: {}
    };
  },
  components: { buildingLayer, buildPic, buildAnalyze },
  activated() {
    if (this.$route.params.Jump) {
      this.activeName = this.$route.params.activeName;
      this.search = this.$route.params.list;
      console.log(this.$route.params.list);
    } else {
      this.activeName = "buildingLayer";
    }
  },
  mounted() {},
  computed: {},
  methods: {
    //高亮标签
    selectT(value, title) {
      this.activeName = value;
    }
  }
};
</script>
<style scoped lang="less"></style>
