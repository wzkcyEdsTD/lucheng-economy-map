import echarts from "echarts";
import axios from "axios";

// $.ajax({
//   url: "http://59.202.38.250/api/open/data/UC_QUERY_WENZHOU_LUCHENG_YBGGYSSR?token=402881756126e2ea016126e2eab60000",
//   type: "GET",
//   dataType: "jsonp",
//   success: function (data) {
//     console.log(data)
//   }
// })

// axios.get(`http://59.202.38.250/api/open/data/UC_QUERY_WENZHOU_LUCHENG_YBGGYSSR?token=402881756126e2ea016126e2eab60000`)
//   .then((response) => {
//     console.log(response)
//   })

// 无图例的图表
// const baseGrid_NoLegend = {
//   left: "1%",
//   right: "8%",
//   top: "20%",
//   bottom: "0%",
//   containLabel: true
// };

const baseGrid_NoLegend = {
  left: "1%",
  right: "8%",
  top: "8%",
  bottom: "0%",
  containLabel: true
};

// 有图例的图表
// const baseGrid = {
//   left: "1%",
//   right: "8%",
//   top: "30%",
//   bottom: "0%",
//   containLabel: true
// };

const baseGrid = {
  left: "1%",
  right: "8%",
  top: "18%",
  bottom: "0%",
  containLabel: true
};

// 标题
function getTitle(text) {
  return {
    text: text,
    top: "1%",
    left: "center",
    textStyle: {
      color: "#00FFFF",
      fontSize: 16
    }
  };
}

// 坐标轴配置项
const {
  tooltip1,
  tooltip2,
  axisTickX,
  axisLabelX,
  axisLineX,
  splitLineX,
  axisLineY,
  splitLineY
} = {
  tooltip1: {
    trigger: "axis",
    axisPointer: {
      lineStyle: {
        color: "#57617B"
      }
    }
  },
  tooltip2: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  axisTickX: {
    alignWithLabel: true
  },
  axisLabelX: {
    interval: (index, text) => {
      return text.match(new RegExp(/(上半年|全年)/));
    }
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
    show: false,
    lineStyle: {
      color: "#11366e"
    }
  }
};

// GDP增速
export const gdpzsOption = {
  // title: getTitle("GDP增速"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip1,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "rgb(0, 255, 255)",
        lineStyle: {
          color: "rgb(0, 255, 255)",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: "rgba(7,44,90,0.3)"
            },
            {
              offset: 1,
              color: "rgba(0,146,246,0.9)"
            }
          ])
        }
      }
    },
    data: []
  }]
};

// 三次产业增加值增速
export const sccyOption = {
  // title: getTitle("三次产业增加值增速"),
  grid: baseGrid,
  tooltip: tooltip1,
  legend: {
    show: true,
    left: "center",
    top: "2%",
    textStyle: {
      color: "#FFF"
    },
    data: ["一产", "二产", "三产"]
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
      name: "一产",
      type: "line",
      symbol: "circle",
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: "rgb(245, 255, 50)",
          lineStyle: {
            color: "rgb(245, 255, 50)",
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "rgba(7,44,90,0.3)"
              },
              {
                offset: 1,
                color: "rgba(0,146,246,0.9)"
              }
            ])
          }
        }
      },
      data: []
    },
    {
      name: "二产",
      type: "line",
      symbol: "circle",
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: "rgb(0, 182, 192)",
          lineStyle: {
            color: "rgb(0, 182, 192)",
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "rgba(7,44,90,0.3)"
              },
              {
                offset: 1,
                color: "rgba(0,212,199,0.9)"
              }
            ])
          }
        }
      },
      data: []
    },
    {
      name: "三产",
      type: "line",
      symbol: "circle",
      symbolSize: 8,
      itemStyle: {
        normal: {
          color: "rgb(198, 33, 255)",
          lineStyle: {
            color: "rgb(198, 33, 255)",
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: "rgba(7,44,90,0.3)"
              },
              {
                offset: 1,
                color: "rgba(114,144,89,0.9)"
              }
            ])
          }
        }
      },
      data: []
    }
  ]
};

