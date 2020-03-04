import { NICEMODEL } from "@/components/common/Tmap";
export default {
  _25d: {
    name: "2.5维",
    id: "_25d",
    class: "left",
    icon: "icon iconmap",
    check: false,
    children: {}
  },
  _3d: {
    name: "精细三维",
    class: "center",
    icon: "icon icon-",
    url: NICEMODEL,
    check: false,
    id: "_3d",
    explainer: {
      name: "地图工具",
      icon: "icon icon-"
    },
    children: {}
  },
  _3sd: {
    name: "三维",
    class: "right",
    icon: "icon iconRectangleCopy8",
    check: false,
    id: "_3sd",
    children: {
      _3d_model: {
        name: "三维沙盘",
        id: "_3d_model",
        fun: "do3dModel",
        check: true
      },
      _3d_analyze: {
        name: "闲置分析",
        id: "_3d_analyze",
        fun: "do3dAnalyze",
        check: false
      }
    }
  },
  _2d: {
    name: "二维",
    class: "righter",
    icon: "icon icondingwei",
    check: false,
    id: "2d",
    children: {}
  }
};
