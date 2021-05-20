import echarts from "echarts";
import echarts_1 from "echarts";
var streeData = [
  "仰义街道",
  "丰门街道",
  "双屿街道",
  "广化街道",
  "松台街道",
  "大南街道",
  "南郊街道",
  "蒲鞋市街道",
  "南汇街道",
  "滨江街道",
  "七都街道",
  "山福镇",
  "藤桥镇"
];

export const zsOption = {
  color: [
    "#25B7FB",
    "#0589F8",
    "#FFC500",
    "#00D88E",
    "#FE8300",
    "#8500F7",
    "#FBFF00",
    "#00D4FA",
    "#006AFC",
    "#50F06D"
  ],
  tooltip: {
    formatter: "{b}: {d}%"
  },
  legend: {
    // type: "scroll",
    orient: "horizontal",
    top: "bottom",
    left: "0%",
    align: "left",
    itemWidth: 8,
    itemHeight: 8,
    height: 50,
    textStyle: {
      color: "#f2f2f2"
    },
    data: [
      "工业",
      "金融业",
      "建筑业",
      "其他服务业",
      "房地产业",
      "批发和零售业",
      "住宿和餐饮业",
      "交通运输、仓储和邮政业",
      "信息传输、软件和信息技术服务业"
    ]
  },

  series: [{
      type: "pie",
      clockwise: false, //饼图的扇区是否是顺时针排布
      minAngle: 2, //最小的扇区角度（0 ~ 360）
      radius: ["30%", "50%"],
      center: ["50%", "35%"],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false
        }
      },
      data: []
    },
    {
      type: "pie",
      radius: ["60", "61"],
      center: ["50%", "35%"],
      data: [1],
      label: {
        normal: {
          show: false
        }
      }
    }
  ]
};

//经济分布
export const ecoOption = {
  tooltip: {
    show: true,
  },
  grid: [{
    //  width: "49%",
    left: "1%",
    top: "0",
    right: "0",
    bottom: "0"
  }],
  xAxis: [{
    show: false
  }],
  yAxis: [{
      splitLine: "none",
      axisTick: "none",
      axisLine: "none",
      axisLabel: {
        verticalAlign: "bottom",
        align: "left",
        padding: [0, 0, 10, 8],
        textStyle: {
          color: "#ffffff",
          fontSize: "14"
        }
      },
      data: ["2千万-5千万", "5千万-8千万", "8千万-亿元", "亿元以上"]
    },
    {
      splitLine: "none",
      axisTick: "none",
      axisLine: "none",
      data: [7, 3, 5, 12],
      axisLabel: {
        show: true,
        verticalAlign: "bottom",
        align: "right",
        padding: [0, 20, 10, 0],
        textStyle: {
          color: "#fff",
          fontSize: "12"
        },
        formatter: function (value) {
          return value + "幢";
        },
        rich: {
          y: {
            color: "#fffa6f",
            fontSize: 12
          },
          x: {
            fontSize: 16
          }
        }
      }
    }
  ],
  series: [{
      type: "bar",
      data: [7, 3, 5, 12],
      barWidth: 15,
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            1,
            0,
            [{
                offset: 0,
                color: "rgba(17,154,255,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(67,255,179,1)" // 100% 处的颜色
              }
            ],
            false
          ),
          barBorderRadius: 30
        }
      },
      z: 2
    },
    {
      name: "",
      type: "bar",
      barGap: "-100%",
      data: [20, 20, 20, 20],
      barWidth: 15,
      // tooltip: {
      //   formatter: function(params, ticket, callback) {
      //     return "";
      //   }
      // },
      silent: true,
      itemStyle: {
        normal: {
          color: "rgba(41,65,95,1)",
          barBorderRadius: 30
        }
      },
      z: 0
    }
  ]
};
export const jdOption = {
  grid: {
    x: 10,
    y: 10,
    x2: 10,
    y2: 10,
    containLabel: true
  },
  tooltip: {
    show: true,
    trigger: "axis",
    axisPointer: "line"
  },
  legend: {
    width: "100%",
    textStyle: {
      color: "#fff",
      fontSize: 12
    },
    // icon: "square",
    right: "40",
    top: "-6",
    itemGap: 5,
    data: [
      "入驻企业数(家)",
      "规上服务业(家)"
    ]
  },
  xAxis: [{
    boundaryGap: true,
    axisLabel: {
      color: "#29DAFF",
      interval: 0,
      rotate: -30,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#397cbc"
      }
    },
    axisTick: {
      show: true
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#1F5B88",
        width: 3
      }
    },
    data: []
  }],
  yAxis: [{
      name: "入驻企业数(家)",
      type: "value",
      min: 0,
      max: 700,
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: "#2ad1d2"
        }
      },
      axisLine: {
        lineStyle: {
          color: "#27b4c2"
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#11366e",
          width: 3
        }
      }
    },
    {
      name: "规上服务业(家)",
      type: "value",
      max: 30,
      position: "right",
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: "#2ad1d2"
        }
      },
      axisLine: {
        lineStyle: {
          color: "#27b4c2"
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#11366e",
          width: 3
        }
      }
    }
  ],
  series: [{
      name: "入驻企业数(家)",
      type: "bar",
      itemStyle: {
        normal: {
          color: '#14b1eb',
          opacity: .7
        }
      },
      data: [],
    },
    {
      name: "规上服务业(家)",
      type: "line",
      stack: "总量",
      symbol: "circle",
      symbolSize: 8,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: "#FFEB33",
          borderColor: "#FFEB33",
          lineStyle: {
            color: "#FFEB33"
          }
        }
      }
      // areaStyle: {
      //   //color: '#94C9EC'
      //   color: new echarts_1.graphic.LinearGradient(0, 0, 0, 1, [
      //     {
      //       offset: 0,
      //       color: "rgba(41,171,255,1)"
      //     },
      //     {
      //       offset: 1,
      //       color: "rgba(41,218,255,0.2)"
      //     }
      //   ])
      // }
      ,
      markPoint: {
        itemStyle: {
          normal: {
            color: "red"
          }
        }
      },
      data: []
    }
  ]
};
var spirit2 =
  "image://data:image/png;base64,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";
