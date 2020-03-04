<template>
  <div class="ecoFormModal">
    <header>
      重点楼宇展示
      <i class="iconfont iconRectangleCopy" @click="closeModal"></i>
    </header>
    <div class="modalContent">
      <Table></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ecoFormModal",
  data() {
    return {};
  },
  components: {},
  props: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    closeModal() {
      this.$parent.shallEcoModal = false;
    }
  }
};
</script>

 <style scoped lang="less">
.ecoFormModal {
  animation-duration: 0.3s;
  position: absolute;
  top: 20%;
  width: 500px;
  min-height: 500px;
  background-color: rgba(3, 6, 63, 0.8);
  border-radius: 8px;
  border: 1px #fff solid;
  display: flex;
  flex-direction: column;
  > header {
    height: 40px;
    line-height: 40px;
    text-align: center;
    box-sizing: border-box;
    padding: 0 10px;
    border-bottom: 1px #fff solid;
    .iconRectangleCopy {
      float: right;
      cursor: pointer;
    }
  }
  .modalContent {
    flex: 1;
    box-sizing: border-box;
    padding: 10px;
  }
}
</style>