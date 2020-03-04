<template>
  <div id="content">
    <div class="scroller demo1">
      <div class="inside" v-for="(item,index) in bannerList" :key="index">
        <a @click="clickHandle(item,index)">
          <p>{{item.label.replace(/街道/g,"")}}</p>
          <img :src="`${item.url}`" alt />
        </a>
      </div>
    </div>
    <div id="mapHandle" :class="icon_show_right?'slideToLeft':''">
      <div class="container" @click="play">
        <div id="app">
          <div :class="`pause ${!playFlag?'active' : ''}active`">
            <div class="line line_1"></div>
            <div class="line line_2"></div>
          </div>
          <div :class="`play ${playFlag?'active' : ''}active`">
            <div class="line line_1"></div>
            <div class="line line_2"></div>
            <div class="line line_3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lunbo from "./scroller";
import $ from "jquery";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  name: "lunbo",
  data() {
    return {
      bannerList: [
        { url: `${server}/icon/streetImg/七都街道.png`, label: "七都街道" },
        { url: `${server}/icon/streetImg/滨江街道.png`, label: "滨江街道" },
        { url: `${server}/icon/streetImg/南汇街道.png`, label: "南汇街道" },
        {
          url: `${server}/icon/streetImg/蒲鞋市街道.png`,
          label: "蒲鞋市街道"
        },
        { url: `${server}/icon/streetImg/南郊街道.png`, label: "南郊街道" },
        { url: `${server}/icon/streetImg/大南街道.png`, label: "大南街道" },
        { url: `${server}/icon/streetImg/五马街道.png`, label: "五马街道" },
        { url: `${server}/icon/streetImg/松台街道.png`, label: "松台街道" },
        { url: `${server}/icon/streetImg/广化街道.png`, label: "广化街道" },
        { url: `${server}/icon/streetImg/双屿街道.png`, label: "双屿街道" },
        { url: `${server}/icon/streetImg/丰门街道.png`, label: "丰门街道" },
        { url: `${server}/icon/streetImg/仰义街道.png`, label: "仰义街道" },
        { url: `${server}/icon/streetImg/藤桥镇.png`, label: "藤桥镇" },
        { url: `${server}/icon/streetImg/山福镇.png`, label: "山福镇" }
      ],
      index: 1,
      interval: null,
      playFlag: true,
    };
  },
  components: {},
  props: {
    icon_show_right: Boolean
  },
  created() {},
  mounted() {
    this.initScroll(() => {
      this.initInterval();
    });
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    initScroll(fn) {
      $(".demo1").scroller();
      $(`.demo1 .inside:nth-child(${this.index}) a`).click();
      fn && fn();
    },
    initInterval() {
      const that = this;
      this.interval = setInterval(() => {
        this.$parent.switchChar(that.bannerList[that.index]);
        const _index = (that.index + 1) % 14;
        $(`.demo1 .inside:nth-child(${_index}) a`).click();
        that.index = _index;
      }, 8000);
    },
    clickHandle(item, _index) {
      this.$parent.switchChar(item);
      this.index = _index + 1;
    },
    play() {
      // 播放/暂停
      if (this.playFlag) {
        clearInterval(this.interval);
        this.playFlag = !this.playFlag;
      } else {
        this.playFlag = !this.playFlag;
        this.$parent.switchChar(this.bannerList[this.index]);
        const _index = (this.index + 1) % 14;
        $(`.demo1 .inside:nth-child(${_index}) a`).click();
        this.index = _index;
        this.initInterval();
      }
    }
  }
};
</script>
 <style lang="less">
@import url("./lunbo.less");
</style>