import echarts from 'echarts'
/**
 * center底部echarts数据
 */
export const option1={
    color: ['#FF8352', '#E271DE', '#00FFFF', '#4AEAB0', '#31C5C0', '#1E9BD1', '#009D85'],
    // backgroundColor: '#012A5C',
    title: {
      text: '滨江街道',
      textStyle: {
          color: '#f2f2f2',
          fontSize: 15,
          align: 'center'
      },
      subtextStyle: {
          fontSize: 30,
          color: ['#ff9d19']
      },
      x: 'center',
      y: 'center',
    },
    grid: {
      bottom: 150,
      left: 100,
      right: '10%'
    },
    series: [
      // 主要展示层的
      {
        radius: ['30%', '61%'],
        center: ['50%', '50%'],
        type: 'pie',
        label: {
          normal: {
            show: false,
            formatter: "{c}次",
            textStyle: {
              fontSize: 30,

            },
          },
          emphasis: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: true,
            length: 30,
            length2: 55
          },
          emphasis: {
            show: true
          }
        },
        name: "信息统计",
        data: [{
            'name': 'TV',
            'value': 675
          }, {
              'name': '盒子高级版',
              'value': 1397
          }, {
              'name': '盒子基础版',
              'value': 318
          }, {
              'name': 'APP',
              'value': 101
          }, {
              'name': '小程序',
              'value': 110
          }, {
              'name': 'iPad',
              'value': 111
          }, {
            'name': 'PC',
            'value': 110
        }],
      },
    ]
}
let data = {
    "chart": [{
            month: "5月",
            value: 138,
            ratio: 14.89
        },

        {
            month: "6月",
            value: 114,
            ratio: 79.49
        },

        {
            month: "7月",
            value: 714,
            ratio: 75.8
        },

        {
            month: "8月",
            value: 442,
            ratio: 19.8
        },

        {
            month: "9月",
            value: 622,
            ratio: 44.5
        },


        {
            month: "10月",
            value: 528,
            ratio: 87.3
        }

    ]
}

//  x轴数据          象形柱图数据  折线图数据
let xAxisMonth = [],
    barData=[],
    lineData=[];
    // barData = [{"name":"5月","value":"138"},{"name":"6月","value":"114"},{"name":"7月","value":"714"},{"name":"8月","value":"442"},{"name":"9月","value":"662"},{"name":"10月","value":"528"}],
    // lineData = [{"name":"5月","value":"14.89"},{"name":"6月","value":"79.89"},{"name":"7月","value":"74.8"},{"name":"8月","value":"79.8"},{"name":"9月","value":"44.5"},{"name":"10月","value":"83"}];
for (let i = 0; i < data.chart.length; i++) {
    xAxisMonth.push(data.chart[i].month);
    barData.push({
        "name": xAxisMonth[i],
        "value": data.chart[i].value
    });
    lineData.push({
        "name": xAxisMonth[i],
        "value": data.chart[i].ratio
    });
}

export const option2={
    // backgroundColor: "#020d22",
    title: '',
    grid: {
        top: '24%',
        left: '7%',
        bottom: '6%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'none'
        },
        formatter: function(params) {
            return params[0]["data"].name + "<br/>" + '参训人次: ' + params[1]["data"].value + "<br/>" + '合格率: ' + params[0]["data"].value;
        }
    },
    xAxis: [{
            type: 'category',
            show: false,
            data: ['3月', '4月', '5月', '6月', '7月', '8月'],
            axisLabel: {
                textStyle: {
                    color: '#b6b5ab'
                }
            }
        },
        {
            type: 'category',
            position: "bottom",
            data: xAxisMonth,
            boundaryGap: true,
            // offset: 40,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#b6b5ab'
                }
            }
        }

    ],
    yAxis: [{
        show: true,
        offset: 52,
        splitLine: {
            show: false,
            lineStyle: {
                color: "rgba(255,255,255,0.2)"
            }
        },
        axisTick: {
            show: false
        },
        axisLine: {
            show: true
        },
        axisLabel: {
            show: true,
            color: '#b6b5ab'
        }
    }, {
        show: false,
        type: "value",
        name: "合格率(%)",
        nameTextStyle: {
            color: '#ccc'
        },
        axisLabel: {
            color: '#ccc'
        },
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        }
    }],
    color: ['#e54035'],
    series: [{
            name: '参训人次',
            type: 'pictorialBar',
            xAxisIndex: 1,
            barCategoryGap: '-80%',
            // barCategoryGap: '-5%',
            symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
            itemStyle: {
                normal: {
                    color: function(params) {
                        let colorList = [
                            'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                            'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                            'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)'
                        ];
                        return colorList[params.dataIndex];
                    }
                },
                emphasis: {
                    opacity: 1
                }
            },
            data: barData,
        },
        {
            symbol: 'image://data:image/png;base64,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',
            symbolSize: 42,
            name: "完成率",
            type: "line",
            yAxisIndex: 1,
            data: lineData,
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    color: {
                        colorStops: [{
                                offset: 0,
                                color: '#821eff'
                            },

                            {
                                offset: 1,
                                color: '#204fff'
                            }
                        ],
                    }
                }
            }
        }
    ]
}

