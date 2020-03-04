/*
 * 鹿城echarts点数据
 */
import {
  flpjData
} from "./flpj";
import {
  WRT_config
} from "@/components/common/Tmap";
const {
  server
} = WRT_config;
// 首页

const geoMap = [{
    name: "山福镇",
    value: [120.474425531, 28.1343692142286]
  },
  {
    name: "南郊街道",
    value: [120.651791079866, 27.9986151196537]
  },
  {
    name: "南汇街道",
    value: [120.688223689587, 28.0006727766532]
  },
  {
    name: "蒲鞋市街道",
    value: [120.68110600807, 28.016867166328]
  },
  {
    name: "大南街道",
    value: [120.659201469028, 28.009665954327]
  },
  {
    name: "广化街道",
    value: [120.625069812094, 28.0220375135252]
  },
  {
    name: "滨江街道",
    value: [120.709421614242, 28.0221811273661]
  },
  {
    name: "五马街道",
    value: [120.660720933266, 28.0319409441212]
  },
  {
    name: "松台街道",
    value: [120.642766803, 28.0200092361291]
  },
  {
    name: "双屿街道",
    value: [120.598540339967, 28.0309099121868]
  },
  {
    name: "丰门街道",
    value: [120.57675018418, 28.0466598211285]
  },
  {
    name: "仰义街道",
    value: [120.561137415292, 28.0731958098226]
  },
  {
    name: "藤桥镇",
    value: [120.490621867821, 28.091200967577]
  },
  {
    name: "七都街道",
    value: [120.765381895269, 28.0108972456898]
  }
];

const areaColorList = [
  "#2fbda4",
  "#1e77ff",
  "#1e77ff",
  "#1e77ff",
  "#1e77ff",
  "#1e77ff",
  "#1e77ff",
  "#0303aa",
  "#b46af9",
  "#3308d5",
  "#2fbda4",
  "#1e77ff",
  "#2e1ff8",
  "#60f4fd"
];

