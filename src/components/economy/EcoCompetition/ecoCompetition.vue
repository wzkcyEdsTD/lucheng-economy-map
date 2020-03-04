<template>
  <div class="Com_content">
    <div class="Com_container">
      <div class="com_left">
        <div class="leftCompetition">
          <leftCompetition :leftOptions="leftOptions" />
        </div>
        <!-- <span @click="hiddenLeft()" class="hidden_button">
          <i class="iconfont icon-angle-double-left" v-show="icon_show_left"></i>
          <i class="iconfont icon-angle-double-right" v-show="!icon_show_left"></i>
        </span>-->
      </div>
      <div class="middle">
        <span>
          <div class="middle_chart" id="Echart"></div>
        </span>
      </div>
      <div class="com_center">
        <div class="wrap">
          <!-- <span class="btn_lift" @click="hiddenMiddle()">
            <i class="iconfont icon-angle-double-down" v-show="icon_show_middle"></i>
            <i class="iconfont icon-angle-double-up" v-show="!icon_show_middle"></i>
          </span>-->
          <div class="centertitle">历年规上工业产值</div>
          <div class="chartlists">
            <div class="centerchart1">
              <ecoecharts id="chart1" :option="chart1Option" />
            </div>
            <div class="centerchart2">
              <ecoecharts id="chart2" :option="chart2Option" />
            </div>
          </div>
        </div>
      </div>
      <div class="com_right">
        <div>
          <rightCompetition :rightformdata="rightformdata" />
        </div>
        <!-- <span @click="hidden3()" class="hidden_right_button">
          <i class="iconfont icon-angle-double-left" v-show="!icon_show_right"></i>
          <i class="iconfont icon-angle-double-right" v-show="icon_show_right"></i>
        </span>-->
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import leftCompetition from '@/components/economy/EcoCompetition/leftCompetition'
import rightCompetition from '@/components/economy/EcoCompetition/rightCompetition'
import ecoecharts from "@/components/common/echarts";
import { option1, option2 } from "./ecoCompetitioncharts";
import geoJson from "@/components/common/lcEcharts/lcData";
import iSeries from "@/components/common/lcEcharts/lcEcharts.js";
const { indexSeries } = iSeries;
export default {
  name: "ecoCompetition",
  data() {
    return {
      leftOptions:[],
      chart1Option:option1,
      chart2Option:option2,
      geoJson,
      rightformdata:['滨江','滨江','滨江','滨江','滨江']
    };
  },
  components: {
    leftCompetition,
    rightCompetition,
    ecoecharts
  },
  props: {},
  created() {},
  mounted() {
    this.initChart();
  },
  computed: {},
  methods: {
    initChart() {
      let that = this;
      that.chart = echarts.init(document.getElementById("Echart"));
      // 把配置和数据放这里
      that.chart.hideLoading();
      // 注册地图
      echarts.registerMap("LC", that.geoJson);
      echarts.registerMap("LC2", that.geoJson);
      that.chart.setOption({
        // 悬停
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name + "<br />" + params.value;
          }
        },
        geo: {
          map: "LC",
          roam: false,
          zlevel: 2,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            // 普通样式
            normal: {
              areaColor: "#337ebe",
              borderColor: "#71b2d4",
              borderWidth: 5,
              shadowColor: "#57a1d2",
              shadowBlur: 20
            },
            // 悬停样式
            emphasis: {
              areaColor: "#337ebe"
            }
          }
        },
        series: indexSeries
      });
    },
  }
};
</script>
 <style lang="less">
@import url("./ecoCompetition.less");
</style>



