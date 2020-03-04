import echarts from "echarts";
const backgroundColor = "rgba(0,0,0,0)";
var scaleData = [
  {
    name: "正在规划",
    value: 10
  },
  {
    name: "已招商落地",
    value: 20
  },
  {
    name: "已维修",
    value: 20
  },
  {
    name: "正在拆迁",
    value: 27
  }
];
var rich = {
  white: {
    color: "#ddd",
    align: "center",
    padding: [3, 0]
  }
};
var placeHolderStyle = {
  normal: {
    label: {
      show: false
    },
    labelLine: {
      show: false
    },
    color: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(0, 0, 0, 0)",
    borderWidth: 0
  }
};
var data = [];
for (var i = 0; i < scaleData.length; i++) {
  data.push(
    {
      value: scaleData[i].value,
      name: scaleData[i].name,
      itemStyle: {
        normal: {
          borderWidth: 5,
          shadowBlur: 30,
          borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: "#7777eb"
            },
            {
              offset: 1,
              color: "#70ffac"
            }
          ]),
          shadowColor: "rgba(142, 152, 241, 0.6)"
        }
      }
    },
    {
      value: 4,
      name: "",
      itemStyle: placeHolderStyle
    }
  );
}
var seriesObj = [
  {
    name: "",
    type: "pie",
    clockWise: false,
    radius: [45, 50],
    hoverAnimation: false,
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: "left",
          color: "#ddd",
          fontSize: 12,
          formatter: function (params) {
            var percent = 0;
            var total = 0;
            for (var i = 0; i < scaleData.length; i++) {
              total += scaleData[i].value;
            }
            percent = ((params.value / total) * 100).toFixed(0);
            if (params.name !== "") {
              return params.name + "\n{white|" + "占比" + percent + "%}";
            } else {
              return "";
            }
          },
          rich: rich
        },
        labelLine: {
          show: false
        }
      }
    },
    data: data
  }
];
//  招商进度分布
export const canvassProgessOption = {
  backgroundColor,
  tooltip: {
    show: false
  },
  legend: {
    show: false
  },
  toolbox: {
    show: false
  },
  series: seriesObj
};

//  招商投资额分布
export const canvssInvestoption = {
  backgroundColor,
  grid: {
    top: "5%"
  },
  legend: {
    data: ["投资额"],
    top: "5%",
    right: "10%",
    textStyle: {
      color: "#fff",
      fontSize: 16
    }
  },
  xAxis: {
    data: ["5亿元以下", "5-10亿元", "10-15亿元", "15-20亿元", "20亿元以上"], //横坐标
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: "#fff",
        fontSize: 14
      }
    },
    axisLine: {
      lineStyle: {
        type: "solid",
        color: "#fff",
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
        color: "#fff",
        fontSize: 14 //坐标值得具体的颜色
      }
    },
    axisLine: {
      show: false
    }
  },
  series: [
    {
      name: "投资额",
      type: "bar",
      barWidth: 30,
      data: [30, 50, 26, 60, 26], //数据
      itemStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#06B5D7" }, //柱图渐变色
            { offset: 0.5, color: "#44C0C1" }, //柱图渐变色
            { offset: 1, color: "#71C8B1" } //柱图渐变色
          ])
        },
        emphasis: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#71C8B1" }, //柱图高亮渐变色
            { offset: 0.7, color: "#44C0C1" }, //柱图高亮渐变色
            { offset: 1, color: "#06B5D7" } //柱图高亮渐变色
          ])
        }
      }
    }
  ]
};

//  招商用地类型分布
export const canvassKindOption = {
  backgroundColor,
  grid: {
    top: '15%',
    right: '10%',
    left: '10%',
    bottom: '12%'
  },
  xAxis: [{
    type: 'category',
    color: '#fff',
    data: ['住宅', '商业', '生产', '综合', '物流', '其他'],
    axisPointer: {
      type: 'line'
    },
    axisLine: {
      lineStyle: {
        color: '#272456'
      }
    },
    axisLabel: {
      color: '#fff',
      textStyle: {
        fontSize: 12
      },
    },
  }],
  yAxis: [{
    min: 0,
    max: 100,
    axisLabel: {
      formatter: '{value}%',
      color: '#fff',
    },
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#272456'
      }
    }
  }],
  series: [{
    type: 'bar',
    data: [100, 90, 10, 90, 90, 20],
    barWidth: '20px',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#41E1D4' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#10A7DB' // 100% 处的颜色
        }], false),
        barBorderRadius: [30, 30, 0, 0],
        shadowColor: 'rgba(0,255,225,1)',
        shadowBlur: 4,
      }
    }
  }]
};

