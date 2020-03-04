<template>
  <div class="CanFrame"></div>
</template>

<script>
export default {
  name: "Canframe",
  data() {
    return {
      srcURL: require("@/components/common/image/zsResLC.png"),
      showLeft: true,
      showRight: true,
      moveLeft: "20px"
    };
  },
  components: {},
  props: {
    company: Object,
    show_left: Boolean
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {
    show_left: {
      handler(newVal, val) {
        this.moveLeft = newVal ? "25%" : "20px";
      },
      immediate: true
    },
    company: {
      handler(newVal, val) {
        this.showLeft = true;
        this.showRight = true;
      }
    }
  },
  methods: {
    leftclose(tag) {
      this.showLeft = tag;
    },
    rigthclose(showtag) {
      this.showRight = showtag;
    }
  }
};
</script>
<style lang="less"></style>