// 规上工业增加值增速
export const gsgyOption = {
  // title: getTitle("规上工业增加值增速"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip1,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFF",
        lineStyle: {
          color: "#aecb56",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: "rgba(7,44,90,0.3)"
            },
            {
              offset: 1,
              color: "rgba(114,144,89,0.9)"
            }
          ])
        }
      }
    },
    data: []
  }]
};

// 税收收入占一般公共预算收入比重
export const sssrOption = {
  // title: getTitle("税收收入占一般公共预算收入比重"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip2,
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "bar",
    barWidth: 20,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,

            color: "#4169e1"
          },
          {
            offset: 1,
            color: "#1004cd"
          }
        ])
      }
    },
    data: []
  }]
};

// 一般公共预算收入增速
export const czzsrOption = {
  // title: getTitle("财政总收入、一般公共预算增速"),
  grid: baseGrid,
  tooltip: tooltip1,
  legend: {
    show: true,
    left: "center",
    top: "2%",
    textStyle: {
      color: "#FFF"
    },
    data: ["总收入", "预算收入", "预算支出"]
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    name: "总收入",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#c23531",
        lineStyle: {
          color: "#c23531",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7,44,90,0.3)"
        },
        {
          offset: 1,
          color: "#c23531"
        }
      ])
    },
    data: []
  }, {
    name: "预算收入",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#0092f6",
        lineStyle: {
          color: "#0092f6",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#0092f6"
        }
      ])
    },
    data: []
  }, {
    name: "预算支出",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#ff8c00",
        lineStyle: {
          color: "#ff8c00",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#ff8c00"
        }
      ])
    },
    data: []
  }]
};

// 人民币存款、贷款余额增速
export const ckdkOption = {
  // title: getTitle("人民币存款、贷款余额增速"),
  grid: baseGrid,
  tooltip: tooltip1,
  legend: {
    show: true,
    left: "center",
    top: "2%",
    textStyle: {
      color: "#FFF"
    },
    data: ["存款", "贷款"]
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    name: "存款",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#0092f6",
        lineStyle: {
          color: "#0092f6",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#0092f6"
        }
      ])
    },
    data: []
  }, {
    name: "贷款",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#ff8c00",
        lineStyle: {
          color: "#ff8c00",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#ff8c00"
        }
      ])
    },
    data: []
  }]
};

// 全员劳动生产率(万/人)
export const qyldOption = {
  // title: getTitle("全员劳动生产率(万元/人)"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip2,
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "bar",
    barWidth: 20,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "#cd7004"
        }, {
          offset: 1,
          color: "#f3a444"
        }])
      }
    },
    data: []
  }]
};

// 城乡居民收入增速
export const cxjmsrOption = {
  // title: getTitle("城乡居民收入增速"),
  grid: baseGrid,
  tooltip: tooltip1,
  legend: {
    show: true,
    left: "center",
    top: "2%",
    textStyle: {
      color: "#FFF"
    },
    data: ["城镇", "农村"]
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    name: "城镇",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#ffa500",
        lineStyle: {
          color: "#ffa500",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#ffa500"
        }
      ])
    },
    data: []
  }, {
    name: "农村",
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#1e90ff",
        lineStyle: {
          color: "#1e90ff",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#1e90ff"
        }
      ])
    },
    data: []
  }]
};

// 限上消费品零售额增速
export const xsxfpOption = {
  // title: getTitle("限上消费品零售额增速"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip1,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFF",
        lineStyle: {
          color: "#00FA9A",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#00FA9A"
        }
      ])
    },
    data: []
  }]
};