/**
 * 右侧echarts
 */
var titlename = ['南郊', '南郊', '南郊', '南郊', '南郊', '南郊', '南郊'];
var myColor = ['#1089E7', '#F57474', '#8B78F6', '#8B78F6', '#8B78F6', '#8B78F6', '#8B78F6'];
export const rightOption1 = {
    // backgroundColor: '#fff',
    title: {
        // x: 'left',
        textStyle: {
            fontSize:15,
            color: '#333'
        },
        // left: '6%',
        // top: '10%'
    },
    //图标位置
    grid: {
        top: '0%',
        left: '15%'

    },
    xAxis: {
        show: false
    },
    yAxis: [{
        show: true,
        data: titlename,
        inverse: true,
        axisLine: {
            show: false
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            formatter: (value, index) => {
                return [
                    `{lg|${index+1}}  ` + '{title|' + value + '} '
                ].join('\n')
            },
            rich: {
                lg: {
                    backgroundColor: '#8d7fec',
                    color: '#fff',
                    padding: 2,
                    align: 'center',
                    width: 15,
                    height: 15
                },
            }
        },
    }],
    series: [{
            name: '条',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 10,
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: '#fff',
                        fontSize: '16',
                    }
                }
            },
            itemStyle: {
                normal: {
                    barBorderRadius: 20,
                    color: function(params) {
                        var num = myColor.length;
                        return myColor[params.dataIndex % num]
                    },
                    // 渐变色
                    // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        // offset: 0,
                        // color: 'rgba(0,255,0)'
                    // }, {
                        // offset: 1,
                        // color: 'rgb(215 ,255,0)'
                    // }]),
                    
                }
            },
            data:[70, 34, 60, 70, 34, 60, 78]

        },
    ]
}
export const rightOption2 = {
    // backgroundColor: '#18163B',
    grid: {
        top: '15%',
        right: '3%',
        left: '5%',
        bottom: '12%'
    },
    xAxis: [{
        type: 'category',
        color: '#59588D',
        data: ['滨江','滨江','滨江','滨江','滨江','滨江','滨江','滨江'],
        axisPointer: {
            type: 'line'
        },
        axisLine: {
            lineStyle: {
                color: '#272456'
            }
        },
        axisLabel: {
            margin: 20,
            color: '#59588D',
            textStyle: {
                fontSize: 12
            },
        },
    }],
    yAxis: [{
        min: 0,
        max: 100,
        axisLabel: {
            show:false,
            formatter: '{value}%',
            color: '#59588D',
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
        data: [100, 90, 10, 90, 90, 20, 56, 89],
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
        },
        label: {
            normal: {
                show: false,
                lineHeight: 30,
                width: 80,
                height: 30,
                backgroundColor: '#252453',
                borderRadius: 200,
                position: ['-8', '-60'],
                distance: 1,
                rich: {
                    d: {
                        color: '#3CDDCF',
                    },
                    a: {
                        color: '#fff',
                        align: 'center',
                    },
                    b: {
                        width: 1,
                        height: 30,
                        borderWidth: 1,
                        borderColor: '#234e6c',
                        align: 'left'
                    },
                }
            }
        }
    }]
};
export const rightOption3 = {
    // backgroundColor: 'black',
    title: {
        text: '1000亿',
        subtext:'进出口总额',
        x: 'center',
        y: '20%',
        textStyle: {
            color: '#d9efff'
        },
        subtextStyle: {
            color: ['#ff9d19']
        },
    },

    tooltip: {
        trigger: 'item',
        formatter: "{b} : {c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 500,
        max: 600,
        inRange: {
            //colorLightness: [0, 1]
        }
    },
    series: [{
        name: '访问来源',
        type: 'pie',
        radius: ['50%','60%'],
            selectedMode: 'single',
            selectedOffset: 10,
        clockwise: true,
        center: ['50%', '30%'],
        color: ['#43cadd','#3893e5'], //'#FBFE27','rgb(11,228,96)','#FE5050'
        data: [{
                value: 36,
                name: '出口金额',
            },
            {
                value: 54,
                name: '进口金额'
            }
        ].sort(function(a, b) {
            return a.value - b.value
        }),
        roseType: 'radius',

        label: {
            normal: {
                formatter: ['{b|{b}}', '{c|{c}%}'].join('\n'),
                rich: {
                    b: {
                        color: '#d9efff',
                        fontSize: 15,
                        height: 40
                    },
                    c: {
                        color: '#fff',
                        fontSize: 14,
                        fontWeight:'bold',
                        lineHeight: 5
                    },
                },
            }
        },

    }]
};