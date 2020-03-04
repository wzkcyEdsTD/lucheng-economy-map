<template>
  <div class="canvassGeoChart">
    <div id="canvassGeoChart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import canvassEcharts from "@/components/common/echarts";
import geoJson from "@/components/common/lcEcharts/lcData";
import iSeries from "@/components/common/lcEcharts/lcEcharts.js";
const { canvassSeries } = iSeries;

export default {
  name: "canvassGeoChart",
  data() {
    return {
      chart: null,
      geoJson
    };
  },
  components: {},
  props: {},
  created() {},
  mounted() {
    this.gifToDataUrl();
    this.initGeoChart();
  },
  computed: {},
  methods: {
    gifToDataUrl() {
      let img = new Image();
      img.onload = function() {
        let canvas = document.createElement("canvas"),
          width = img.width,
          height = img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      };
    },
    initGeoChart() {
      const that = this;
      that.chart = echarts.init(document.getElementById("canvassGeoChart"));
      that.chart.hideLoading();
      // 注册地图
      echarts.registerMap("LC", that.geoJson);
      // 街道坐标
      const geoMap = [
        {
          name: "山福镇",
          value: [120.474425531, 28.1303692142286]
        },
        {
          name: "南郊街道",
          value: [120.651791079866, 27.9896151196537]
        },
        {
          name: "南汇街道",
          value: [120.688223689587, 27.9926727766532]
        },
        {
          name: "蒲鞋市街道",
          value: [120.68110600807, 28.007867166328]
        },
        {
          name: "大南街道",
          value: [120.659201469028, 28.005665954327]
        },
        {
          name: "广化街道",
          value: [120.625069812094, 28.0180375135252]
        },
        {
          name: "滨江街道",
          value: [120.709421614242, 28.0141811273661]
        },
        {
          name: "五马街道",
          value: [120.660720933266, 28.0229409441212]
        },
        {
          name: "松台街道",
          value: [120.642766803, 28.0160092361291]
        },
        {
          name: "双屿街道",
          value: [120.598540339967, 28.0179099121868]
        },
        {
          name: "丰门街道",
          value: [120.57675018418, 28.0386598211285]
        },
        {
          name: "仰义街道",
          value: [120.561137415292, 28.0651958098226]
        },
        {
          name: "藤桥镇",
          value: [120.490621867821, 28.083200967577]
        },
        {
          name: "七都街道",
          value: [120.765381895269, 28.0018972456898]
        }
      ];

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
            center: [120.6, 28.05],
            zoom: 1.5,
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
                shadowBlur: 10,
                shadowOffsetX: -10,
                shadowOffsetY: 10
              }
            },
            silent: false
          }
        ],
        series: canvassSeries
      });
      this.chart.on("click", function(event) {
        const point = [];
        point.push(event.value);
        that.$emit("canJump", point);
      });
    }
  }
};
</script>
 <style lang="less">
.canvassGeoChart {
  width: 100%;
  height: 100%;
  #canvassGeoChart {
    width: 100%;
    height: 100%;
  }
}
</style>