// 楼宇数据
var pointData = [
  [{
      name: "华盟商务大楼",
      value: [120.68176675, 27.9863496580001]
    },
    {
      name: "发展大厦",
      value: [120.698706316, 28.0017829990001]
    },
    {
      name: "新城大厦",
      value: [120.698756833, 28.0030114850001]
    }
  ],
  [{
      name: "大自然家园",
      value: [120.708496711, 27.9961708960001]
    },
    {
      name: "温州国际贸易中心",
      value: [120.670555492, 28.015478283]
    },
    {
      name: "海港大厦",
      value: [120.658068032, 28.0280493560001]
    }
  ],
  [{
      name: "锦绣中城",
      value: [120.692257014, 28.003151943]
    },
    {
      name: "世贸中心大厦",
      value: [120.660578621, 28.0100676270001]
    },
    {
      name: "工会大厦",
      value: [120.643891558, 28.024584497]
    },
    {
      name: "置信大厦",
      value: [120.66061133, 28.0013094930001]
    },
    {
      name: "展鑫大厦",
      value: [120.7180751, 28.018805581]
    },
    {
      name: "宏国大厦",
      value: [120.697808622, 27.9953619630001]
    }
  ],
  [{
      name: "交行广场",
      value: [120.681609173, 27.994243285]
    },
    {
      name: "万康商务中心",
      value: [120.682253177, 28.002481065]
    },
    {
      name: "中保大厦",
      value: [120.699617331, 28.002616043]
    },
    {
      name: "中通大厦",
      value: [120.699654518, 28.0017069840001]
    },
    {
      name: "高联大厦",
      value: [120.680464607, 27.9900443000001]
    },
    {
      name: "机械大厦",
      value: [120.667512337, 28.0144898620001]
    },
    {
      name: "国信大厦",
      value: [120.664112796, 28.0159683910001]
    },
    {
      name: "鹿港大厦",
      value: [120.663812674, 28.027741457]
    },
    {
      name: "汇锦深蓝国际大厦",
      value: [120.690786414, 27.9907658020001]
    },
    {
      name: "同人·恒玖大厦",
      value: [120.690716354, 27.9918603390001]
    },
    {
      name: "财富中心",
      value: [120.678706482, 28.001882939]
    }
  ], //py
  [{
      name: "展宏大厦",
      value: [120.679432683, 27.9858064790001]
    },
    {
      name: "金宇商务楼",
      value: [120.67876884, 27.9858951240001]
    },
    {
      name: "金鳞花苑",
      value: [120.680215286, 27.988265889]
    },
    {
      name: "华亮大楼",
      value: [120.698923574, 27.9894409010001]
    },
    {
      name: "新益大厦",
      value: [120.683520174, 27.9957260960001]
    },
    {
      name: "阿尔凡大厦",
      value: [120.709526462, 27.9983225840001]
    },
    {
      name: "恒隆商务楼",
      value: [120.680940735, 27.9988777900001]
    },
    {
      name: "京龙大厦",
      value: [120.679241231, 28.0002907150001]
    },
    {
      name: "温州数码城大厦",
      value: [120.704600952, 28.0018276860001]
    },
    {
      name: "温州晚报大厦",
      value: [120.699183402, 28.0027134740001]
    },
    {
      name: "禾源大厦",
      value: [120.698388901, 28.0034151030001]
    },
    {
      name: "国鼎大厦",
      value: [120.655212311, 28.0067687980001]
    },
    {
      name: "黄龙康城",
      value: [120.615756589, 28.0074847310001]
    },
    {
      name: "游嬉大厦",
      value: [120.661489977, 28.0112906410001]
    },
    {
      name: "西湖锦园",
      value: [120.651242207, 28.0120656270001]
    },
    {
      name: "华跃大厦",
      value: [120.67800799, 28.0126763480001]
    },
    {
      name: "汇嘉大楼",
      value: [120.699076479, 28.014048158]
    },
    {
      name: "郑桥锦园",
      value: [120.604112096, 28.017394251]
    },
    {
      name: "金可达商务楼",
      value: [120.68593136, 28.0210680530001]
    },
    {
      name: "欧洲城中心大楼",
      value: [120.665716605, 28.0218235450001]
    },
    {
      name: "温州鹿城总部经济基地",
      value: [120.577617188, 28.043026614]
    },
    {
      name: "红日商务楼",
      value: [120.711626539, 28.0010541830001]
    },
    {
      name: "尚品国际大厦",
      value: [120.677822153, 28.0085446470001]
    },
    {
      name: "世界温州人家园",
      value: [120.722128452, 28.0108708920001]
    },
    {
      name: "金融大厦",
      value: [120.722377464, 28.016824995]
    },
    {
      name: "温州金融科技文化中心",
      value: [120.75952584, 28.006683153]
    },
    {
      name: "松台大厦",
      value: [120.649358328, 28.012310503]
    },
    {
      name: "龙瑞大厦",
      value: [120.628050283, 28.0157824240001]
    },
    {
      name: "温州建设商务大厦",
      value: [120.627564549, 28.0165660970001]
    },
    {
      name: "诚远大厦",
      value: [120.720138988, 27.9955757440001]
    },
    {
      name: "展银大厦",
      value: [120.725098632, 28.0143722540001]
    },
    {
      name: "汇富大厦",
      value: [120.691223505, 27.9858965080001]
    },
    {
      name: "仁信大厦",
      value: [120.655654954, 27.994621538]
    }
  ]
];

var pointColor = ["#ff4672", "#eb9aff", "#f9ff5b", "#ff8c5b", "#06ff81"];
var _pointSeries = [];

for (let i = 0; i < pointData.length; i++) {
  _pointSeries.push({
    type: "effectScatter",
    zlevel: 10,
    coordinateSystem: "geo",
    symbolSize: 10,
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        color: pointColor[i],
        shadowColor: pointColor[i],
        shadowBlur: 20
      }
    },
    data: pointData[i]
  });
}

// var mapSeries = [];
// const ecoTopStreetHash = {
//   七都: null,
//   滨江: 19.2,
//   蒲鞋市: null,
//   南汇: -7.3,
//   南郊: 2.9,
//   五马: null,
//   大南: null,
//   松台: null,
//   广化: null,
//   双屿: 2.1,
//   丰门: 4.0,
//   仰义: 4.5,
//   藤桥镇: 6.5,
//   山福镇: 8.9
// };
var buildMapSeries = [];
const BuildTopStreetHash = {
  七都: 0,
  滨江: 6,
  蒲鞋市: 0,
  南汇: 11,
  南郊: 1,
  五马: 6,
  大南: 2,
  松台: 2,
  广化: 2,
  双屿: 0,
  丰门: 0,
  仰义: 0,
  藤桥镇: 0,
  山福镇: 0
};
for (var i = 0; i < 14; i++) {
  const name = geoMap[i].name.replace("街道", "");
  // const indexValue = name != undefined ? ecoTopStreetHash[name] : 0;
  const buildValue =
    name && BuildTopStreetHash[name] ? BuildTopStreetHash[name] : null;
  // mapSeries.push({
  //   name,
  //   value: [...geoMap[i].value, indexValue]
  // });
  buildMapSeries.push({
    name,
    value: [...geoMap[i].value, buildValue]
  });
}



