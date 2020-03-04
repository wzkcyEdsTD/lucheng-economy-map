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

//街镇楼宇面积排名
export const areaOption = {
  color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
  grid: {
    left: -100,
    top: 50,
    bottom: 10,
    right: 10,
    containLabel: true
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} ({d}%)"
  },
  legend: {
    type: "scroll",
    orient: "vartical",
    // x: "right",
    top: "center",
    right: "15",
    // bottom: "0%",
    itemWidth: 16,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: "#A3E2F4",
      fontSize: 12,
      fontWeight: 0
    },
    data: streeData
  },
  polar: {},
  angleAxis: {
    interval: 1,
    type: "category",
    data: [],
    z: 10,
    axisLine: {
      show: false,
      lineStyle: {
        color: "#0B4A6B",
        width: 1,
        type: "solid"
      }
    },
    axisLabel: {
      interval: 0,
      show: true,
      color: "#0B4A6B",
      margin: 8,
      fontSize: 16
    }
  },
  radiusAxis: {
    min: 40,
    max: 120,
    interval: 20,
    axisLine: {
      show: false,
      lineStyle: {
        color: "#0B3E5E",
        width: 1,
        type: "solid"
      }
    },
    axisLabel: {
      formatter: "{value} %",
      show: false,
      padding: [0, 0, 20, 0],
      color: "#0B3E5E",
      fontSize: 16
    },
    splitLine: {
      lineStyle: {
        color: "#0B3E5E",
        width: 2,
        type: "solid"
      }
    }
  },
  calculable: true,
  series: [
    {
      type: "pie",
      radius: ["5%", "10%"],
      hoverAnimation: false,
      labelLine: {
        normal: {
          show: false,
          length: 10,
          length2: 35
        },
        emphasis: {
          show: false
        }
      },
      data: [
        {
          name: "",
          value: 0,
          itemStyle: {
            normal: {
              color: "#0B4A6B"
            }
          }
        }
      ]
    },
    {
      type: "pie",
      radius: ["90%", "95%"],
      hoverAnimation: false,
      labelLine: {
        normal: {
          show: false,
          length: 30,
          length2: 55
        },
        emphasis: {
          show: false
        }
      },
      name: "",
      data: [
        {
          name: "",
          value: 0,
          itemStyle: {
            normal: {
              color: "#0B4A6B"
            }
          }
        }
      ]
    },
    {
      stack: "a",
      type: "pie",
      radius: ["20%", "80%"],
      roseType: "area",
      zlevel: 10,
      label: {
        normal: {
          show: true,
          formatter: "{c}",
          textStyle: {
            fontSize: 12
          },
          position: "outside"
        },
        emphasis: {
          show: true
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 10,
          length2: 15
        },
        emphasis: {
          show: false
        }
      },
      data: [
        {
          value: 10,
          name: "山福镇"
        },
        {
          value: 5,
          name: "藤桥镇"
        },
        {
          value: 15,
          name: "仰义街道"
        },
        {
          value: 25,
          name: "丰门街道"
        },
        {
          value: 20,
          name: "双屿街道"
        },
        {
          value: 35,
          name: "广化街道"
        }
      ]
    }
  ]
};

export const zsOption = {
  tooltip: {
    show: true
  },
  "animation": true,
  "legend": {
    "width": "100%",
    "left": "0",
    "textStyle": {
      "color": "#fff",
      "fontSize": 12
    },
    "icon":"square",
    "right": "0",
    "bottom": "0",
    "itemGap": 5,
    "data": ["集聚一批", "规划一批", "建设一批", "招商一批", "培育一批"]
  },
  "series": [{
    "type": "pie",
    "center": ["50%", "50%"],
    "radius": ["40%", "53%"],
    "color": ["#0589F8FF", "#FF5275FF", "#926ED8FF", "#3BB369FF", "#FDB900FF"],
    "startAngle": 135,

    "data": [{
      "name": "集聚一批",
      "value": 5
    }, {
      "name": "规划一批",
      "value": 6
    }, {
      "name": "建设一批",
      "value": 5
    }, {
      "name": "招商一批",
      "value": 10
    }, {
      "name": "培育一批",
      "value": 30
    }]
  }]
};
//经济分布
export const ecoOption = {
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
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
    axisLine: {
      lineStyle: {
        color: "#69E1FF"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#69E1FF"
      }
    }
  },
  yAxis: {
    type: "category",
    data: ["2k-5k", "5k-8k", "8k-10k", "亿元以上"],
    axisLine: {
      lineStyle: {
        color: "#69E1FF"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#69E1FF"
      }
    }
  },
  series: [
    {
      name: "楼宇",
      type: "bar",
      itemStyle: {
        normal: {
          color: function (params) {
            var colorList = [
              "#2eddc1",
              "#FCCE10",
              "#E87C25",
              "#27727B",
              "#9efdc6",
              "#f27C99",
              "#a27C99",
              "#27727B"
            ];
            return colorList[params.dataIndex];
          },
          label: {
            show: true,
            position: "inside",
            formatter: "{c}幢"
          }
        }
      },
      data: [11, 6, 3, 3]
    }
  ]
};

