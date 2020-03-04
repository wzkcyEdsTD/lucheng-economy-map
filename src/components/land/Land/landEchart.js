import echarts from "echarts";
import $ from "jquery";
export const acrgeneralOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '4%',
        top: '6%',
        containLabel: true
    },
    legend: {
        data: ['1', '2'],
        right: 10,
        top: 12,
        textStyle: {
            color: "#fff"
        },
        itemWidth: 12,
        itemHeight: 10,
        // itemGap: 35
    },
    xAxis: {
        type: 'category',
        data: ['批而未供', '供而未用', '用而未尽', '尽而未投', '投而未达'],
        axisLine: {
            lineStyle: {
                color: 'white'

            }
        },
        axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
                fontFamily: 'Microsoft YaHei'
            }
        },
    },

    yAxis: {
        type: 'value',
        max: '1200',
        axisLine: {
            show: false,
            lineStyle: {
                color: 'white'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(255,255,255,0.3)'
            }
        },
        axisLabel: {},
        axisTick: {
            show: false
        }
    },
    /*"dataZoom": [{
      "show": true,
      "height": 12,
      "xAxisIndex": [
        0
      ],
      bottom:'8%',
      "start": 10,
      "end": 90,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle:{
        color:"#d3dee5",

      },
      textStyle:{
        color:"#fff"},
      borderColor:"#90979c"
    }, {
      "type": "inside",
      "show": true,
      "height": 15,
      "start": 1,
      "end": 35
    }],*/
    series: [{
            name: '1',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#fccb05'
                    }, {
                        offset: 1,
                        color: '#f5804d'
                    }]),
                    barBorderRadius: 12,
                },
            },
            data: [400, 400, 300, 300, 300]
        },
        {
            name: '2',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#8bd46e'
                    }, {
                        offset: 1,
                        color: '#09bcb7'
                    }]),
                    barBorderRadius: 11,
                }

            },
            data: [400, 500, 500, 500, 500]
        }
    ]
}

/**
 * 亩均效益分析
 */
var colorArray = [{
        top: '#ffa800', //黄
        bottom: 'rgba(11,42,84,.3)'
    }, {
        top: '#1ace4a', //绿
        bottom: 'rgba(11,42,84, 0.3)'
    },
    {
        top: '#4bf3ff', //蓝
        bottom: 'rgba(11,42,84,.3)'
    }, {
        top: '#4f9aff', //深蓝
        bottom: 'rgba(11,42,84,.3)'
    },
    {
        top: '#b250ff', //粉
        bottom: 'rgba(11,42,84,.3)'
    }
];
export const arccompanyOption = {
    tooltip: {
      show: true,
      formatter: "{b}:{c}"
    },
    grid: {
      left: "5%",
      top: "12%",
      right: "1%",
      bottom: "8%",
      containLabel: true
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
          color: "#fff"
        }
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
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
            color: "#fff"
          }
        },
        data: [
          "100万/亩以上",
          "40-100万/亩",
          "10-40万/亩",
          "5-10万/亩",
          "5万/亩以下"
        ]
      }
    ],
    series: [
      {
        name: "能耗值",
        type: "bar",
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{c}",
            textStyle: {
              color: "white" //color of value
            }
          }
        },
        itemStyle: {
          normal: {
            show: true,
            color: function(params) {
              let num = colorArray.length;
              return {
                type: "linear",
                colorStops: [
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
        barGap: "0%",
        barCategoryGap: "50%",
        data: [48, 120, 352, 87, 60]
      }
    ]
  };

/**
 * 用地整治达标情况
 */
export const loanOption = {
    tooltip: {
        formatter: "{a} <br/>{c} {b}"
    },
    series: [{
            name: '速度',
            type: 'gauge',
            min: 0,
            max: 220,
            splitNumber: 11,
            radius: '100%',
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.09, 'lime'],
                        [0.82, '#1e90ff'],
                        [1, '#ff4500']
                    ],
                    width: 3,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: { // 坐标轴小标记
                "show": false
            },
            axisTick: { // 坐标轴小标记
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: { // 分隔线
                length: 25, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: { // 分隔线
                shadowColor: '#fff', //默认透明
                shadowBlur: 5
            },
            title: {
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '50%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff',
                    fontSize: 12
                },
                formatter: "现已完成{value}%"
            },
            data: [{
                value: 58
            }]
        }

    ]
}

/**
 * 用地性质分布
 */
export const typeOption = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        data: ['商用', '工业', '居住', '其它'],
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
            color: '#FFF'
        }
    }],
    yAxis: [{
        name: '亩',
        type: 'value',
        axisLabel: {
            color: '#FFF'
        },
        axisLine: {
            color: '#FFF'
        }
    }],
    series: [{
        type: 'bar',
        barWidth: '60%',
        data: [1000, 2552, 4000, 3000]
    }]
}

