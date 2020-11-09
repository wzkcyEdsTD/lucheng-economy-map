import echarts from "echarts";
export const streetInfo = {
  南郊街道: {
    no: 1,
    val: 85.78,
    point: [120.64848384812649, 27.98720982355913],
    arr: [13, 10, 3, 0]
  },
  仰义街道: {
    no: 2,
    val: 75.18,
    point: [120.55870494798003, 28.061925437877978],
    arr: [12, 14, 9, 0]
  },
  滨江街道: {
    no: 3,
    val: 74.03,
    point: [120.71168352532027, 28.00952907477948],
    arr: [1, 0, 1, 0]
  },
  丰门街道: {
    no: 4,
    val: 71.53,
    point: [120.57775936082183, 28.0384078292354],
    arr: [24, 37, 18, 3]
  },
  双屿街道: {
    no: 5,
    val: 52.91,
    point: [120.59853038743316, 28.019868400524462],
    arr: [3, 8, 7, 1]
  },
  山福镇: {
    no: 6,
    val: 43.02,
    point: [120.45605144456206, 28.126684692333544],
    arr: [4, 1, 3, 1]
  },
  轻工业园区: {
    no: 7,
    val: 29.62,
    point: [120.5480190272647, 28.09668686671099],
    arr: [15, 8, 11, 4]
  },
  藤桥镇: {
    no: 8,
    val: 28.52,
    point: [120.51458797410308, 28.088919189403857],
    arr: [3, 4, 3, 0]
  },
  南汇街道: {
    no: 9,
    val: 24.63,
    point: [120.6903116838896, 27.991332968822448],
    arr: [0, 1, 0, 0]
  }
};
export const streetCharOption = {
  color: ["#F52424", "#EC8221", "#2883F5", "#127B49"],
  legend: {
    orient: "vartical",
    x: "left",
    top: "center",
    left: "8%",
    // top: "20%",
    data: ["A类企业", "B类企业", "C类企业", "D类企业"],
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: "rgba(255,255,255,1)",
      fontSize: 16
    },
    formatter: function (name) {
      return "" + name;
    }
  },
  series: [{
    type: "pie",
    radius: ["40%", "80%"],
    center: ["65%", "50%"],
    label: {
      normal: {
        show: true,
        position: "inside",
        formatter: "{b}:{d}%",
        textStyle: {
          fontSize: 16
        }
      }
    },
    data: []
  }]
};

//  参评企业数
export const cp1Option = {
  title: {
    text: "共1631家",
    textStyle: {
      color: "#fff",
      fontSize: 20,
      align: "center"
    },
    x: "center",
    top: "88px"
  },
  legend: {
    data: ["规上企业", "规下企业"],
    top: "bottom",
    textStyle: {
      color: "#fff",
      fontSize: 14
    },
    icon: "rect",
    itemWidth: 16,
    itemHeight: 16
  },
  tooltip: {
    trigger: "item",
    formatter: function (params) {
      return `${params.name}:${params.value}家`;
    }
  },
  textStyle: {
    rich: {
      title: {
        fontSize: 16,
        lineHeight: 15,
        color: "#fff"
      }
    }
  },
  series: [{
    color: ["#2AC9FD", "#35C96E"],
    type: "pie",
    radius: ["54px", "78px"],
    center: ["50%", "98px"],
    avoidLabelOverlap: false,
    label: {
      normal: {
        show: true,
        // position: "inner",
        position: "outside",
        textStyle: {
          fontSize: 16,
          color: "#fff"
        },
        formatter: "{c}家"
      }
    },
    labelLine: {
      normal: {
        show: true
      }
    },
    data: [{
      name: "规上企业",
      value: 259
    }, {
      name: "规下企业",
      value: 1373
    }]
  }]
};
var colorArray = [{
    top: "#ffa800", //黄
    bottom: "rgba(11,42,84,.3)"
  },
  {
    top: "#1ace4a", //绿
    bottom: "rgba(11,42,84, 0.3)"
  },
  {
    top: "#4bf3ff", //蓝
    bottom: "rgba(11,42,84,.3)"
  },
  {
    top: "#4f9aff", //深蓝
    bottom: "rgba(11,42,84,.3)"
  },
  {
    top: "#b250ff", //粉
    bottom: "rgba(11,42,84,.3)"
  }
];

//  亩均效益分析
export const mjssOption = {
  tooltip: {
    show: true,
    formatter: "{b}:{c}"
  },
  grid: {
    top: "5%",
    left: "100px",
    bottom: "5%"
  },
  xAxis: {
    type: "value",
    show: false,
    position: "top",
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: "#65F5FD"
      }
    },
    splitLine: {
      show: false
    }
  },
  yAxis: [{
    type: "category",
    axisTick: {
      show: false,
      alignWithLabel: false,
      length: 5
    },
    splitLine: {
      //网格线
      show: false
    },
    inverse: "true", //排序
    axisLine: {
      show: false,
      lineStyle: {
        color: "#E4ECF9",
        fontSize: 14
      }
    },
    axisLabel: {
      fontSize: 14
    },
    data: [
      "100万/亩以上",
      "30-100万/亩",
      "15-30万/亩",
      "5-15万/亩",
      "5万/亩以下"
    ]
  }],
  series: [{
    name: "亩均",
    type: "bar",
    label: {
      normal: {
        show: true,
        position: "right",
        formatter: "{c} 家",
        textStyle: {
          color: "white", //color of value
          fontSize: 14
        }
      }
    },
    itemStyle: {
      normal: {
        show: true,
        color: function (params) {
          let num = colorArray.length;
          return {
            type: "linear",
            colorStops: [{
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              },
              {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              },
              {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              },
              {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              },
              {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              },
              {
                offset: 0,
                color: colorArray[params.dataIndex % num].bottom
              },
              {
                offset: 1,
                color: colorArray[params.dataIndex % num].top
              }
            ]
            //globalCoord: false
          };
        },
        barBorderRadius: 70,
        borderWidth: 0,
        borderColor: "#333"
      }
    },
    barWidth: 20,
    barGap: "0%",
    barCategoryGap: "10%",
    data: []
  }]
};

