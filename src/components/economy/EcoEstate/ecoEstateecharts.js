export const option1 = {
  backgroundColor: "",
  title: {
    text: "",
    left: "center",
    top: 20,
    textStyle: {
      color: "#ccc"
    }
  },
  grid: {
    left: "0",
    right: "0",
    bottom: "0",
    top: "0",
    height: "100%",
    containLabel: true,
    z: 22
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} ({d}%)"
  },

  visualMap: {
    show: false,
    min: 100,
    max: 100,
    inRange: {
      //colorLightness: [0, 1]
    }
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: [20, 50],
      center: ["50%", "50%"],
      color: ["rgb(131,249,103)", "#FBFE27", "#FE5050", "#1DB7E5"], //'#FBFE27','rgb(11,228,96)','#FE5050'
      data: [
        {
          value: 285,
          name: "鞋业"
        },
        {
          value: 410,
          name: "制造"
        },
        {
          value: 274,
          name: "汽车"
        },
        {
          value: 235,
          name: "电子"
        },
        {
          value: 435,
          name: "化工"
        },
        {
          value: 115,
          name: "金属"
        }
      ].sort(function(a, b) {
        return a.value - b.value;
      }),
      roseType: "radius",

      label: {
        normal: {
          formatter: ["{c|{c}}", "{b|{b}}"].join("\n"),
          rich: {
            c: {
              color: "rgb(241,246,104)",
              fontSize: 16,
              fontWeight: "bold",
              lineHeight: 5
            },
            b: {
              color: "rgb(98,137,169)",
              fontSize: 12,
              height: 40
            }
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: "rgb(98,137,169)"
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        }
      },
      itemStyle: {
        normal: {
          shadowColor: "rgba(0, 0, 0, 0.8)",
          shadowBlur: 50
        }
      }
    }
  ]
};

export const option2 = {
  backgroundColor: "",
  title: {
    text: "",
    left: "center",
    top: 20,
    textStyle: {
      color: "#ccc"
    }
  },
  grid: {
    left: "0",
    right: "0",
    bottom: "0",
    top: "0",
    height: "100%",
    containLabel: true,
    z: 22
  },

  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} ({d}%)"
  },

  visualMap: {
    show: false,
    min: 100,
    max: 100,
    inRange: {
      //colorLightness: [0, 1]
    }
  },
  series: [
    {
      name: "访问来源",
      type: "pie",
      radius: [20, 50],
      center: ["50%", "50%"],
      color: ["rgb(131,249,103)", "#FBFE27", "#FE5050", "#1DB7E5"], //'#FBFE27','rgb(11,228,96)','#FE5050'
      data: [
        {
          value: 155,
          name: "第一产业"
        },
        {
          value: 135,
          name: "第二产业"
        },
        {
          value: 115,
          name: "第三产业"
        }
      ].sort(function(a, b) {
        return a.value - b.value;
      }),
      roseType: "radius",

      label: {
        normal: {
          formatter: ["{c|{c}}", "{b|{b}}"].join("\n"),
          rich: {
            c: {
              color: "rgb(241,246,104)",
              fontSize: 16,
              fontWeight: "bold",
              lineHeight: 5
            },
            b: {
              color: "rgb(98,137,169)",
              fontSize: 12,
              height: 40
            }
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: "rgb(98,137,169)"
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        }
      },
      itemStyle: {
        normal: {
          shadowColor: "rgba(0, 0, 0, 0.8)",
          shadowBlur: 50
        }
      }
    }
  ]
};

var data = [
  {
    company: "A类",
    value: 2500,
    ratio: 14.89
  },
  {
    company: "B类",
    value: 2800,
    ratio: 79.49
  },
  {
    company: "C类",
    value: 3000,
    ratio: 75.8
  },
  {
    company: "D类",
    value: 2600,
    ratio: 19.8
  }
];
var xData = [],
  yData = [];
data.map(function(a, b) {
  xData.push(a.company);
  if (a.value === 0) {
    yData.push(a.value);
  } else {
    yData.push(a.value);
  }
});
export const option3 = {
  backgroundColor: "",
  color: ["#3398DB"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "line",
      lineStyle: {
        opacity: 0
      }
    }
  },
  legend: {
    show: false
  },
  grid: {
    left: "0",
    right: "0",
    bottom: "0",
    top: "0",
    height: "100%",
    containLabel: true,
    z: 22
  },
  xAxis: [
    {
      type: "category",
      data: xData,
      axisLine: {
        show: false
      },
      axisLabel: {
        show: true,
        color: "rgb(170,170,170)",
        fontSize: 14
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      name: "",
      nameTextStyle: {
        color: "rgb(170,170,170)"
      },
      gridIndex: 0,
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    {
      type: "value",
      gridIndex: 0,
      splitNumber: 12,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitArea: {
        show: false
      }
    }
  ],
  series: [
    {
      name: "合格率",
      type: "bar",
      barWidth: "50%",
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          barBorderRadius: 0
        }
      },
      data: yData,
      zlevel: 11
    },
    {
      name: "背景",
      type: "bar",
      barWidth: "50%",
      xAxisIndex: 0,
      yAxisIndex: 1,
      barGap: "-100%",
      data: [100, 100, 100, 100],
      itemStyle: {
        normal: {
          color: "rgba(255,255,255,0.1)"
        }
      },
      zlevel: 9
    }
  ]
};