/**
 * 各街镇用地情况
 */
export const streetOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        textStyle: {
            color: "#fff"
        },
        data: ['工业', '居住', '商务', '其它', '低效用地']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [{
        type: 'category',
        "axisLine": {
            show: false
        },
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "interval": 0,
            color: '#FFF'
        },
        "splitArea": {
            "show": false
        },
        data: ['滨江', '仰义', '五马', '大南', '双屿', '丰门', '七都']
    }],
    xAxis: [{
        show: false
    }],
    series: [{
            name: '工业',
            type: 'bar',
            stack: '广告',
            "itemStyle": {
                "normal": {
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "insideTop",
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: [320, 332, 301, 334, 390, 330, 320],

        },
        {
            name: '居住',
            type: 'bar',
            stack: '广告',
            "itemStyle": {
                "normal": {
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "insideTop",
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '商务',
            type: 'bar',
            stack: '广告',
            "itemStyle": {
                "normal": {
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "insideTop",
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '其它',
            type: 'bar',
            stack: '广告',
            "itemStyle": {
                "normal": {
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "insideTop",
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '低效用地',
            type: 'bar',
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#41E1D4' // 0% 处的颜色
                    }, {
                        offset: 1,
                        color: '#10A7DB' // 100% 处的颜色
                    }], false),
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "right",
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    },
                    barBorderRadius: [30, 30, 30, 30],
                    barWidth: 20,
                    shadowColor: 'rgba(0,255,225,1)',
                    shadowBlur: 3,
                }
            },
        }
    ]
}

/**
 * 行业分布类型
 */
var data = [{
    'name': '其他',
    'value': 2.41
}, {
    'name': '汽配业',
    'value': 3.61
}, {
    'name': '汽配业',
    'value': 3.61
}, {
    'name': '纺织业',
    'value': 13.25
}, {
    'name': '电子业',
    'value': 14.46
}, {
    'name': '鞋服业',
    'value': 28.92
}, {
    'name': '化工业',
    'value': 31.33
}, {
    'name': '制造业',
    'value': 2.41
}]
var colorList = ['#1c32d5', '#3974d8', '#9e9edf', '#834ff9', '#3429a9', '#d7adf9', '#6ddcf8', '#7fbff0']

$.each(data, function (i, el) {
    el['itemStyle'] = {
        'color': colorList[i]
    }
})
export const incomeOption = {
    series: [{
        radius: ['40%', '61%'],
        center: ['50%', '50%'],
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
                show: true,
                length: 15,
                length2: 25
            },
            emphasis: {
                show: true
            }
        },
        data: data

    }, {
        // 外边框
        type: 'pie',
        hoverAnimation: false,
        center: ['50%', '50%'],
        radius: ['65%', '65%'],
        label: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 9,
            itemStyle: {
                normal: {
                    borderWidth: 2,
                    borderColor: '#0b5263'
                }
            }
        }]
    }, {
        // 内边框'
        type: 'pie',
        hoverAnimation: false,
        center: ['50%', '50%'],
        radius: ['35%', '35%'],
        label: {
            normal: {
                show: false
            }
        },
        data: [{
            value: 9,
            itemStyle: {
                normal: {
                    borderWidth: 2,
                    borderColor: '#0b5263'
                }
            }
        }]
    }]

}