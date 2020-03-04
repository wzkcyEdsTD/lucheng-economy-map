<template>
  <div class="buildGeoChart">
    <!-- <sky /> -->
    <img src="../../common/image/buildbg.png" />
    <div id="buildGeoChart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import buildEcharts from "@/components/common/echarts";
import geoJson from "@/components/common/lcEcharts/lcData";
import iSeries from "@/components/common/lcEcharts/lcEcharts.js";
const { geoMap, buildMapSeries } = iSeries;
import sky from "@/components/common/canvas/sky";

export default {
  name: "buildGeoChart",
  data() {
    return {
      chart: null,
      geoJson
    };
  },
  components: { sky },
  props: {
    buildingOption: Array
  },
  watch: {
    buildingOption: {
      handler(newVal) {
        if (!newVal.length) return;
        const _option = this.fixOption();
        this.chart && this.chart.setOption(_option);
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.initGeoChart();
  },
  computed: {},
  methods: {
    initGeoChart() {
      const that = this;
      that.chart = echarts.init(document.getElementById("buildGeoChart"));
      that.chart.hideLoading();
      // 注册地图
      echarts.registerMap("LC", that.geoJson);
      const _option = this.fixOption();
      that.chart.setOption(_option);
    },
    fixOption() {
      const _option = {
        type: "map",
        map: "LC",
        roam: false,
        center: [120.6, 28.05],
        zoom: 1.2,
        top: "100px",
        zlevel: 2,
        itemStyle: {
          normal: {
            borderColor: "rgba(147, 235, 248, 1)",
            borderWidth: 1,
            areaColor: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: "0",
                  // color: "rgba(147, 235, 248, 0)" // 0% 处的颜色
                  color: "#0073B1"
                },
                {
                  offset: "1",
                  // color: "rgba(147, 235, 248, .5)" // 100% 处的颜色
                  color: "#43B6E1"
                }
              ],
              globalCoord: false // 缺省为 false
            }
            // shadowColor: "rgba(0, 0, 0, .5)",
            // shadowOffsetX: -2,
            // shadowOffsetY: -20,
            // shadowBlur: "50"
          }
        },
        silent: true,
        data: buildMapSeries
      };
      return {
        // 悬停
        tooltip: {
          trigger: "item",
          formatter: function(params, ticket) {
            return params.name;
          }
        },
        visualMap: {
          type: "continuous",
          orient: "horizontal",
          bottom: 0,
          left: 0,
          min: 0,
          max: 12,
          text: ["多", "少"],
          inRange: {
            // color: ["#6495ED", "#483D8B", "#191970"]
            color: ["#32c5ff", "#712df7", "#c701ff"]
          },
          seriesIndex: 0,
          textStyle: {
            color: "#fff"
          }
        },
        geo: [
          {
            type: "map",
            map: "LC",
            roam: false,
            center: [120.6, 28.05],
            zoom: 1.2,
            top: "100px",
            zlevel: 1,
            itemStyle: {
              normal: {
                borderColor: "rgba(147, 235, 248, 1)",
                borderWidth: 1,
                areaColor: {
                  x: 0,
                  y: 30,
                  x2: 7,
                  y2: 0,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#009DA1"
                    },
                    {
                      offset: 1,
                      color: "#005B9E"
                    }
                  ]
                }
              }
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            silent: true
          },
          {
            map: "LC",
            roam: false,
            zlevel: 2,
            // center: [120.6, 28.05],
            zoom: 1.2,
            left: 70,
            top: 80,
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
                areaColor: "#01386F",
                // borderColor: "#71b2d4",
                // borderWidth: 5
                shadowColor: "rgba(0, 0, 0, .5)",
                shadowOffsetX: -2,
                shadowOffsetY: 20,
                shadowBlur: "50"
              }
            },
            silent: true
          }
        ],
        series: [_option, ...this.buildingOption]
      };
    }
  }
};
</script>
 <style lang="less">
.buildGeoChart {
  width: 100%;
  height: 100%;
  position: relative;
  #buildGeoChart {
    position: absolute;
    width: 90%;
    height: 100%;
    left: 50%;
    right: 50%;
    transform: translate(-48%, 0px);
  }
  img {
    width: 753px;
    height: 564px;
    left: 50%;
    right: 50%;
    transform: translate(25%, 58px);
  }
}
</style>