//  规上企业行业数量
export const hy1Option = {
  backgroundColor: "rgba(0,0,0,0)",
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "0%",
    right: "0%",
    top: "36px",
    bottom: "2%",
    containLabel: true
  },
  xAxis: {
    data: [], //横坐标
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      textStyle: {
        color: "#65F5FD",
        fontSize: 14
      }
    },
    axisLine: {
      lineStyle: {
        type: "solid",
        color: "#65F5FD",
        width: "1" //坐标线的宽度
      }
    }
  },
  yAxis: {
    splitLine: {
      show: true,
      lineStyle: {
        color: "#40A1EA", //网格横线颜色
        width: 1,
        type: "solid"
      }
    },
    axisLabel: {
      textStyle: {
        color: "#65F5FD",
        fontSize: 14 //坐标值得具体的颜色
      }
    },
    axisLine: {
      lineStyle: {
        type: "solid",
        color: "#65F5FD",
        width: "1" //坐标线的宽度
      }
    }
  },
  series: [{
    name: "数量",
    type: "bar",
    barWidth: 30,
    data: [], //数据
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#06B5D7"
          }, //柱图渐变色
          {
            offset: 0.5,
            color: "#44C0C1"
          }, //柱图渐变色
          {
            offset: 1,
            color: "#71C8B1"
          } //柱图渐变色
        ])
      },
      emphasis: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#71C8B1"
          }, //柱图高亮渐变色
          {
            offset: 0.7,
            color: "#44C0C1"
          }, //柱图高亮渐变色
          {
            offset: 1,
            color: "#06B5D7"
          } //柱图高亮渐变色
        ])
      }
    }
  }]
};

//  规上企业评价结果
export const jdOption = {
  color: ["#F52424", "#EC8221", "#2883F5", "#127B49"],
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
    data: ["A类", "B类", "C类", "D类"]
  },
  grid: {
    top: "12%",
    left: "100px",
    bottom: "3%"
  },
  yAxis: [{
    type: "category",
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      textStyle: {
        color: "#65F5FD",
        fontSize: 16
      }
    },
    splitArea: {
      show: false
    },
    data: [
    ]
  }],
  xAxis: [{
    show: false
  }],
  series: [{
      type: "bar",
      barGap: "-100%",
      barWidth: "50%",
      data: [100, 100, 100, 100, 100, 100, 100, 100, 100],
      itemStyle: {
        normal: {
          color: "rgba(119,136,153,0.4)"
        }
      },
      animation: false,
    },
    {
      name: "A类",
      type: "bar",
      stack: "广告",
      barWidth: "50%",
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              color: "#fff"
            },
            position: "inside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: []
    },
    {
      name: "B类",
      type: "bar",
      stack: "广告",
      barWidth: "50%",
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              color: "#fff"
            },
            position: "inside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: []
    },
    {
      name: "C类",
      type: "bar",
      stack: "广告",
      barWidth: "50%",
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              color: "#fff"
            },
            position: "inside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: []
    },
    {
      name: "D类",
      type: "bar",
      stack: "广告",
      barWidth: "50%",
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              color: "#fff"
            },
            position: "inside",
            formatter: function (p) {
              return p.value > 0 ? p.value : "";
            }
          }
        }
      },
      data: []
    }
  ]
};

//  街镇亩均税收
//  鹿城亩税直接给的数据
export const streetRank = {
  title: {
    // text: '2016年12月长宁区合规成本分析'
  },
  tooltip: {
    trigger: "axis",
    formatter: "{b} : {c} 万/亩",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: "0%",
    right: "2%",
    top: '50px',
    bottom: "2%",
    containLabel: true
  },
  calculable: true,
  xAxis: [{
    type: "category",
    axisLabel: {
      interval: 0,
      textStyle: {
        fontSize: 14,
        color: "#E3EEF1"
      },
      //rotate: 15,
      margin: 10,
      align: "center",
      formatter: function (value) {
        return value.split("").join("\n");
      },
      interval: 0
    },
    axisLine: {
      lineStyle: {
        color: "#00A2FF",
        width: 1
      }
    },
    axisTick: {
      show: false
    },
    data: ["滨江","南郊","丰门","山福","蒲鞋市","双屿","松台","仰义","藤桥","广化","七都"]
  }],
  yAxis: [{
    name: "万元/亩",
    nameTextStyle: {
      color: "#FFF"
    },
    type: "value",
    axisLabel: {
      formatter: "{value}",
      color: "#FFF",
      fontSize: 14
    },
    axisLine: {
      lineStyle: {
        color: "rgba(55,113,183,0.6)"
      }
    },
    splitLine: {
      lineStyle: {
        // type: "dashed",
        color: "rgba(55,113,183,0.4)"
      }
    }
  }],
  series: [{
    name: "亩均税收",
    type: "bar",
    barWidth: 24, //柱子宽度
    barGap: 2, //柱子之间间距
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "#00CAE0"
          },
          {
            offset: 1,
            color: "#006EFB"
          }
        ])
      }
    },
    data: [53.31,48.24,47.64,38.24,36.77,33.16,29.93,28.44,26.38,16.06,9.44]
  }]
};