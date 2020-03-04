<template>
  <div class="CanFrame" :style="{left:moveLeft}">
    <div class="title">
      <p>{{this.name}}</p>
      <i class="iconfont iconRectangleCopy" @click="leftclose(false)"></i>
    </div>
    <div class="gk">
      <img v-for="(item,index) in images" :key="index" :src="item" />
    </div>
  </div>
</template>

<script>
import { WRT_config } from "@/components/common/Tmap";
import canvassApi from "@/api/beans/u_canvass";
const { server } = WRT_config;
export default {
  name: "Canframe",
  data() {
    return {
      moveLeft: "20px",
      images: [],
      name: null,
      pid: null
    };
  },
  components: {},
  props: {
    canvass: Object,
    show_left: Boolean
  },
  mounted() {
    this.fetchImgaes();
  },
  watch: {
    show_left: {
      handler(newVal, val) {
        this.moveLeft = newVal ? "25%" : "20px";
      },
      immediate: true
    },
    canvass: {
      handler(newVal, val) {
        this.name = newVal.name || newVal.attributes.FNAME ;
        this.pid = newVal.pid || newVal.attributes.pid;
        this.fetchImgaes();
      },
      immediate: true
    }
  },
  methods: {
    leftclose(tag) {
      this.$parent.showCanvass = tag;
    },
    fetchImgaes() {
      const that = this;
      canvassApi.ds({ where: `pid='${this.pid}'` }).then(({ data }) => {
        if (data.length) {
          const images = [];
          const item = data[0];
          for (let i = 1; i <= item.image; i++) {
            images.push(
              `${server}/icon/canvassImg/手册_${item.pid}_${i}.jpg`
            );
          }
          that.images = images;
        }
      });
    }
  }
};
</script>
 <style scoped lang="less">
.CanFrame {
  position: absolute;
  top: 100px;
  left: 20px;
  height: 80%;
  width: 80%;
  transition: all 1s;
  background: rgba(19, 45, 85, 0.9);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 99;
  overflow: hidden;
  .title {
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding: 7px;
    display: flex;
    justify-content: space-between;
    .iconRectangleCopy {
      cursor: pointer;
      font-size: 24px;
    }
    p {
      width: 88%;
      font-size: 20px;
      color: #2cf6ff;
      text-align: center;
      display: inline-block;
      margin: 0 auto;
    }
  }
  .gk {
    flex: 1;
    overflow-y: scroll;
    img {
      width: 100%;
    }
  }
  .gk::-webkit-scrollbar {
    display: none;
    width: 6px;
    background-color: rgb(146, 146, 146);
    border-radius: 3px;
  }

  .gk::-webkit-scrollbar-thumb {
    width: 6px;
    background-color: rgb(68, 68, 68);
    border-radius: 3px;
  }
}
</style>