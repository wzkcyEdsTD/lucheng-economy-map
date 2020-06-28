/*
 * @Author: eds
 * @Date: 2020-03-04 17:25:05
 * @LastEditTime: 2020-06-28 16:40:39
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \lucheng-economy-map\src\components\building\BuildCommon\hoverPanelConfig.js
 */ 
import { NICEMODEL } from "@/components/common/Tmap";
export default {
  _25d: {
    name: "2.5维",
    id: "_25d",
    class: "left",
    icon: "icon iconmap",
    check: false,
    children: {},
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
      icon: "icon icon-",
    },
    children: {},
  },
  _3sd: {
    name: "三维",
    class: "right",
    icon: "icon iconRectangleCopy8",
    check: false,
    id: "_3sd",
    children: {},
  },
  _2d: {
    name: "二维",
    class: "righter",
    icon: "icon icondingwei",
    check: false,
    id: "2d",
    children: {},
  },
};