// 4+2投资结构增速
export const tzjgOption = {
  // title: getTitle("4+2投资结构增速"),
  grid: {
    left: "1%",
    right: "8%",
    top: "33%",
    bottom: "0%",
    containLabel: true
  },
  tooltip: tooltip1,
  legend: {
    show: true,
    left: "center",
    top: "2%",
    textStyle: {
      color: "#FFF"
    },
    data: [
      "民间项目", "高新技术产业", "工业",
      "交通", "服务业", "生态环境和公共设施"
    ]
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    name: '民间项目',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFFF00",
        lineStyle: {
          color: "#FFFF00",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#FFFF00"
          }])
        }
      }
    },
    data: []
  }, {
    name: '高新技术产业',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#4169e1",
        lineStyle: {
          color: "#4169e1",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#4169e1"
          }])
        }
      }
    },
    data: []
  }, {
    name: '工业',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#00FA9A",
        lineStyle: {
          color: "#00FA9A",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#00FA9A"
          }])
        }
      }
    },
    data: []
  }, {
    name: '服务业',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#894af4",
        lineStyle: {
          color: "#894af4",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#894af4"
          }])
        }
      }
    },
    data: []
  }, {
    name: '生态环境和公共设施',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#c23531",
        lineStyle: {
          color: "#c23531",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#c23531"
          }])
        }
      }
    },
    data: []
  }, {
    name: '交通',
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#fe9d22",
        lineStyle: {
          color: "#fe9d22",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
            offset: 0,
            color: "rgba(7,44,90,0.3)"
          }, {
            offset: 1,
            color: "#fe9d22"
          }])
        }
      }
    },
    data: []
  }]
};

// 规上营利性服务业增速
export const gsylfwyOption = {
  // title: getTitle("规上营利性服务业增速"),
  tooltip: tooltip1,
  grid: baseGrid_NoLegend,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFF",
        lineStyle: {
          color: "#6343b4",
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
              offset: 0,
              color: "rgba(7,44,90,0.3)"
            },
            {
              offset: 1,
              color: "#6343b4"
            }
          ])
        }
      }
    },
    data: []
  }]
};

// 工业用电量增速
export const gyydlOption = {
  // title: getTitle("工业用电量增速"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip1,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFF",
        lineStyle: {
          color: "#4169e1",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#4169e1"
        }
      ])
    },
    data: []
  }]
};

// 商品房销售面积增速
export const spfmjOption = {
  // title: getTitle("商品房销售面积增速"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip1,
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: axisTickX,
    axisLabel: {},
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: "{value}%"
    },
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "line",
    symbol: "circle",
    symbolSize: 8,
    itemStyle: {
      normal: {
        color: "#FFF",
        lineStyle: {
          color: "#83bff6",
          width: 1
        }
      }
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
          offset: 0,
          color: "rgba(7, 44, 90, 0.3)"
        },
        {
          offset: 1,
          color: "#83bff6"
        }
      ])
    },
    data: []
  }]
};

// 人均GDP(元)
export const rjgdpOption = {
  // title: getTitle("人均GDP(元)"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip2,
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: {
    type: "value",
    axisLine: axisLineY,
    splitLine: splitLineY
  },
  series: [{
    type: "bar",
    barWidth: 20,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#db99f4"
          },
          {
            offset: 1,
            color: "#894af4"
          }
        ])
      }
    },
    data: []
  }]
};

//出口总额(亿元)
export const ckzeOption = {
  // title: getTitle("出口总额(亿元)"),
  grid: baseGrid_NoLegend,
  tooltip: tooltip2,
  xAxis: {
    type: "category",
    axisTick: axisTickX,
    axisLabel: axisLabelX,
    axisLine: axisLineX,
    splitLine: splitLineX,
    data: []
  },
  yAxis: [{
      type: "value",
      axisLine: axisLineY,
      splitLine: splitLineY
    },
    {
      type: "value",
      axisLabel: {
        formatter: "{value}%"
      },
      axisLine: axisLineY,
      splitLine: splitLineY
    }
  ],
  series: [{
    name: "出口总额",
    type: "bar",
    barWidth: 15,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#fe9d22"
          },
          {
            offset: 1,
            color: "#fe5722"
          }
        ])
      }
    },
    data: []
  }, {
    name: "增速",
    type: "line",
    yAxisIndex: 1,
    itemStyle: {
      normal: {
        color: "#4169e1"
      }
    },
    data: []
  }]
};