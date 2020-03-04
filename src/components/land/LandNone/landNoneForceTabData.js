export default {
  全部: {
    label: "全部",
    radio: [
      {
        label: "整治进度",
        list: [
          { name: "山福镇", target: 5, value: 6.98, done: 139.6 },
          { name: "轻工园区", target: 60, value: 77.28, done: 128.8 },
          { name: "双屿街道", target: 80, value: 73.02, done: 91.28 },
          { name: "藤桥镇", target: 120, value: 58.9, done: 83.9 },
          { name: "丰门街道", target: 200, value: 124.48, done: 62.24 },
          { name: "仰义街道", target: 95, value: 58.9, done: 62.0 }
        ]
      },
      {
        label: "整治面积",
        list: [{ name: "滨江", value: 100 }, { name: "滨江", value: 100 }]
      },
      { label: "低效面积", list: [{ name: "滨江", value: 100 }] }
    ]
  },
  用而未尽: {
    label: "用而未尽",
    radio: [
      {
        label: "整治进度",
        list: [
          { name: "整治项目", target: 5, value: 2 },
          { name: "整治亩数", target: 79.69, value: 45.58 }
        ]
      }
    ]
  },
  建而未投: {
    label: "建而未投",
    radio: [
      {
        label: "整治进度",
        list: [
          { name: "整治项目", target: 3, value: 1 },
          { name: "整治亩数", target: 46.42, value: 15 }
        ]
      }
    ]
  },
  投而未达: {
    label: "投而未达",
    radio: [
      {
        label: "整治进度",
        list: [
          { name: "整治项目", target: 49, value: 32 },
          { name: "整治亩数", target: 548.64, value: 454.32 }
        ]
      }
    ]
  }
};
