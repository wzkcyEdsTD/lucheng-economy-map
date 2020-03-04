// 高速收费站
export const freewayList = [
  {
    name: "瓯  北",
    value: [120.610766853, 28.074736483]
  },
  {
    name: "温州东",
    value: [120.7507711, 27.96865542]
  },
  {
    name: "七  都",
    value: [120.7716305, 28.00273406]
  },
  {
    name: "温州西",
    value: [120.5894472, 28.02007991]
  },
  {
    name: "仰  义",
    value: [120.5820262, 28.0787275]
  }
];

// 地点列表
export const placeList = {
  wzzf: {
    name: "温州市人民政府",
    value: [120.695, 27.997]
  },
  wzjc: {
    name: "温州龙湾国际机场",
    value: [120.848, 27.915]
  },
  wznz: {
    name: "温州南站",
    value: [120.581, 27.97]
  },
  LuC: {
    name: "鹿城区",
    value: [120.673, 28.008]
  },
  HZ: {
    name: "杭州市",
    value: [120.094267, 30.271036]
  },
  SH: {
    name: "上海市",
    value: [121.45563, 31.2059]
  },
  Serbia: {
    name: "塞尔维亚贝尔麦克商贸物流园区中东欧展示营销中心",
    value: [20.467996, 44.593012]
  },
  LW: {
    name: "龙湾区",
    value: [120.81996414447606, 27.896400081561136]
  },
  OB: {
    name: "瓯北",
    value: [120.70929284667763, 28.04484976159022]
  },
  OH: {
    name: "瓯海区",
    value: [120.6447444179137, 27.964346363638935]
  },
  LS: {
    name: "丽水市",
    value: [120.16353103900695, 28.180034230671584]
  },
  HX: {
    name: "海峡西岸经济区",
    value: [118.23256249999865, 25.707888148751668]
  },
  CSJ: {
    name: "长三角城市群",
    value: [119.62782617187322, 31.17240965738292]
  },
  JJJ: {
    name: "京津冀城市群",
    value: [116.44179101562398, 39.71312060455129]
  },
  ZSJ: {
    name: "粤港澳大湾区",
    value: [113.39313461286248, 22.75278296102801]
  },
  CJZY: {
    name: "长江中游城市群",
    value: [114.305215, 30.592935]
  },
  WH: {
    name: "武汉",
    value: [114.305215, 30.592935]
  },
  WLMQ: {
    name: "新疆维吾尔自治区",
    value: [87.616842, 43.82539]
  },
  FZ: {
    name: "福州",
    value: [119.296389,26.074268]
  },
  TB: {
    name: "台北",
    value: [121.517057,25.048074]
  }
};

// 高速道路线
var _freewayLines = [];
for (let item of freewayList) {
  _freewayLines.push([
    {
      coord: placeList["LuC"].value
    },
    {
      coord: item.value
    }
  ]);
}
export const freewayLines = _freewayLines;

// 高速道路时间标注
var _freewayText = [];
for (let item of freewayList) {
  _freewayText.push({
    name: "15 分钟",
    value: [
      (placeList["LuC"].value[0] + item.value[0]) / 2,
      (placeList["LuC"].value[1] + item.value[1]) / 2
    ]
  });
}

export const freewayText = _freewayText;