var labelSetting = {
  normal: {
    show: true,
    position: "left",
    offset: [10, 0],
    textStyle: {
      color: "#2AFFFA",
      fontSize: 16
    }
  }
};
export const slOption = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    x: 10,
    y: 10,
    x2: 10,
    y2: 10,
    containLabel: true
  },
  yAxis: {
    data: ["南汇:", "滨江:", "五马:", "南郊:", "松台:", "大南:", "蒲鞋市:", "广化:", "双屿:"],
    inverse: true,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      margin: 30,
      textStyle: {
        color: "#fff",
        fontSize: 14
      }
    },
    axisPointer: {
      label: {
        show: true,
        margin: 30
      }
    }
  },
  xAxis: {
    splitLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: [{
    type: "pictorialBar",
    label: labelSetting,
    // symbolSize: ['100%', '80%'],
    symbolOffset: [30, 0],
    symbolPosition: "start",
    barCategoryGap: "40%",
    data: [{
        value: 23,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["60%", "70%"]
      },
      {
        value: 21,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["90%", "80%"]
      },
      {
        value: 8,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["80%", "80%"]
      },
      {
        value: 5,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["80%", "80%"]
      },
      {
        value: 4,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["100%", "80%"]
      },
      {
        value: 3,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["100%", "80%"]
      },
      {
        value: 3,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["100%", "90%"]
      },
      {
        value: 1,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["100%", "100%"]
      },
      {
        value: 1,
        symbolRepeat: true,
        symbol: spirit2,
        symbolSize: ["100%", "100%"]
      }
    ]
  }]
};
export const rzOption = {
  color: ["#8A2BE2", "#FFD700"],
  grid: {
    x: 10,
    y: 10,
    x2: 10,
    y2: 10,
    containLabel: true
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    width: "100%",
    textStyle: {
      color: "#fff",
      fontSize: 12
    },
    // icon: "square",
    right: "60",
    top: "0",
    itemGap: 5,
    data: ["楼宇总面积(万㎡)", "闲置率(%)"]
  },
  xAxis: [{
    data: ["南汇", "五马", "滨江", "大南", "松台", "广化", "南郊"],
    silent: false,
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: "#fff"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#fff"
      }
    }
  }],
  yAxis: [{
      type: "value",
      name: "楼宇总面积(万㎡)",
      position: "left",
      axisLabel: {
        interval: 0,
        color: "#FFF"
      },
      axisLine: {
        lineStyle: {
          color: "#FFF"
        }
      },
      splitLine: {
        show: false
      }
    },
    {
      type: "value",
      name: "闲置率",
      max: 100,
      position: "right",
      axisLabel: {
        interval: 0,
        color: "#FFF"
      },
      axisLine: {
        lineStyle: {
          color: "#FFF"
        }
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [{
      name: "楼宇总面积(万㎡)",
      type: "bar",
      data: [40.03, 9.96, 21.43, 40, 5.4, 9.44, 1.9],
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [{
                offset: 0,
                color: "rgba(27,211,249,1)" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(21,252,234,1)" // 100% 处的颜色
              }
            ],
            false
          )
        }
      },
      animationDelay: function (idx) {
        return idx * 10;
      }
    },
    {
      type: "line",
      smooth: true,
      data: [20.6, 15.1, 8.5, 25.5, 4.7, 96, 71.4],
      name: "闲置率(%)",
      symbolSize: 8, // 控制线条上 点 的大小
      itemStyle: {
        normal: {
          color: "#FFEB33",
          borderColor: "#FFEB33",
          lineStyle: {
            color: "#FFEB33"
          }
        }
      },
      animationDelay: function (idx) {
        return idx * 10;
      }
    }
  ]
};