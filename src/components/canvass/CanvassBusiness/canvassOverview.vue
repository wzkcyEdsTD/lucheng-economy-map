<template>
  <div class="canvassOverview_container">
    <div class="left">
      <div class="canvassIntro">
        <span class="_line" />
        <div>
          <header>
            招商简介
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <p v-for="(item,index) in intro" :key="index" v-html="item"></p>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="canvassTraffic">
        <span class="_line" />
        <div>
          <header>
            交通环境
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <p v-for="(item,key,index) in traffic" :key="index">
              <img :src="`${server}/icon/commonIcon/${key}.png`" />
              {{key}}:{{item}}
            </p>
          </div>
          <div class="stateLine">
            <img :src="`${server}/icon/commonIcon/arrow.png`" />
          </div>
        </div>
        <span class="_line" />
      </div>
    </div>
    <div class="middle">
      <canvassOverviewGeoChart />
    </div>
    <div class="right">
      <!-- <div class="canvassChart">
        <span class="_line" />
        <div>
          <header>
            招商项目
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="canvassLittleChart">
            <canvassGeoChart />
          </div>
        </div>
        <span class="_line" />
      </div>-->
      <div class="canvassList">
        <span class="_line" />
        <div style="height:303px">
          <header>
            招商宣传片
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="xcVideo">
            <video
              muted
              :src="`${server}/icon/canvassImg/book/lc_new.mp4`"
              autoplay
              controls
              loop
            >your browser does not support the video tag</video>
          </div>
          <span class="_line" />
        </div>
        <div style="height:550px">
          <span class="_line" />
          <header>
            项目列表
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="canvassProject">
            <ul :class="{marquee_top:animate}">
              <li v-for="(item,index) in list" :key="index" @click="JumpCanres(item)">
                <div>
                  <img :src="`${server}/icon/canvassImg/canvass_${parseInt(item.pid)}.jpg`" />
                </div>
                <div>
                  <p>{{item.name}}</p>
                  <p v-html="item.ename"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <span class="_line" />
      </div>
    </div>
  </div>
</template>

<script>
import canvassGeoChart from "./canvassGeo/canvassGeoChart";
import canvassOverviewGeoChart from "./canvassOverviewGeo/canvassGeo";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
import canvassApi from "@/api/beans/u_canvass";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
export default {
  name: "canoverview",
  data() {
    return {
      server,
      intro: [
        "鹿城区<i class='i_blue'>东临龙湾，西近丽水，南接瓯海，北靠瓯江</i>。",
        "是温州市政府的所在地、温州市<i class='i_gold'>政治经济文化中心</i>和温州市发展<i class='i_gold'>核心区域</i>。",
        "全区陆地面积<i class='i_blue'>292.72</i>平方千米，常住人口<i class='i_blue'>130</i>万左右，下辖2镇12街道。城市依“<i class='i_blue'>通五行之水、连五斗之山、凿二十八井</i>”而建，“<i class='i_blue'>山水林田湖岛</i>”生态本底一应俱全，至今保留山水斗城格局。"
      ],
      traffic: {
        机场: "温州龙湾国际机场",
        高铁: "沿海高铁，杭温高铁（在建），温武高铁（规划）",
        高速: "甬台温高速，金丽温高速，诸永高速，温州绕城高速",
        省道: "G330国道，G104国道，S218省道",
        轻轨: "城市轨道S1线，城市轨道S2线（在建），城市轻轨M线"
      },
      list: [],
      animate: false,
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig))
    };
  },
  components: { canvassGeoChart, canvassOverviewGeoChart },
  props: {},
  watch: {},
  created() {
    setInterval(this.showMarquee, 3000);
  },
  mounted() {
    canvassApi.ds().then(({ data }) => {
      this.list = data.map(item => {
        return {
          ...item,
          ename:
            item.ename.length > 60 ? item.ename.slice(0, 60) + ".." : item.ename
        };
      });
    });
  },
  computed: {},
  methods: {
    showMarquee() {
      this.animate = true;
      setTimeout(() => {
        this.list.push(this.list[0]);
        this.list.shift();
        this.animate = false;
      }, 500);
    },
    JumpCanresJumpCanres(item) {
      // this.$parent.activeName = "canvassRes";
      // this.$parent.ProjectName = item;
    },
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./canvassOverview.less");
</style>