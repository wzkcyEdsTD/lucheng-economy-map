<template>
  <div id="lcEcharts"></div>
</template>

<script>

import echarts from "echarts";
import geoJson from "./lcData";
import { truncate } from "fs";
export default {
  name: "lcecharts",
  props: {},
  data() {
    return {
      chart: null
    };
  },
  components: {},
  created() {},
  watch: {},
  mounted() {
    this.initChart();
  },
  computed: {},
  methods: {
    initChart() {
      let that = this;
      that.chart = echarts.init(document.getElementById("lcEcharts"));
      // 把配置和数据放这里
      that.chart.hideLoading();
      echarts.registerMap("LC", geoJson);
      // 街道数据
      var geoData = [
        {
          name: "山福镇",
          value: 20057.34
        },
        {
          name: "藤桥镇",
          value: 15477.48
        },
        {
          name: "仰义街道",
          value: 31686.1
        },
        {
          name: "丰门街道",
          value: 6992.6
        },
        {
          name: "双屿街道",
          value: 44045.49
        },
        {
          name: "广化街道",
          value: 40689.64
        },
        {
          name: "松台街道",
          value: 37659.78
        },
        {
          name: "五马街道",
          value: 45180.97
        },
        {
          name: "大南街道",
          value: 55204.26
        },
        {
          name: "南郊街道",
          value: 21900.9
        },
        {
          name: "蒲鞋市街道",
          value: 4918.26
        },
        {
          name: "南汇街道",
          value: 4918.26
        },
        {
          name: "滨江街道",
          value: 4918.26
        },
        {
          name: "七都街道",
          value: 4918.26
        }
      ];
      that.chart.setOption({
         // 悬停
            tooltip: {
                trigger: "item",
                formatter: function (params) {
                    return params.name + '<br />' + params.value
                }
            },
            geo: {
                map: "LC",
                roam: false,
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
                        borderWidth: 0,
                        shadowColor: '#57a1d2',
                        shadowBlur: 10,
                        shadowOffsetX: -10,
                        shadowOffsetY: 10
                    },
                    // 悬停样式
                    emphasis: {
                        areaColor: "#337ebe",
                    }
                }
            },
            series: [{
                type: "map",
                map: "LC",
                roam: false,
                left: '11%',
                top: '10%',
                // 文本
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 16,
                            color: "#000"
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: "#ccc"
                        }
                    }
                },
                itemStyle: {
                    // 普通样式
                    normal: {
                        areaColor: "#12379f",
                        borderColor: "#fff",
                        fontWeightL: 700,
                        borderWidth: 1
                    },
                    // 悬停样式
                    emphasis: {
                        areaColor: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                    offset: 0,
                                    color: "#3f15d6"
                                },
                                {
                                    offset: 1,
                                    color: "#d243cd"
                                }
                            ]
                        }
                    }
                },
                data: geoData
            }]
      });
      //根据窗口的大小变动图表
      window.onresize = function() {
        that.chart.resize();
      };
      /*that.chart.on('click', function (event) {
            if (event.componentSubType == 'map' && event.seriesIndex == 0) {
                window.open("http://www.baidu.com")
            }
        })*/
    }
  }
};
</script>
 <style lang="less">
#lcEcharts {
  height: 100%;
  width: 100%;
}
</style>



