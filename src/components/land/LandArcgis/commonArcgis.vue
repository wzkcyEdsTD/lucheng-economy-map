<template>
  <div class="Map">
    <div :id="id" class="arcgisMap"></div>
    <transition name="frame">
      <Frame @close="change(false)" v-if="isShow" :company="forceCompany" :moveLeft="moveLeft" />
    </transition>
    <Tip />
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import echarts from "echarts";
import { spaceQuery } from "@/components/common/selectRadioFrame/mapMoving.js";
import qyzcApi from "@/api/beans/u_qyzc";
import qynbApi from "@/api/beans/u_qynb";
import indexApi from "@/api/beans/u_index";
import {
  OPTION,
  spatialReference,
  WRT_config,
  IMAGELAYER,
  QHMB,
  DKHX,
  TDT25DCONFIG,
  MJLYX,
  ALLLANDREGULATORY,
  LANDHB,
  ENVAREA,
  LANDUSED,
  THREEROOM,
  ROOMMANAGER,
  LANDSOLD,
  IMAGELAYERDSJ
} from "@/components/common/Tmap";
const { server } = WRT_config;
import Frame from "./frame";
import { streetInfo, streetCharOption } from "../LandHero/landHerodata";
import Tip from "@/components/common/Tip";
export default {
  name: "commonLandArcgis",
  data() {
    return {
      isShow: false,
      map: null,
      view: null,
      sketchViewModel: null,
      forceCompany: [],
      center: {
        zoom: 12,
        center: [120.61419448808013, 28.039695289562555]
      },
      moveLeft: "30",
      activeWidget: null,
      guihua: false,
      forceCharInterval: null,
      itemId: -1,
      forceChar: null,
      spaceQueryUrl: ALLLANDREGULATORY,
      resultTable: null
    };
  },
  components: { Frame, Tip },
  props: {
    id: String,
    shallMapType: String,
    leftOptions: Array,
    mapTool: Object,
    toCenter: Object,
    _forceCompany: Object,
    Left: String,
    type: String,
    landList: Object,
    rankCompany: Object,
    ydxzLen: Number,
    ydxz: String,
    commonSearch: Object,
    isSearch: Boolean
  },
  created() {
    if (this.$props.toCenter) {
      this.center = this.$props.toCenter;
    }
  },
  beforeDestroy() {
    this.forceCharInterval && clearInterval(this.forceCharInterval);
  },
  async mounted() {
    const that = this;
    /**init map**/
    await this.createMap();
    await this.addQh();
    // if (this.shallLargeDataStyle.length && this.shallLargeDataStyle[0]) {
    //   this.doMaptoolFun(this.shallLargeDataStyle[1]);
    //   await this.addStreetSS();
    //   await this.addABCDPoint();
    //   this.initInterval();
    // }
    if (this.shallLargeDataStyle) {
      // this.doMaptoolFun(this.shallLargeDataStyle[1]);
      await this.addStreetSS();
      await this.addABCDPoint();
      this.initInterval();
    }
    if (this.shallHistoryImage.length && this.shallHistoryImage[0]) {
      this.doMaptoolFun(this.shallHistoryImage[1]);
    }
    this.$props.leftOptions &&
      this.$props.leftOptions.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          that.doFun(item);
        });
      });
    spaceQuery(this, true);
    //  _forceCompany不为空则表明从亩均论英雄点击企业跳转
    if (this.$props._forceCompany) {
      this.goCompanyLocation(this.$props._forceCompany);
    }
  },
  computed: {
    shallLargeDataStyle() {
      // if (this.$props.mapTool && this.$props.mapTool.vector) {
      //   const item = this.$props.mapTool["vector"]["children"][
      //     "largeDataStyle"
      //   ];
      //   return [item.check, item];
      // } else {
      //   return [];
      // }
      // if(window.user.style.length){

      // }
      if (!this.$props.type) {
        return true;
      }
    },
    shallHistoryImage() {
      if (this.$props.mapTool && this.$props.mapTool.images) {
        const item = this.$props.mapTool["images"]["children"]["image2017"];
        return [item.check, item];
      } else {
        return [];
      }
    }
  },
  watch: {
    ydxz(newVal, val) {
      if (!this.map) return;
      const graphicsLayerPic = this.map.findLayerById("graphicsLayerPic");
      graphicsLayerPic && this.map.remove(graphicsLayerPic);
      this.view.graphics.removeAll();
      if (!this.isSearch) return;
      this.drawYDXZLayer(newVal);
    },
    forceChar(newVal, val) {
      this.showStreetPop(newVal);
    },
    shallMapType(newVal, val) {},
    leftOptions: {
      handler(newVal, val) {
        const that = this;
        if (!that.map) return;
        newVal.map(_item => {
          _item.children.map(item => {
            if (!item.id || !item.fun) return;
            that.doFun(item);
          });
        });
      },
      deep: true
    },
    mapTool: {
      handler(newVal, val) {
        const that = this;
        if (!that.map) return;
        for (let d in newVal) {
          const item = newVal[d];
          const _item = val[d];
          if (item.id && item.fun && item.check != _item.check) {
            if (~["vector", "25d", "images"].indexOf(item.id)) {
              that.doMaptoolFun(item);
            } else {
              that.doFun(item);
            }
          }
          for (let v in item.children) {
            const citem = item.children[v];
            const _citem = _item.children[v];
            if (citem.id && citem.fun && citem.check != _citem.check) {
              if (~["vector", "25d", "images"].indexOf(item.id)) {
                that.doMaptoolFun(citem);
              } else {
                that.doFun({
                  ...citem,
                  check: ~["search", "tools"].indexOf(item.id)
                    ? true
                    : citem.check
                });
              }
            }
          }
        }
      },
      deep: true
    },
    Left: {
      handler(newVal, val) {
        this.moveLeft = newVal;
      }
    },
    landList: {
      handler(newVal, val) {
        if (!newVal) return;
        this.goToLand(newVal);
      },
      immediate: true
    },
    rankCompany: {
      handler(newVal, val) {
        if (!newVal) return;
        this.goCompanyLocation(newVal.uuid);
        this.$parent.Left = "30";
        this.$parent.icon_show_left = true;
      }
    }
  },
  methods: {
    /**
     * 数、组勾选触发图层寻找
     * @param {Object} item 单个元素
     */
    doFun(item) {
      this.map.findLayerById("YZDCSub")
        ? this.map.remove(this.map.findLayerById("YZDCSub"))
        : "";
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : eval(`this.${item.fun}()`);
      } else {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = false)
          : null;
        this.map && this.map.findLayerById("glqy")
          ? this.map.remove(this.map.findLayerById("glqy"))
          : null;
      }
    },
    doMaptoolFun(item) {
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : this.addMapToolMap(item);
        this.map && this.map.findLayerById("vector")
          ? (this.map.findLayerById("vector").visible = false)
          : "";
      } else {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = false)
          : null;
      }
    },
    /**
     * 初始化地图对象,带上底图
     * @param {Function} fn 回调函数
     */
    createMap(fn) {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "esri/widgets/Legend",
            "esri/layers/VectorTileLayer"
          ],
          OPTION
        ).then(([Map, MapView, Legend, VectorTileLayer]) => {
          const layer = new VectorTileLayer({
            id: "vector",
            // url: IMAGELAYERDSJ
            url: window.user.style.length
              ? window.user.style[0].mapStyle == "simpleStyle"
                ? IMAGELAYER
                : IMAGELAYERDSJ
              : IMAGELAYER
          });
          // map加载底图
          that.map = new Map({ spatialReference, layers: [layer] });
          //设置地图容器
          that.view = new MapView({
            container: that.$props.id,
            spatialReference,
            map: that.map,
            ...that.center,
            zoom:
              that.$props.type === "画像"
                ? 13
                : window.user.style.length
                ? window.user.style[0].mapStyle == "largeDataStyle"
                  ? 12
                  : 13
                : 13
          });
          that.legend = new Legend({
            view: that.view
          });
          that.id == "landHeroMap"
            ? null
            : that.view.ui.add(that.legend, "bottom-right");
          that.view.on("click", function(evt) {
            if (that.$props.type === "画像") {
              that.GdmTaskFun(evt.mapPoint, that.guihua);
            } else {
              that.IdentifyTaskFun(evt);
            }
          });
          that.view.whenLayerView(layer).then(layerView => {
            if (this.commonSearch) this.addPop(this.commonSearch.features[0]);
          });
          resolve(true);
        });
      });
    },
    drawYDXZLayer(val) {
      const that = this;
      let data1;
      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/GraphicsLayer",
          "esri/Graphic"
        ],
        OPTION
      ).then(async ([QueryTask, Query, GraphicsLayer, Graphic]) => {
        const queryTask = new QueryTask({
          url: DKHX + "/0"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `ydkmc  in (${val})`;
        query.returnGeometry = true;
        // const queryTask2 = new QueryTask({
        //   url: DKHX + "/1"
        // });
        // const query2 = new Query();
        // query2.outFields = ["*"];
        // query2.where = `ydkmc in (${val})`;
        // query2.returnGeometry = true;
        queryTask.execute(query).then(response => {
          data1 = response.features.map(item => {
            return item.geometry;
          });
          const graphicsLayerPic = new GraphicsLayer({
            id: "graphicsLayerPic"
          });
          that.map.add(graphicsLayerPic);
          data1.map(geometry => {
            const fillSymbol = {
              type: "simple-fill",
              color: [0, 255, 255, 0],
              outline: {
                color: [255, 215, 0],
                width: 3
              }
            };
            const polygonGraphic = new Graphic({
              geometry,
              symbol: fillSymbol
            });
            graphicsLayerPic.add(polygonGraphic);
          });
        });
        // const data2 = await queryTask2.execute(query2);
        // const data = data1.features.concat(data2.features).map(item => {
        //   return item.geometry;
        // });
      });
    },
    addPop(item) {
      // if(!this.view || !this.map) return
      const that = this;
      const obj = item.attributes;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const pointx = item.geometry.centroid.x;
          const pointy = item.geometry.centroid.y;
          const mapPoint = new Point({ x: pointx, y: pointy });
          const name = obj["ydkmc"] || obj["项目名称/规划单元"] || "-";
          const area = obj["mj"] || obj["占地面积"] || "-";
          const lx = obj["lx"] || obj["类型"] || "-";
          const address = obj["dkzl"] || obj["街道"] || "-";
          const ydxz = obj["YDXZ"] || "-";
          const p_class =
            obj.kgqkFixed >= 0.66
              ? "high"
              : obj.kgqkFixed <= 0.33
              ? "low"
              : "middle";
          that.view.popup = {
            title: name,
            content: `<div class="poptemplate_frame">
                <div>
              <ul>
              <li><span>名称:</span>${name}</li>
              <li><span>土地面积(亩):</span>${Number(area).toFixed(2)}</li>
              <li><span>类型:</span>${lx}</li>
              <li><span>地址:</span>${address}</li>
              <li><span>用地性质:</span>${ydxz}</li>
              <li><span>拆征进度:</span><div class="percent_frame"><div class="percent p_${p_class}" style="width:${(obj.kgqkFixed ||
              0) * 100}%" data-percent="${(obj.kgqkFixed || 0) *
              100}"></div></div></li>
              </ul>
              </div>
            </div>`,
            location: mapPoint
          };
          that.view.popup.visible = true;
          this.addDraw(item.geometry);
          resolve(true);
        });
      });
    },
    addGHPop(item) {
      const that = this;
      const obj = item.feature ? item.feature.attributes : item.attributes;
      const geometry = item.feature ? item.feature.geometry : item.geometry;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const pointx = geometry.centroid.x;
          const pointy = geometry.centroid.y;
          const dkbh = obj["地块编号"] || obj["DKBH"] || "-";
          const YDMJ = obj["YDMJ"];
          const YDXZ = obj["YDXZ"];
          const PTSS = obj["配套设施"] || obj["PTSS"] || "-";
          const mapPoint = new Point({ x: pointx, y: pointy });
          that.view.popup = {
            title: dkbh,
            content: `<div class="poptemplate_frame">
                <div>
              <ul>
              <li><span>地块编号:</span>${dkbh || "-"}</li>
              <li><span>用地面积(平方米):</span>${YDMJ || "-"}</li>
              <li><span>用地性质:</span>${YDXZ || "-"}</li>
              <li><span>配套设施:</span>${PTSS || "-"}</li>
              </ul>
              </div>
            </div>`,
            location: mapPoint
          };
          that.view.popup.visible = true;
          that.addDraw(geometry);
          resolve(true);
        });
      });
    },
    addDraw(geometry) {
      const that = this;
      that.view.graphics.removeAll();
      loadModules(["esri/Graphic"], OPTION).then(([Graphic]) => {
        const fillSymbol = {
          type: "simple-fill",
          color: [227, 139, 79, 0.6],
          outline: {
            color: [255, 255, 255],
            width: 1
          }
        };
        const polygonGraphic = new Graphic({
          geometry,
          symbol: fillSymbol
        });
        that.view.graphics.add(polygonGraphic, 6);
      });
    },
    doProvideUnused() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const provideUnused = new MapImageLayer({
              url: DKHX,
              id: "provideUnused",
              sublayers: [{ id: 0 }]
            });
            that.map.add(provideUnused, 2);
            that.legend.layerInfos.push({ layer: provideUnused });
            resolve(true);
          }
        );
      });
    },
    addYCDG() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const YCDG = new MapImageLayer({
              url: DKHX,
              id: "YCDG",
              sublayers: [{ id: 2 }]
            });
            that.map.add(YCDG);
            that.legend.layerInfos.push({ layer: YCDG });
            resolve(true);
          }
        );
      });
    },
    addYZDC() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/FeatureLayer"], OPTION).then(
          ([FeatureLayer]) => {
            const YZDC = new FeatureLayer({
              url: DKHX + "/0",
              id: "YZDC",
              definitionExpression: "lx = '已征待拆'"
              // sublayers: [{ id: 0,  }]
            });
            that.map.add(YZDC, 2);
            that.legend.layerInfos.push({ layer: YZDC });
            resolve(true);
          }
        );
      });
    },
    addYZDCSub(BSM) {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const YZDCSub = new MapImageLayer({
              url: ALLLANDREGULATORY,
              id: "YZDCSub",
              sublayers: [{ id: 0, definitionExpression: `BSM in (${BSM})` }]
            });
            that.map.add(YZDCSub, 10);
            that.legend.layerInfos.push({ layer: YZDCSub });
            resolve(true);
          }
        );
      });
    },
    addStreetSS() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/FeatureLayer", "esri/layers/MapImageLayer"],
          OPTION
        ).then(([FeatureLayer, MapImageLayer]) => {
          const streetSS = new FeatureLayer({
            url: MJLYX + "/2",
            id: "streetSS",
            outFields: ["FNAME", "亩均税收平均值"]
          });
          that.map.add(streetSS, 4);
          const streetSSTip = new MapImageLayer({
            url: MJLYX,
            id: "streetSSTip",
            sublayers: [{ id: 1 }]
          });
          that.map.add(streetSSTip, 6);
          that.legend && that.legend.layerInfos.push({ layer: streetSS });
          that.view.whenLayerView(streetSS).then(layerView => {
            that.view.on("pointer-move", evt => {
              const query = layerView.createQuery();
              query.geometry = that.view.toMap(evt);
              layerView.queryFeatures(query).then(result => {
                if (result.features[0].attributes.亩均税收平均值) {
                  this.forceChar = result.features[0].attributes.FNAME;
                  clearInterval(that.forceCharInterval);
                }
              });
            });
          });
          resolve(true);
        });
      });
    },
    showStreetPop(name) {
      const that = this;
      const obj = streetInfo[name];
      loadModules(["esri/geometry/Point"], OPTION).then(([Point]) => {
        that.view.popup.visible = false;
        that.view.popup = {
          title: name,
          content: `<div class="landHero_streetPop">
                <div>
                  <header>亩均税收</header>
                  <div class="landHero_streetPop_info">
                    <span><p>亩均税收</p><p>${obj.val}万元/亩</p></span>
                    <span><p>亩均税收排名</p><p>NO.${obj.no}</p></span>
                  </div>
                </div>
                <div>
                  <header>企业评价结果</header>
                  <div id="landHero_streetPop_chart"></div>
                </div>
            </div>`,
          location: new Point(obj.point)
        };
        that.view.popup.visible = true;
        // setTimeout delay = 0 仍会出现渲染不全的情况 set 100ms
        setTimeout(() => {
          const chart = echarts.init(
            document.getElementById("landHero_streetPop_chart")
          );
          const chartOption = that.$util.clone(streetCharOption);
          chartOption.series[0].data = obj.arr.map((value, index) => {
            return {
              name: ["A类企业", "B类企业", "C类企业", "D类企业"][index],
              value
            };
          });
          chart.setOption(chartOption);
        }, 100);
      });
    },
    initInterval() {
      const arr = [
        "南郊街道",
        "仰义街道",
        "丰门街道",
        "滨江街道",
        "轻工业园区",
        "藤桥镇"
      ];
      this.forceCharInterval = setInterval(() => {
        const index = arr.indexOf(this.forceChar);
        this.forceChar = index > -1 ? arr[(index + 1) % 6] : "南郊街道";
        this.view.goTo({
          center: streetInfo[this.forceChar].point
        });
      }, 12000);
      this.forceChar = "南郊街道";
    },
    addABCDPoint() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const _abcdPoint = new MapImageLayer({
              url: MJLYX,
              id: "_abcdPoint",
              sublayers: [
                {
                  id: 0,
                  definitionExpression: "类型 = '规上'"
                }
              ]
            });
            that.map.add(_abcdPoint, 5);
            that.legend && that.legend.layerInfos.push({ layer: _abcdPoint });
            resolve(true);
          }
        );
      });
    },
    //  添加区划图
    addQh() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const qh = new MapImageLayer({
              url: QHMB,
              id: "lcjjdt",
              sublayers: [{ id: 1 }, { id: 0 }]
            });
            that.map.add(qh, 5);
            resolve(true);
          }
        );
      });
    },
    //  总用地规划
    addAllLandRegulatory() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const allLandRegulatory = new MapImageLayer({
              url: ALLLANDREGULATORY,
              id: "allLandRegulatory"
            });
            that.map.add(allLandRegulatory, 2);
            that.legend.layerInfos.push({ layer: allLandRegulatory });
            resolve(true);
          }
        );
      });
    },
    addLandAva() {
      const that = this;
      this.map.findLayerById("landAvadefinition")
        ? this.map.remove(this.map.findLayerById("landAvadefinition"))
        : "";
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/FeatureLayer"], OPTION).then(
          ([FeatureLayer]) => {
            const landAva = new FeatureLayer({
              url: DKHX + "/0",
              id: "landAva",
              definitionExpression: "lx = '可供地块'"
            });
            that.map.add(landAva, 2);
            // that.legend.layerInfos.push({ layer: landAva });
            resolve(true);
          }
        );
      });
    },
    addLandAvadefinition() {
      const that = this;
      this.map.findLayerById("landAva")
        ? this.map.remove(this.map.findLayerById("landAva"))
        : "";
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/FeatureLayer"], OPTION).then(
          ([FeatureLayer]) => {
            const landAvadefinition = new FeatureLayer({
              url: DKHX + "/0",
              id: "landAvadefinition",
              definitionExpression: "lx = '可供地块' and ydxz like '%工业用地%'"
            });
            that.map.add(landAvadefinition, 2);
            // that.legend.layerInfos.push({layer: landAvadefinition});
            resolve(true);
          }
        );
      });
    },
    //  环保
    addLandhb() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const landhb = new MapImageLayer({
              url: LANDHB,
              id: "landhb"
            });
            that.map.add(landhb, 2);
            resolve(true);
          }
        );
      });
    },
    //  环保
    addEnvArea() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const envArea = new MapImageLayer({
              url: ENVAREA,
              id: "envArea"
            });
            that.map.add(envArea, 2);
            resolve(true);
          }
        );
      });
    },
    //  土地利用现状
    addLandUsed() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const landUsed = new MapImageLayer({
              url: LANDUSED,
              id: "landUsed",
              sublayers: [{ id: 41 }]
            });
            that.map.add(landUsed, 2);
            resolve(true);
          }
        );
      });
    },
    //  三类空间
    addThreeRoom() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const threeRoom = new MapImageLayer({
              url: THREEROOM,
              id: "threeRoom",
              sublayers: [{ id: 1 }]
            });
            that.map.add(threeRoom, 2);
            resolve(true);
          }
        );
      });
    },
    //  空间管制
    addRoomManager() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const roomManager = new MapImageLayer({
              url: ROOMMANAGER,
              id: "roomManager",
              sublayers: [{ id: 37 }]
            });
            that.map.add(roomManager, 2);
            resolve(true);
          }
        );
      });
    },
    //  mapTool地图函数
    addMapToolMap({ id, url, layer }) {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          [
            "esri/layers/TileLayer",
            "esri/layers/VectorTileLayer",
            "esri/layers/WebTileLayer",
            "esri/layers/support/TileInfo"
          ],
          OPTION
        ).then(([TileLayer, VectorTileLayer, WebTileLayer, TileInfo]) => {
          let Layer;
          if (layer != "WebTileLayer") {
            Layer = layer == "TileLayer" ? TileLayer : VectorTileLayer;
            const _layer = new Layer({ url, id });
            that.map.add(_layer, 1);
          } else if (layer == "WebTileLayer") {
            Layer = WebTileLayer;
            const tileInfo = new TileInfo(JSON.parse(TDT25DCONFIG));
            const _layer = new WebTileLayer(url, {
              tileInfo,
              id,
              spatialReference
            });
            that.map.add(_layer, 1);
          }
          resolve(true);
        });
      });
    },
    doSpaceQuery() {
      this.sketchViewModel.create("polygon");
    },
    doCircleQuery() {
      this.sketchViewModel.create("polyline");
    },
    clearQuery() {
      // 移除空间查询图层
      this.map.findLayerById("spaceLayer").removeAll();
      //  移除列表查询结果图层
      this.map.remove(this.map.findLayerById("graphicsLayerPic"));
      // 清空测量工具
      if (this.activeWidget) {
        this.activeWidget.destroy();
        this.activeWidget = null;
      }
      // 移除定位标志
      this.view.graphics.removeAll();
    },
    //  查询
    IdentifyTaskFun({ mapPoint }) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const url = MJLYX;
        const identifyTask = new IdentifyTask(url);
        const params = new IdentifyParameters();
        params.tolerance = 2;
        params.layerIds = [0];
        params.layerOption = "top";
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        identifyTask.execute(params).then(response => {
          if (!response.results || !response.results.length) return;
          that.fetchCompany(
            response.results[0].feature.attributes,
            response.results[0].feature.geometry
          );
        });
      });
    },
    GdmTaskFun(mapPoint) {
      const that = this;
      const children = this.leftOptions[0].children;
      /**
       * 满足以下条件时点击地图查规划图层:
       * 1.[必要条件] 查询条件未带用地性质
       * 2.可出让地块、已征待拆地块未勾选
       * 3.全部未勾选或只勾选了控规
       * 其他情况查地块画像图层
       */
      const url =
        (children[0].check || (!children[1].check && !children[2].check)) &&
        !that.isSearch
          ? ALLLANDREGULATORY
          : DKHX;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const identifyTask = new IdentifyTask(url);
        const params = new IdentifyParameters();
        params.tolerance = 2;
        params.layerIds = [0];
        params.layerOption = "top";
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        identifyTask.execute(params).then(response => {
          if (!response.results || !response.results.length) return;
          const popupTemplate = response.results[0].feature;
          if (url == ALLLANDREGULATORY) {
            that.addGHPop(popupTemplate);
          } else {
            that.kgTaskFun(response.results[0].feature.geometry);
            that.addPop(popupTemplate);
          }
        });
      });
    },
    //点击地块面获取控规面
    kgTaskFun(mapPoint) {
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: ALLLANDREGULATORY + `/0`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `1=1`;
        query.geometry = mapPoint;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          that.map.findLayerById("YZDCSub")
            ? that.map.remove(that.map.findLayerById("YZDCSub"))
            : "";
          if (response.features.length) {
            const BSM = response.features
              .map(item => {
                return item.attributes.BSM;
              })
              .join(`,`);
            that.addYZDCSub(BSM);
          }
        });
      });
    },
    //  获取企业地理位置
    goCompanyLocation(uuid) {
      if (!uuid) return;
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query, Graphic, PictureMarkerSymbol]) => {
        const queryTask = new QueryTask({
          url: MJLYX + "/0"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `统一社会信='${uuid.replace(/\ /g, "")}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const { attributes, geometry } = response.features[0];
            that.fetchCompany(attributes, geometry);
          }
        });
      });
    },
    fetchCompany(attributes, geometry, fn) {
      // [code] fetch company infomation with tyshm - 社会统一信用代码
      const resultApi = [];
      const that = this;
      const uuid =
        attributes["uuid"] ||
        attributes["统一社会信"] ||
        attributes["统一社会信用代码"];
      if (!uuid) return;
      if (geometry) {
        this.view.goTo({
          center: [geometry.x, geometry.y]
        });
        this.setLocationSymbol(geometry);
      }
      qyzcApi
        .ds({ where: `uuid='${uuid.replace(/\ /g, "")}'`, count: 10 })
        .then(({ data }) => {
          if (!data.length) return this.change(false);
          resultApi.push(data[0]);
          this.change(true);
          qynbApi
            .pjzb({
              where: `uuid='${uuid.replace(/\ /g, "")}'`,
              count: 10
            })
            .then(({ data }) => {
              resultApi.push(data[0] || {});
              qynbApi
                .ds({
                  where: `a.uuid='${uuid.replace(/\ /g, "")}'`,
                  count: 10
                })
                .then(({ data }) => {
                  resultApi.push(data);
                  qynbApi
                    .ydxx({
                      uuid: uuid.replace(/\ /g, "")
                    })
                    .then(({ data }) => {
                      resultApi.push(data);
                      that.forceCompany = resultApi;
                      this.$nextTick(() => {
                        fn && fn();
                      });
                    });
                });
            });
        });
    },
    setLocationSymbol(geometry) {
      const that = this;
      loadModules(
        ["esri/Graphic", "esri/symbols/PictureMarkerSymbol"],
        OPTION
      ).then(([Graphic, PictureMarkerSymbol]) => {
        that.view.graphics.removeAll();
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/point.png`,
          width: "101px",
          height: "100px",
          yoffset: 22
        };
        const graphic = new Graphic({
          geometry,
          symbol
        });
        that.view.graphics.add(graphic);
      });
    },
    change(TAG) {
      this.isShow = TAG;
      !TAG && this.view.graphics.removeAll();
      if (TAG && !this.$parent.icon_show_left) {
        this.Left = "30";
        this.$parent.icon_show_left = !this.$parent.icon_show_left;
      }
    },
    distanceMeasure() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/widgets/DistanceMeasurement2D"], OPTION).then(
          ([DistanceMeasurement2D]) => {
            if (that.activeWidget) {
              that.activeWidget.destroy();
              that.activeWidget = null;
            }
            that.activeWidget = new DistanceMeasurement2D({
              view: that.view
            });
            that.activeWidget.viewModel.newMeasurement();
            resolve(true);
          }
        );
      });
    },
    areaMeasure() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/widgets/AreaMeasurement2D"], OPTION).then(
          ([AreaMeasurement2D]) => {
            if (that.activeWidget) {
              that.activeWidget.destroy();
              that.activeWidget = null;
            }
            that.activeWidget = new AreaMeasurement2D({
              view: that.view
            });
            that.activeWidget.viewModel.newMeasurement();
            resolve(true);
          }
        );
      });
    },
    goToLand(obj) {
      const that = this;
      if (!obj) return;
      let url, name, id;
      if (obj.lx == "-") {
        url = ALLLANDREGULATORY;
        name = "DKBH";
        // id = 0;
      } else {
        url = DKHX;
        name = "ydkmc";
        // id = obj.lx == "可供地块" ? 1 : 0;
      }
      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Point"
        ],
        OPTION
      ).then(([QueryTask, Query, Point]) => {
        const queryTask = new QueryTask({
          url: `${url}` + `/0`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `${name}='${obj.ydkmc}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const x = response.features[0].geometry.centroid.x;
            const y = response.features[0].geometry.centroid.y;
            const mapPoint = new Point(x, y);
            that.view.goTo(mapPoint);
            url == ALLLANDREGULATORY
              ? that.addGHPop(response.features[0])
              : that.addLandPop(response.features[0], mapPoint);
          }
        });
      });
    },
    addLandPop(item, mapPoint) {
      this.view.graphics.removeAll();
      const that = this;
      loadModules(["esri/Graphic"], OPTION).then(([Graphic]) => {
        const obj = item.attributes;
        that.view.popup.visible = false;
        const title = obj.ydkmc || "-";
        const p_class =
          obj.kgqkFixed >= 0.66
            ? "high"
            : obj.kgqkFixed <= 0.33
            ? "low"
            : "middle";
        that.view.popup = {
          title,
          content: `<div class="poptemplate_frame">
                <div>
              <ul>
              <li><span>名称:</span>${title}</li>
              <li><span>土地面积（亩）:</span>${obj.mj ||
                obj["占地面积"] ||
                "-"}</li>
              <li><span>类型:</span>${obj.lx}</li>
              <li><span>地址:</span>${obj.dkzl || obj["街道"] || "-"}</li>
              <li><span>用地性质:</span>${obj.YDXZ || "-"}</li>
              <li><span>拆征进度:</span><div class="percent_frame"><div class="percent p_${p_class}" style="width:${(obj.kgqkFixed ||
            0) * 100}%" data-percent="${(obj.kgqkFixed || 0) *
            100}"></div></div></li>
              </ul>
              </div>
            </div>`,
          location: mapPoint
        };
        that.view.popup.visible = true;
        const geometry = item.geometry;
        const fillSymbol = {
          type: "simple-fill",
          color: [227, 139, 79, 0.6],
          outline: {
            color: [255, 255, 255],
            width: 1
          }
        };
        const polygonGraphic = new Graphic({
          geometry,
          symbol: fillSymbol
        });
        this.view.graphics.add(polygonGraphic);
      });
    }
  }
};
</script>
 <style lang="less">
.Map {
  width: 100%;
  height: 100%;

  .arcgisMap {
    width: 100%;
    height: 100%;
  }
}
.landHero_streetPop {
  > div {
    > header {
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      font-weight: bold;
      text-align: left;
    }
    .landHero_streetPop_info {
      > span {
        display: inline-block;
        width: 49%;
        height: 40px;
        > * {
          line-height: 20px;
          font-size: 14px;
        }
        > p:last-child {
          font-weight: 700;
          color: yellow;
        }
      }
    }
  }
  #landHero_streetPop_chart {
    height: 160px;
  }
}
</style>