// 招商数据
var canvassData = [{
    name: "黄龙商贸城集新未来社区项目",
    value: [120.623954131678, 28.0145126727217]
  },
  {
    name: "公园路历史文化商业街",
    value: [120.662319741663, 28.0174868485393]
  },
  {
    name: "仁信大厦",
    value: [120.655699355441, 27.9946191591469]
  },
  {
    name: "汇富大厦",
    value: [120.69122832113, 27.9855426839478]
  },
  {
    name: "鹿城区（南郊）数字经济产业园",
    value: [120.657572555129, 27.984439310226]
  },
  {
    name: "吴桥小微双创集聚区",
    value: [120.652356078071, 27.9947999534551]
  },
  {
    name: "藤桥下岸工业片区",
    value: [120.562846419027, 28.1026924628869]
  },
  {
    name: "轻工园区外垟地块",
    value: [120.551735059525, 28.1022076401705]
  },
  {
    name: "周岙底产业示范园",
    value: [120.576494574465, 28.0813228632596]
  },
  {
    name: "鹿城鞋艺小镇",
    value: [120.575756859691, 28.0391871954328]
  },
  {
    name: "温州七度科技文化中心",
    value: [120.750802326366, 28.0083978907501]
  }
];

// 经济指标
var indexSeries = [{
    // 上层地图
    type: "map",
    map: "LC",
    roam: false,
    zoom: 1.2,
    zlevel: 9,
    // 文本
    label: {
      normal: {
        show: false,
        textStyle: {
          fontSize: 16,
          color: "#fff"
        }
      },
      emphasis: {
        show: false,
        textStyle: {
          color: "#fff"
        }
      }
    },
    itemStyle: {
      // 普通样式
      normal: {
        areaColor: "#708090",
        borderColor: "#fff",
        fontWeightL: 700,
        borderWidth: 0.5
      },
      // 悬停样式
      emphasis: {
        areaColor: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0,
              color: "#3f15d6"
            },
            {
              offset: 1,
              color: "#d243cd"
            }
          ]
        }
      }
    },
    data: []
  },
  {
    // 街道名称
    type: "effectScatter",
    coordinateSystem: "geo",
    zlevel: 10,
    symbolSize: 10,
    label: {
      normal: {
        show: true,
        formatter: function (params) {
          return params.name.replace("街道", "");
        },
        position: "bottom",
        color: "#E3F0FF",
        fontSize: 16,
        fontWidth: "bold"
      },
      emphasis: {
        show: true
      }
    },
    itemStyle: {
      color: "transparent",
      shadowBlur: 5,
      shadowColor: "#fff"
    },
    data: geoMap
  }
];

//楼宇
const buildSeries = [{
    // 上层地图
    type: "map",
    map: "LC",
    roam: true,
    zlevel: 9,
    // 文本
    label: {
      normal: {
        show: false,
        textStyle: {
          fontSize: 16,
          color: "#fff"
        }
      },
      emphasis: {
        show: false,
        textStyle: {
          color: "#fff"
        }
      }
    },
    itemStyle: {
      // 普通样式
      normal: {
        areaColor: "#12379f",
        borderColor: "#fff",
        fontWeightL: 700,
        borderWidth: 0.5
      },
      // 悬停样式
      emphasis: {
        areaColor: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0,
              color: "#3f15d6"
            },
            {
              offset: 1,
              color: "#d243cd"
            }
          ]
        }
      }
    },
    // data: geoMap
    data: _pointSeries
  },
  {
    // 街道名称
    type: "effectScatter",
    coordinateSystem: "geo",
    zlevel: 10,
    symbolSize: 10,
    label: {
      normal: {
        show: true,
        formatter: function (params) {
          return params.name.replace("街道", "");
        },
        position: "bottom",
        color: "#E3F0FF",
        fontSize: 16,
        fontWidth: "bold"
      },
      emphasis: {
        show: true
      }
    },
    itemStyle: {
      color: "transparent",
      shadowBlur: 5,
      shadowColor: "#fff"
    },
    data: geoMap
  }
].concat(_pointSeries);

