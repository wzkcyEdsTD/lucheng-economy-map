<template>
  <div class="QjFrame">
    <span>{{this.$props.iframName}}</span>
    <i class="iconfont iconRectangleCopy" @click="leftclose(false)"></i>
    <iframe id="content" :src="`${newSrc}`"></iframe>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "vr-popup",
  data() {
    return {
      newSrc: null
    };
  },
  components: {},
  props: {
    iframName: String,
    iframeAddr: String
  },
  created() {},
  async mounted() {
    const that = this;
  },
  watch: {
    iframeAddr: {
      handler(newVal, val) {
        this.newSrc = newVal;
      }
    }
  },
  computed: {},
  methods: {
    leftclose(tag) {
      this.$parent.QjShow = tag;
    }
  }
};
</script>
 

<style scoped lang="less">
.QjFrame {
  position: absolute;
  z-index: 120;
  bottom: 0px;
  left: 0px;
  width: 100%;
  transition: all 1s;
  background: rgba(19, 45, 85, 0.9);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 10px;
  flex-direction: column;
  bottom:0;
  span {
    position: absolute;
    color: #fff;
    text-align: center;
    left: 50%;
    transform: translate(-50%);
    background: linear-gradient(90deg, #3f7bced1 0%, #3f69be94 100%);
    border-radius: 13px;
    width: 178px;
    height: 50px;
    font-size: 20px;
    font-weight: 700;
    line-height: 47px;
    // z-index: 1;
  }
  .iconRectangleCopy {
    cursor: pointer;
    font-size: 41px;
    position: absolute;
    right: 61px;
    height: 30px;
    color: #1748ab;
    font-weight: 900;
    // transform: translate(-50%,120px);
    // z-index: 1;
  }
  #content {
    height: 800px;
    // transform: translate(-1px, 110px);
  }
}
</style>