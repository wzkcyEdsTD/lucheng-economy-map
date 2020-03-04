import echarts from "echarts";

// 无图例的图表
const baseGrid_NoLegend = {
  left: "1%",
  right: "7%",
  top: "6%",
  bottom: "6%",
  containLabel: true
};

const { axisTickX, axisLineX, splitLineX, axisLineY, splitLineY } = {
  axisTickX: {
    alignWithLabel: true
  },
  axisLineX: {
    show: true,
    lineStyle: {
      color: "#FFF"
    }
  },
  splitLineX: {
    show: false
  },
  axisLineY: {
    lineStyle: {
      color: "#FFF"
    }
  },
  splitLineY: {
    show: true,
    lineStyle: {
      color: "#11366e"
    }
  }
};

// 时间
const timeData = [
  "2016\n全年",
  "2017\n全年",
  "2018\n一季度",
  "2018\n上半年",
  "2018\n前三季度",
  "2018\n全年",
  "2019\n一季度",
  "2019\n上半年"
];

export const chartsOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#fff"
        }
      },
      axisLabel: {
        interval: 0,
        inside: false
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: "#18267E"
        }
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#fff"
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#18267E"
        }
      },
      axisLabel: {
        formatter: "{value}"
      }
    }
  ],
  series: [
    {
      name: "第一产业",
      type: "bar",
      stack: "产业",
      itemStyle: {
        normal: {
          color: "#85cadb"
        }
      },
      data: [320, 332, 301, 334, 390, 230, 220, 220, 132, 101, 134, 290]
    },
    {
      name: "第二产业",
      type: "bar",
      stack: "产业",
      itemStyle: {
        normal: {
          color: "#dbcc85"
        }
      },
      data: [120, 132, 101, 134, 90, 230, 210, 220, 232, 101, 134, 190]
    },
    {
      name: "第三产业",
      type: "bar",
      stack: "产业",
      itemStyle: {
        normal: {
          color: "#dc7070"
        }
      },
      data: [220, 182, 191, 234, 290, 230, 210, 220, 332, 201, 334, 190]
    }
  ]
};

// 规上工业增加值增速
export const ChartOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        color: "#57617B"
      }
    }
  },
  grid: baseGrid_NoLegend,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: timeData
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [
    {
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      color: "rgb(137,189,27)",
      lineStyle: {
        normal: {
          width: 1
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: "0",
                color: "#5ff6e9"
              },
              {
                offset: 0.8,
                color: "#7370fd"
              }
            ],
            false
          )
        }
      },
      data: []
    }
  ]
};

// 限上批零住餐销售(营业)总额(亿元)
export const Chart1Option = {
  grid: baseGrid_NoLegend,
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: timeData
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [
    {
      type: "bar",
      barWidth: 30,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: "0",
              color: "#00FA9A"
            },
            {
              offset: 1,
              color: "#00FF7F"
            }
          ])
        },
        emphasis: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: "0",
              color: "#71C8B1"
            },
            {
              offset: 0.7,
              color: "#44C0C1"
            },
            {
              offset: 1,
              color: "#06B5D7"
            }
          ])
        }
      },
      data: []
    }
  ]
};

// 限上消费品零售总额(亿元)
export const Chart2Option = {
  grid: baseGrid_NoLegend,
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: timeData
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [
    {
      type: "bar",
      barWidth: 30,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: "0",
              color: "#8A2BE2"
            },
            {
              offset: 1,
              color: "#9370DB"
            }
          ])
        },
        emphasis: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: "0",
              color: "#9370DB"
            },
            {
              offset: 1,
              color: "#8A2BE2"
            }
          ])
        }
      },
      data: []
    }
  ]
};