// 用地
var landSeries = [{
  // 上层地图
  type: "map",
  map: "LC",
  roam: false,
  zlevel: 9,
  // 文本
  label: {
    normal: {
      show: false,
      textStyle: {
        fontSize: 16,
        color: "#fff"
      }
    },
    emphasis: {
      show: false,
      textStyle: {
        color: "#fff"
      }
    }
  },
  itemStyle: {
    // 普通样式
    normal: {
      areaColor: "#12379f",
      borderColor: "#fff",
      fontWeightL: 700,
      borderWidth: 0.5
    },
    // 悬停样式
    emphasis: {
      areaColor: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: "#3f15d6"
          },
          {
            offset: 1,
            color: "#d243cd"
          }
        ]
      }
    }
  },
  data: geoMap
}];

// 亩均论英雄
var pointColor2 = ["#fd2424", "#ec8120", "#2883f6", "#127b49"];
var typeList = ["A", "B", "C", "D"];
var pointSeries2 = [];
for (let i = 0; i < flpjData.length; i++) {
  pointSeries2.push({
    name: typeList[i],
    type: "effectScatter",
    // type: 'scatter',
    zlevel: 10,
    coordinateSystem: "geo",
    symbolSize: 8,
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        color: pointColor2[i],
        shadowColor: "#FFF",
        shadowBlur: 2
      }
    },
    data: flpjData[i]
  });
}

var heroSeries = [{
    // 上层地图
    type: "map",
    map: "LC",
    roam: false,
    zlevel: 9,
    // 文本
    label: {
      normal: {
        show: false,
        textStyle: {
          fontSize: 16,
          color: "#fff"
        }
      },
      emphasis: {
        show: false,
        textStyle: {
          color: "#fff"
        }
      }
    },
    itemStyle: {
      // 普通样式
      normal: {
        areaColor: "#12379f",
        borderColor: "#fff",
        fontWeightL: 700,
        borderWidth: 0.5
      },
      // 悬停样式
      emphasis: {
        areaColor: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0,
              color: "#3f15d6"
            },
            {
              offset: 1,
              color: "#d243cd"
            }
          ]
        }
      }
    },
    data: geoMap
  },
  {
    // 街道名称
    type: "effectScatter",
    coordinateSystem: "geo",
    zlevel: 10,
    symbolSize: 10,
    label: {
      normal: {
        show: true,
        formatter: function (params) {
          return params.name.replace("街道", "");
        },
        position: "bottom",
        color: "#E3F0FF",
        fontSize: 16,
        fontWidth: "bold"
      },
      emphasis: {
        show: true
      }
    },
    itemStyle: {
      color: "transparent",
      shadowBlur: 5,
      shadowColor: "#fff"
    },
    data: geoMap
  }
].concat(pointSeries2);

// 招商总述
var canvassSeries = [{
    // 上层地图
    type: "map",
    map: "LC",
    roam: false,
    center: [120.6, 28.05],
    zoom: 1.5,
    zlevel: 9,
    itemStyle: {
      // 普通样式
      normal: {
        areaColor: "#12379f",
        borderColor: "#fff",
        fontWeightL: 700,
        borderWidth: 0.5
      },
      // 悬停样式
      emphasis: {
        areaColor: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0,
              color: "#3f15d6"
            },
            {
              offset: 1,
              color: "#d243cd"
            }
          ]
        }
      }
    },
    silent: true,
    data: []
  },
  {
    // 招商点
    type: "scatter",
    coordinateSystem: "geo",
    symbol: `image://${server}/icon/commonIcon/light_bar.png`,
    zlevel: 10,
    symbolSize: [12, 42],
    symbolOffset: [-6, -21],
    data: canvassData
  }
];

export default {
  indexSeries,
  buildSeries,
  landSeries,
  heroSeries,
  canvassSeries,
  pointData,
  _pointSeries,
  buildMapSeries,
  geoMap
};