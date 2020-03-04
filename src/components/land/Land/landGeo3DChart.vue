<template>
  <div class="middle_chart" id="landEchart"></div>
</template>
<script>
import geoJson from "@/components/common/lcEcharts/lcData";
import lSeries from "@/components/common/lcEcharts/lcEcharts.js";
import echarts from "echarts";
import "echarts-gl";
const { indexSeries, landSeries } = lSeries;
export default {
  data() {
    return {
      geoBarData: [
        {
          name: "山福镇",
          value: [120.474425531, 28.1303692142286, 61.71]
        },
        {
          name: "南郊街道",
          value: [120.651791079866, 27.9786151196537, 10]
        },
        {
          name: "南汇街道",
          value: [120.688223689587, 27.9856727766532, 18.9]
        },
        {
          name: "蒲鞋市街道",
          value: [120.68410600807, 28.018867166328, 3.9]
        },
        {
          name: "大南街道",
          value: [120.659201469028, 28.009665954327, 2.59]
        },
        {
          name: "广化街道",
          value: [120.620069812094, 28.0220375135252, 4.1]
        },
        {
          name: "滨江街道",
          value: [120.709421614242, 28.0221811273661, 12.17]
        },
        {
          name: "五马街道",
          value: [120.640766803, 28.0200092361291, 4.65]
        },
        {
          name: "松台街道",
          value: [120.640766803, 28.0200092361291, 6.01]
        },
        {
          name: "双屿街道",
          value: [120.598540339967, 28.0309099121868, 13.13]
        },
        {
          name: "丰门街道",
          value: [120.57675018418, 28.0406598211285, 12.37]
        },
        {
          name: "仰义街道",
          value: [120.561137415292, 28.0731958098226, 32.2]
        },
        {
          name: "藤桥镇",
          value: [120.490621867821, 28.085200967577, 97.66]
        },
        {
          name: "七都街道",
          value: [120.765381895269, 28.0020972456898, 12.7]
        }
      ]
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      let that = this;
      that.chart = echarts.init(document.getElementById("landEchart"));
      // 把配置和数据放这里
      that.chart.hideLoading();
      // 注册地图
      echarts.registerMap("LC", geoJson);
      that.chart.setOption({
        // 悬停
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return `用地面积:${params.value[2]}亩`;
          }
        },
        geo3D: {
          map: "LC",
          label: {
            show: false,
            textStyle: {
              color: "#fff",
              fontSize: 12, 
              opacity: 1,
              backgroundColor: "rgba(100,149,237,0)" // 字体背景色
            }
          },
          itemStyle: {
            areaColor: "#136ac8",
            opacity: 1,
            borderWidth: 1,
            borderColor: "#b9d2ed"
          },
          light: {
            main: {
              intensity: 1,
              shadow: true,
            },
            ambient: {
              intensity: 0
            }
          },
          emphasis: {
            label: {
              show: false
            },
            itemStyle: {
              areaColor: "#2B91B7"
            }
          },
          viewControl: {
            autoRotate: true,
            minBeta: -360,
            maxBeta: 360
          }
        },
        series: [
          {
            type: "bar3D",
            coordinateSystem: "geo3D",
            bevelSize: 0,
            itemStyle: {
              color: "#17e3ff",
            },
            shading: "realistic",
            data: this.geoBarData,
            label: {
              show: true,
              formatter: "{b}",
              position: "top",
              textStyle: {
                color: "#000",
                backgroundColor: "#fff"
              }
            }
          }
        ]
      });

      //根据窗口的大小变动图表
      window.onresize = function() {
        that.chart.resize();
      };
    }
  }
};
</script>
<style scoped>
</style>