//招商类型 _left
var colorList = ['#afa3f5', '#00d488', '#3feed4', '#3bafff', '#f1bb4c', "rgba(250,250,250,0.5)"];
/*var sportsIcon = {
    'a':'/asset/get/s/data-1559121268278-ozjd-lXoz.png',
    'b':'/asset/get/s/data-1559121263841-UC5w7mTJ9.png',
    'c':'/asset/get/s/data-1559121259198-sxyPSimU9.png',
    'd':'/asset/get/s/data-1559121254241-xj5JAIBzC.png',
    'e':'/asset/get/s/data-1559121249274-QxHDAdQGy.png',
};*/
export const _leftchartOption = {
  grid: {
    bottom: 90,
    left: 0,
    right: '10%'
  },
  legend: {
    show: false,
    orient: 'vertical',
    top: "middle",
    right: "5%",
    textStyle: {
      color: '#ffffff',
      fontSize: 25,
    },
    icon: 'roundRect'
  },
  series: [
    // 主要展示层的
    {
      radius: ['25%', '51%'],
      center: ['50%', '60%'],
      type: 'pie',
      itemStyle: {
        normal: {
          color: function (params) {
            return colorList[params.dataIndex]
          }
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 15,
          length2: 90,
          lineStyle: {
            color: '#d3d3d3'
          },
          align: 'right'
        },
        color: "#000",
        emphasis: {
          show: true
        }
      },
      label: {
        normal: {
          formatter: function (params) {
            var str = '';
            switch (params.name) {
              case '体育技能': str = '{a|}\n{nameStyle|体育技能 }' + '{rate|' + params.value + '%}'; break;
              case '体育行为': str = '{b|}\n{nameStyle|体育行为 }' + '{rate|' + params.value + '%}'; break;
              case '体质健康': str = '{c|}\n{nameStyle|体质健康 }' + '{rate|' + params.value + '%}'; break;
              case '体育意识': str = '{d|}\n{nameStyle|体育意识 }' + '{rate|' + params.value + '%}'; break;
              case '体育知识': str = '{e|}\n{nameStyle|体育知识 }' + '{rate|' + params.value + '%}'; break;
            }
            return str
          },
          padding: [0, -110],
          height: 165,
          rich: {
            a: {
              width: 38,
              height: 38,
              lineHeight: 50,
              /*backgroundColor: {
                  image: sportsIcon.e
              },
              align: 'left'*/
            },
            b: {
              width: 29,
              height: 45,
              lineHeight: 50,
              /* backgroundColor: {
                   image: sportsIcon.d
               },
               align: 'left'*/
            },
            c: {
              width: 34,
              height: 33,
              lineHeight: 50,
              /*backgroundColor: {
                  image: sportsIcon.c
              },
              align: 'left'*/
            },
            d: {
              width: 34,
              height: 44,
              lineHeight: 50,
              /*backgroundColor: {
                  image: sportsIcon.b
              },
              align: 'left'*/
            },
            e: {
              width: 38,
              height: 30,
              lineHeight: 50,
              /*backgroundColor: {
                  image: sportsIcon.a
              },
              align: 'left'*/
            },
            nameStyle: {
              fontSize: 16,
              color: "#fff",
              align: 'left'
            },
            rate: {
              fontSize: 20,
              color: "#1ab4b8",
              align: 'left'
            }
          }
        }
      },
      data: [
        {
          value: 17,
          name: '体育技能',
        },
        { value: 23, name: '体育行为' },
        { value: 27, name: '体质健康' },
        { value: 33, name: '体育意识' },
        { value: 9, name: '体育知识' }],
    },
    // 边框的设置
    {
      radius: ['47%', '51%'],
      center: ['50%', '60%'],
      type: 'pie',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      animation: false,
      tooltip: {
        show: false
      },
      itemStyle: {
        normal: {
          color: 'rgba(250,250,250,0.5)'
        }
      },
      data: [{
        value: 1,
      }],
    }
  ]

}
//楼宇招商类型分布 _right
export const _rightchartOption = {
  color: ["#ed9d3c", '#4fd7fd'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['系统外部', '系统内部'],
    textStyle: {
      fontSize: '12',
      color: '#fff'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['K4310', 'K43102', 'K52001', 'H2021', 'H2021'],
      axisLabel: {
        textStyle: {
          fontSize: '12',
          color: '#fff'
        }
      },
    }
  ],
  yAxis: [
    {
      type: 'value',
      minInterval: 100,//设置左侧Y轴最小刻度
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(135,140,147,0.8)'
        }
      },//设置横线样式
      axisLabel: {
        textStyle: {
          fontSize: '12',
          color: '#fff'
        }
      },
    }
  ],
  series: [
    {
      name: '系统外部',
      type: 'bar',
      stack: '排名',
      data: [120, 132, 101, 134, 90],
      barWidth: 8
    },
    {
      name: '系统内部',
      type: 'bar',
      stack: '排名',
      data: [220, 182, 191, 234, 290],
      barWidth: 8,
      itemStyle: {
        normal: {
          barBorderRadius: [30, 30, 0, 0],
        }
      }
    },
  ]
}
//楼宇招商面积分布
const datas = []

