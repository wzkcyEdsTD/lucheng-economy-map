<template>
  <div class="middle_chart" id="landEchart"></div>
</template>
<script>
import geoJson from "@/components/common/lcEcharts/lcData";
import lSeries from "@/components/common/lcEcharts/lcEcharts.js";
import echarts from 'echarts';
const { indexSeries, landSeries } = lSeries;
export default {
  data() {
    return {
      geoData: [
        ["山福镇", 61.71],
        ["藤桥镇", 97.66],
        ["仰义街道", 32.2],
        ["丰门街道", 12.37],
        ["双屿街道", 13.13],
        ["广化街道", 4.1],
        ["松台街道", 6.01],
        ["五马街道", 4.65],
        ["大南街道", 2.59],
        ["南郊街道", 10],
        ["蒲鞋市街道", 3.9],
        ["南汇街道", 18.9],
        ["滨江街道", 12.17],
        ["七都街道", 12.7]
      ],
      geoCoordMap: {
        山福镇: [120.474425531, 28.1303692142286],
        南郊街道: [120.651791079866, 27.9786151196537],
        南汇街道: [120.688223689587, 27.9856727766532],
        蒲鞋市街道: [120.68410600807, 28.018867166328],
        大南街道: [120.659201469028, 28.009665954327],
        广化街道: [120.620069812094, 28.0220375135252],
        滨江街道: [120.709421614242, 28.0221811273661],
        五马街道: [120.660720933266, 28.0399409441212],
        松台街道: [120.640766803, 28.0200092361291],
        双屿街道: [120.598540339967, 28.0309099121868],
        丰门街道: [120.57675018418, 28.0406598211285],
        仰义街道: [120.561137415292, 28.0731958098226],
        藤桥镇: [120.490621867821, 28.085200967577],
        七都街道: [120.765381895269, 28.0020972456898]
      }
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
      echarts.registerMap("LC2", geoJson);
      that.chart.setOption({
        // 悬停
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name;
          }
        },
        geo: [
          {
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
                borderWidth: 5
              }
            },
            silent: true
          },
          {
            map: "LC",
            roam: false,
            center: [120.597, 28.07],
            zlevel: 1,
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
                areaColor: "#327bbf",
                borderWidth: 0,
                shadowColor: "#57a1d2",
                shadowBlur: 20,
                shadowOffsetX: -20,
                shadowOffsetY: 20
              }
            },
            silent: true
          }
        ],
        series: landSeries
      });

      let landBarOption = {
        xAxis: [],
        yAxis: [],
        grid: [],
        series: []
      };

      that.geoData.forEach(function(dataItem, idx) {
        let geoCoord = that.geoCoordMap[dataItem[0]];
        let coord = that.chart.convertToPixel({ geoIndex: 0 }, geoCoord);

        idx += "";

        let inflationData = [dataItem[1]];

        landBarOption.xAxis.push({
          id: idx,
          gridId: idx,
          zlevel: 15,
          type: "category",
          name: dataItem[0].replace("街道", "").replace("镇", ""),
          nameLocation: "middle",
          nameGap: 3,
          nameTextStyle: {
            fontSize: 14
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#FFF"
            }
          },
          data: ["用地面积"],
          z: 100
        });
        landBarOption.yAxis.push({
          id: idx,
          gridId: idx,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          axisLine: { show: false },
          z: 100
        });
        landBarOption.grid.push({
          id: idx,
          width: 27,
          height: 37,
          left: coord[0] - 15,
          top: coord[1] - 15,
          z: 100
        });
        landBarOption.series.push({
          id: idx,
          type: "bar",
          zlevel: 15,
          xAxisId: idx,
          yAxisId: idx,
          data: inflationData,
          z: 100,
          label: {
            show: true,
            position: "top",
            color: "#FFF",
            fontSize: 12
          },
          itemStyle: {
            normal: {
              color: function(params) {
                var colorList = ["#00CCFF"];
                return colorList[params.dataIndex];
              }
            }
          }
        });
      });

      that.chart.setOption(landBarOption);

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