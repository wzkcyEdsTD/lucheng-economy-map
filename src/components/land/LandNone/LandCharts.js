export const dkOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    textStyle: {
      color: "#fff"
    },
    data: ["2019年目标(亩)", "完成数(亩)", "完成率(%)"]
  },
  grid: {
    left: "3%",
    right: "1%",
    top: "15%",
    bottom: "0%",
    containLabel: true
  },
  yAxis: {
    type: "category",
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      color: "#FFF"
    },
    splitArea: {
      show: false
    },
    data: ["仰义街道", "丰门街道", "藤桥镇", "双屿街道", "轻工园区", "山福镇"]
  },
  xAxis: {
    show: false
  },
  series: [
    {
      name: "2019年目标(亩)",
      type: "bar",
      stack: "广告",
      itemStyle: {
        normal: {
          label: {
            show: false,
            textStyle: {
              color: "#fff"
            },
            position: "insideTop",
            formatter: function(p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: [95, 200, 120, 80, 60, 5]
    },
    {
      name: "完成数(亩)",
      type: "bar",
      stack: "广告",
      itemStyle: {
        normal: {
          label: {
            show: false,
            textStyle: {
              color: "#fff"
            },
            position: "insideTop",
            formatter: function(p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: [58.9, 124.48, 58.9, 73.02, 77.28, 6.98]
    },
    {
      name: "完成率(%)",
      type: "bar",
      stack: "广告",
      itemStyle: {
        normal: {
          label: {
            show: false,
            textStyle: {
              color: "#fff"
            },
            position: "insideTop",
            formatter: function(p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: [62.0, 62.24, 83.9, 91.28, 128.8, 139.6]
    }
  ]
};

//  饼图
export const pieChart = {
  title: {
    text: "项目",
    x: "center",
    y: "55%",
    textStyle: {
      fontSize: 20,
      color: "rgb(255,255,255)"
    }
  },
  tooltip: {},
  legend: {
    textStyle: {
      fontSize: 14,
      color: "rgb(255,255,255)"
    }
  },
  series: [
    {
      name: "整治情况",
      type: "pie",
      center: ["50%", "65%"],
      radius: ["40%", "75%"],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true,
          position: "inner",
          textStyle: {
            color: "#fff"
          },
          formatter:'{d}%'
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        {
          value: 335,
          name: "未整治数",
          itemStyle: { color: "rgba(240, 23, 23, 1)" }
        },
        {
          value: 310,
          name: "整治数",
          itemStyle: { color: "rgba(255, 139, 139, 1)" }
        }
      ]
    }
  ]
};