for (let i = 0; i < 3; i++) {
  datas.push([{
    'name': '100㎡以下',
    'value': 20
  }, {
    'name': '100-150㎡',
    'value': 20
  }, {
    'name': '150-200㎡',
    'value': 20
  }, {
    'name': '200-250㎡',
    'value': 20
  }, {
    'name': '250㎡以上',
    'value': 20
  }])
}

const areacolorList = [
  ['#0589f8', '#fad502', '#ff5275', '#926ed8', '#3bb369'],
  ['#003689', '#64592b', '#632258', '#3d317d', '#1c5157'],
  ['#071254', '#201b3b', '#1e104b', '#141253', '#091a46']
]

for (let i = 0; i < datas.length; i++) {
  for (let j = 0; j < datas[i].length; j++) {
    datas[i][j]['itemStyle'] = {
      'color': areacolorList[i][j]
    }
  }
}
export const areaOption = {
  series: [{
    center: ['50%', '50%'],
    radius: ['50%', '60%'],
    type: 'pie',
    label: {
      normal: {
        show: true,
        formatter: "{b}：{c}%",
        textStyle: {
          fontSize: 14,

        },
        position: 'outside'
      },
      emphasis: {
        show: true
      }
    },
    labelLine: {
      normal: {
        show: false,
        // length: 30,
        // length2: 35
      },
      emphasis: {
        show: false
      }
    },
    data: datas[0]

  }, {
    type: 'pie',
    hoverAnimation: false,
    center: ['50%', '50%'],
    radius: ['40%', '50%'],
    label: {
      normal: {
        show: false
      }
    },
    data: datas[1]
  }, {
    type: 'pie',
    hoverAnimation: false,
    center: ['50%', '50%'],
    radius: ['30%', '40%'],
    label: {
      normal: {
        show: false
      }
    },
    data: datas[2]
  }]
}
//招商政策
export const zszcOption = {
  tooltip: {
    show: true
  },
  series: [
    {
      name: "热点分析",
      type: "wordCloud",
      textPadding: 0,
      autoSize: {
        enable: true,
        minSize: 6
      },
      textStyle: {
        normal: {
          color: function() {
            return (
              "rgb(" +
              [
                Math.round(Math.random() * 105) + 150,
                Math.round(Math.random() * 105) + 150,
                Math.round(Math.random() * 105) + 150
              ].join(",") +
              ")"
            );
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: "#333"
        }
      },
        data: [{
            name: '产业优惠政策',
            value: 40,
        }, {
            name: '人才保障政策',
            value: 61
        }, {
            name: '行政服务政策',
            value: 43
        }, {
            name: '项目用地政策',
            value: 40
        }, {
            name: '企业帮扶政策',
            value: 24
        }, {
            name: '财税配套政策',
            value: 22
        }, {
            name: '浙江经济政策',
            value: 18
        }, {
            name: '财税配套政策',
            value: 14
        }, {
            name: '人才保障政策',
            value: 11
        }, {
            name: '行政服务政策',
            value: 46
        }, {
            name: '项目用地政策',
            value: 34
        }, {
            name: '企业帮扶政策',
            value: 10
        }, {
            name: '财税配套政策',
            value: 9
        }, {
            name: '浙江经济政策',
            value: 5
        }, {
            name: '财税配套政策',
            value: 4
        }, {
            name: '人才保障政策',
            value: 3
        }, {
            name: '行政服务政策',
            value: 6
        }, {
            name: '项目用地政策',
            value: 8
        }, {
            name: '企业帮扶政策',
            value: 7
        }, {
            name: '项目用地政策',
            value: 6
        },{
          name: '产业优惠政策',
          value: 4,
      }, {
          name: '人才保障政策',
          value: 6
      }, {
          name: '行政服务政策',
          value: 3
      }, {
          name: '项目用地政策',
          value: 4
      }, {
          name: '企业帮扶政策',
          value: 4
      }, {
          name: '财税配套政策',
          value: 2
      }, {
          name: '浙江经济政策',
          value: 8
      }, {
          name: '财税配套政策',
          value: 1
      }, {
          name: '人才保障政策',
          value: 1
      }, {
          name: '行政服务政策',
          value: 6
      }, {
          name: '项目用地政策',
          value: 4
      }, {
          name: '企业帮扶政策',
          value: 8
      }, {
          name: '财税配套政策',
          value: 5
      }, {
          name: '浙江经济政策',
          value: 5
      }, {
          name: '财税配套政策',
          value: 4
      }, {
          name: '人才保障政策',
          value: 6
      }, {
          name: '行政服务政策',
          value: 6
      }, {
          name: '项目用地政策',
          value: 8
      }, {
          name: '企业帮扶政策',
          value: 7
      }, {
          name: '项目用地政策',
          value: 2
      }]
    }]
}
