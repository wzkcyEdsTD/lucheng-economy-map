<template>
  <div class="Map">
    <div :id="id" class="arcgisMap"></div>
    <transition name="frame">
      <Frame @close="change(false)" v-if="showCanvass" :canvass="forceCan" :show_left="show_left" />
    </transition>
    <Tip />
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { spaceQuery } from "@/components/common/selectRadioFrame/mapMoving.js";
import indexApi from "@/api/beans/u_index";
import {
  OPTION,
  WRT_config,
  spatialReference,
  IMAGELAYER,
  TDTIMAGE2017,
  TDTJY,
  ZSZY,
  ALLLANDREGULATORY,
  CYBJ,
  TDT25DCONFIG,
  QHMB,
  LANDSOLD,
  DKHX,
  JJTS,
  CANVASSQJ,
  FINEMODEL_FEATURE,
  LCGF,
  IMAGELAYERDSJ
} from "@/components/common/Tmap";
const { server } = WRT_config;
import $ from "jquery";
import Frame from "./framePDF";
import canvassApi from "@/api/beans/u_canvass";
import Building from "@/components/common/buildFrame/buildListData";
const { yylBuilding } = Building;
import Tip from "@/components/common/Tip";
export default {
  name: "commonCanvassArcgis",
  data() {
    return {
      showCanvass: false,
      map: null,
      view: null,
      forceCan: null,
      show_left: false,
      yylBuilding,
      buildid: null,
      activeWidget: null,
      clickName: null
    };
  },
  components: { Frame, Tip },
  props: {
    id: String,
    shallCanvassRes: Boolean,
    leftOptions: Array,
    mapTool: Object,
    point: Array,
    icon_show_left: Boolean,
    forceCanvass: Object,
    forceLand: Object,
    ResName: Object,
    type: String,
    commonSearch: Object,
    isSearch: Boolean,
    iszsly: Boolean,
    ydxz: String
  },
  created() {},
  async mounted() {
    const that = this;
    /**init map**/
    await this.createMap();
    await this.addQh();
    this.$props.leftOptions &&
      this.$props.leftOptions.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          that.doFun(item);
        });
      });
    if (this.shallLargeDataStyleMap.length && this.shallLargeDataStyleMap[0]) {
      this.doMaptoolFun(this.shallLargeDataStyleMap[1]);
    }
    spaceQuery(this, true);
    // this.bindClick();
  },
  computed: {
    shallLargeDataStyleMap() {
      if (this.$props.mapTool && this.$props.mapTool.vector) {
        const item = this.$props.mapTool["vector"]["children"][
          "largeDataStyle"
        ];
        return [item.check, item];
      } else {
        return [];
      }
    }
  },
  watch: {
    forceCanvass: {
      handler(newVal, val) {
        // if (newVal && val && newVal.attributes.pid == val.attributes.pid)
        //   return;
        if (newVal && val && newVal.pid == val.pid) return;
        this.forceCan = newVal;
        this.$nextTick(() => {
          this.forceCanvassLocation(newVal);
        });
      },
      deep: true,
      immediate: true
    },
    forceLand: {
      handler(newVal, val) {
        if (newVal && val && newVal.name == val.name) return;
        this.forceLandProject(newVal);
      },
      deep: true,
      immediate: true
    },
    icon_show_left(newVal, val) {
      this.show_left = newVal;
    },
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
    ydxz(newVal, val) {
      if (!this.map) return;
      const graphicsLayerPic = this.map.findLayerById("graphicsLayerPic");
      graphicsLayerPic && this.map.remove(graphicsLayerPic);
      this.view.graphics.removeAll();
      if (!this.isSearch) return;
      this.drawYDXZLayer(newVal);
    },
    iszsly: {
      handler(newVal, val) {
        if (newVal) {
          this.map ? this.map.removeAll() : "";
          this.createMap();
          this.addQh();
          this.$props.leftOptions &&
            this.$props.leftOptions.map(_item => {
              _item.children.map(item => {
                //  id,fun 都存在表明有该选项的对应画图函数
                if (!item.id || !item.fun) return;
                this.doFun(item);
              });
            });
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 数、组勾选触发图层寻找
     * @param {Object} item 单个元素
     */
    doFun(item) {
      const _ids = item.id.split("@");
      if (item.check) {
        this.map && this.map.findLayerById(_ids[0])
          ? _ids.map(_id => {
              this.map.findLayerById(_id).visible = true;
            })
          : eval(`this.${item.fun}()`);
      } else {
        if (this.map) {
          _ids.map(_id => {
            this.map.findLayerById(_id) &&
              (this.map.findLayerById(_id).visible = false);
          });
        }
      }
    },
    doMaptoolFun(item) {
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : this.addMapToolMap(item);
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
            "esri/layers/MapImageLayer",
            "esri/widgets/Legend",
            "esri/layers/TileLayer",
            "esri/layers/VectorTileLayer"
          ],
          OPTION
        ).then(
          ([
            Map,
            MapView,
            MapImageLayer,
            Legend,
            TileLayer,
            VectorTileLayer
          ]) => {
            const layer = new VectorTileLayer({
              // url: IMAGELAYER
              url: window.user.style.length
                ? window.user.style[0].mapStyle == "largeDataStyle"
                  ? IMAGELAYERDSJ
                  : IMAGELAYER
                : IMAGELAYER
            });
            // map加载底图
            that.map = new Map({
              spatialReference,
              layers: [layer]
            });
            //设置地图容器
            that.view = new MapView({
              container: that.$props.id,
              spatialReference,
              map: that.map,
              zoom:
                that.$window.env == "outside"
                  ? 13
                  : window.user.style.length
                  ? window.user.style[0].mapStyle == "largeDataStyle"
                    ? 12
                    : 13
                  : 13,
              center: [120.61419448808013, 28.039695289562555]
            });
            that.legend = new Legend({
              view: that.view
            });
            if (
              window.user.style.length &&
              window.user.style[0].mapStyle == "image2017"
            ) {
              that.map.add(
                new TileLayer({
                  url: TDTIMAGE2017,
                  id: "image2017"
                }),
                1
              );
            }
            that.view.ui.add(that.legend, "bottom-right");
            if (that.$props.type == "lcqj") {
              const qjLayer = new MapImageLayer({
                url: ZSZY,
                id: "lcqj",
                sublayers: [{ id: 1 }]
              });
              that.map.add(qjLayer, 2);
              that.legend.layerInfos.push({
                layer: qjLayer
              });
            }
            that.view.on("click", function(evt) {
              if (that.$props.type == "lcqj") {
                that.fetQJ(evt.mapPoint);
              } else {
                that.fetchAreaByClick(evt.mapPoint, forceCanvass => {
                  that.view.goTo({
                    center: [evt.mapPoint.x, evt.mapPoint.y],
                    zoom: 14
                  });
                  that.$parent.forceCanvass = forceCanvass.feature;
                });
              }
            });
            that.view.whenLayerView(layer).then(layerView => {
              if (!this.commonSearch.features[0].attributes.lx) {
                this.addPop(
                  this.commonSearch.features[0],
                  this.commonSearch.features[0].geometry.centroid
                );
              } else {
                this.addLandPop(
                  this.commonSearch.features[0],
                  this.commonSearch.features[0].geometry.centroid
                );
              }
            });
            resolve(true);
          }
        );
      });
    },
    fetchAreaByClick(mapPoint, obj, fn) {
      const that = this;
      const children = this.leftOptions[0].children;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const identifyTask = new IdentifyTask({ url: ZSZY });
        const params = new IdentifyParameters();
        const geometry = mapPoint;
        params.tolerance = 2;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        params.layerIds = [0, 3];
        identifyTask.execute(params).then(response => {
          if (response.results.length && children[4].check) {
            if (obj.name == "黄龙商贸城集新未来社区项目") {
              response.results.map(item => {
                if (obj.name == item.feature.attributes.名称) {
                  const popupTemplate = item.feature;
                  that.addPop(popupTemplate, mapPoint);
                }
              });
            } else {
              const popupTemplate = response.results[0].feature;
              that.addPop(popupTemplate, mapPoint);
            }
            fn && fn(popupTemplate);
          } else if (
            children[0].check ||
            children[1].check ||
            children[2].check
          ) {
            that.fetchLandByClick(mapPoint, fn);
          }
        });
      });
    },
    fetchLandByClick(mapPoint, fn) {
      const that = this;
      const children = this.leftOptions[0].children;
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
        const geometry = mapPoint;
        params.tolerance = 2;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = geometry;
        params.mapExtent = that.view.extent;
        params.layerIds = [0];
        identifyTask.execute(params).then(response => {
          if (response.results.length) {
            if (url == DKHX) {
              that.addLandPop(response.results[0].feature, mapPoint);
              that.kgTaskFun(response.results[0].feature.geometry);
            } else {
              that.addGHPop(response.results[0].feature);
            }
            fn && fn;
          } else if (children[3].check) {
            that.fetchBuildByClick(mapPoint, fn);
          }
        });
      });
    },
    fetchBuildByClick(mapPoint, fn) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const identifyTask = new IdentifyTask({ url: JJTS });
        const params = new IdentifyParameters();
        const geometry = mapPoint;
        params.tolerance = 2;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = geometry;
        params.mapExtent = that.view.extent;
        params.layerIds = [2];
        identifyTask.execute(params).then(response => {
          if (response.results.length) {
            that.addBuildPop(response.results[0].feature, mapPoint);
          }
          fn && fn;
        });
      });
    },
    addPop(item, _mapPoint) {
      const that = this;
      const obj = item.attributes || item;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const mapPoint = item.geometry && item.geometry.x
            ? new Point({
                x: item.geometry.x,
                y: item.geometry.y
              })
            : new Point({ x: _mapPoint.x, y: _mapPoint.y });
          const name = obj["名称"] || obj["FNAME"] || obj["xmmc"] || "-";
          const ssjs = obj["地址"] || obj["ssjd"] || "-";
          const ydmj = obj["ydmj"] || "-";
          that.view.popup = {
            title: name,
            content: `<div class="poptemplate_frame">
                <div>
              <ul>
              <li><span>名称:</span>${name}</li>
              <li><span>所属街道:</span>${ssjs}</li>
              <li><span>用地面积(亩):</span>${ydmj}</li>
              </ul>
              </div>
            </div>`,
            location: mapPoint
          };
          that.clickName = item.attributes || obj;
          that.view.popup.visible = true;
          resolve(true);
        });
      });
    },
    fetQJ(_mapPoint) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const identifyTask = new IdentifyTask({ url: CANVASSQJ });
        const params = new IdentifyParameters();
        const geometry = _mapPoint;
        params.tolerance = 2;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = geometry;
        params.mapExtent = that.view.extent;
        params.layerIds = [0];
        identifyTask.execute(params).then(response => {
          this.$parent.showVr(response.results[0].feature.attributes.简称);
        });
      });
    },
    addLandPop(item, _mapPoint) {
      const that = this;
      const obj = item.attributes;
      const geometry = item.geometry;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const mapPoint = new Point({
            x: _mapPoint.x,
            y: _mapPoint.y
          });
          const name = obj["ydkmc"] || obj["地块编号"] || "-";
          const area = obj["mj"] || obj["YDMJ"] || obj["占地面积"] || "-";
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
              <li><span>土地面积（亩）:</span>${Number(area).toFixed(2)}</li>
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
          that.addDraw(geometry);
          resolve(true);
        });
      });
    },
    addBuildPop(item, _mapPoint) {
      const that = this;
      const obj = item.attributes;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const mapPoint = new Point({
            x: item.geometry.x,
            y: item.geometry.y
          });
          const name = obj["name"] || "-";
          that.view.popup = {
            title: name,
            content: `<div class="poptemplate_frame">
                <div>
              <ul>
              <li><span>名称:</span>${name}</li>
              </ul>
              </div>
            </div>`,
            location: mapPoint
          };
          that.view.popup.visible = true;
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
          const dkbh = obj["地块编号"] || "-";
          const YDMJ = obj["YDMJ"];
          const YDXZ = obj["YDXZ"];
          const PTSS = obj["配套设施"] || "-";
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
    //  添加招商图
    addCanvass() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const canvassArea = new MapImageLayer({
              url: ZSZY,
              id: "canvassArea",
              // sublayers: [{ id: 3 }, { id: 2 }]
              sublayers: [{ id: 3 }]
            });
            that.map.add(canvassArea, 2);
            const canvassPoint = new MapImageLayer({
              url: ZSZY,
              id: "canvassPoint",
              sublayers: [{ id: 0 }]
            });
            that.map.add(canvassPoint, 5);
            that.legend.layerInfos.push({
              layer: canvassPoint
            });
            resolve(true);
          }
        );
      });
    },
    //  添加区划图
    addQh() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/MapImageLayer", "esri/layers/FeatureLayer"],
          OPTION
        ).then(([MapImageLayer, FeatureLayer]) => {
          const qh = new MapImageLayer({
            url: QHMB,
            id: "lcjjdt",
            sublayers: [{ id: 1 }, { id: 0 }]
          });
          that.map.add(qh);
          resolve(true);
        });
      });
    },
    //  用地规划
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
            that.legend.layerInfos.push({
              layer: allLandRegulatory
            });
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
              definitionExpression: "ydxz like '%工业用地%' and lx = '可供地块'"
            });
            that.map.add(landAvadefinition, 2);
            that.legend.layerInfos.push({
              layer: landAvadefinition
            });
            resolve(true);
          }
        );
      });
    },
    addLcgfPoint() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/MapImageLayer", "dojo/domReady!"],
          OPTION
        ).then(([MapImageLayer]) => {
          that.map.add(
            new MapImageLayer({
              url: LCGF,
              id: "lcgf_point",
              sublayers: [{ id: 0 }]
            }),
            2
          );
          resolve(true);
        });
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
    addBuildCanvass() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const buildCanvass = new MapImageLayer({
              url: JJTS,
              id: "buildCanvass",
              sublayers: [{ id: 2 }]
            });
            that.map.add(buildCanvass, 2);
            that.legend.layerInfos.push({
              layer: buildCanvass
            });
            resolve(true);
          }
        );
      });
    },
    /**
     * 楼宇属性表、地理位置获取
     */
    fetchBuild({ name, val, url = FINEMODEL_FEATURE }, fn) {
      if (!val) return;
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `${name}='${val}'`;
        query.returnGeometry = false;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            that.buildid = response.features[0].attributes.buildid;
            indexApi
              .lyxx({ where: `gdid='${that.buildid}'`, count: 10 })
              .then(({ data }) => {
                if (!data.length) return;
                that.$parent.forceBuilding = data[0];
              });
            that.changeBuildingDisplay();
          }
        });
      });
    },
    changeBuildingDisplay() {
      const that = this;
      let x;
      let y;
      this.$parent.buidinform_dispaly = true;
      this.yylBuilding.map(item => {
        if (this.buildid == item.objectid) {
          x = item.x;
          y = item.y;
        }
      });
      this.view.goTo({
        center: [x, y - 0.012],
        zoom: 13
      });
      this.view.graphics.removeAll();
      loadModules(
        [
          "esri/Graphic",
          "esri/symbols/PictureMarkerSymbol",
          "esri/geometry/Point"
        ],
        OPTION
      ).then(([Graphic, PictureMarkerSymbol, Point]) => {
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/point.png`,
          width: "101px",
          height: "100px",
          yoffset: 22
        };
        const geometry = new Point({ x, y });
        const graphic = new Graphic({
          geometry,
          symbol
        });
        that.view.graphics.add(graphic);
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
      // 清空测量工具
      if (this.activeWidget) {
        this.activeWidget.destroy();
        this.activeWidget = null;
      }
      // 移除定位标志
      this.view.graphics.removeAll();
    },
    change() {
      this.showCanvass = false;
    },
    forceCanvassLocation(obj) {
      if (!obj) return;
      const that = this;
      loadModules(["esri/geometry/Point"], OPTION).then(([Point]) => {
        const x = obj.x || obj.attributes.POINT_X;
        const y = obj.y || obj.attributes.POINT_Y;
        const mapPoint = new Point(x, y);
        that.view.goTo(mapPoint);
        console.log(obj)
        obj && that.addPop(obj, mapPoint);
        // that.fetchAreaByClick(mapPoint, obj);
        // that.showCanvass = true;
      });
    },
    forceLandProject(item) {
      if (!item) return;
      const that = this;
      // const layerid = item.lx == "可供地块" ? 1 : 0;
      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Point"
        ],
        OPTION
      ).then(([QueryTask, Query, Point]) => {
        const queryTask = new QueryTask({
          url: DKHX + `/0`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `ydkmc='${item.name}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const x = response.features[0].geometry.centroid.x;
            const y = response.features[0].geometry.centroid.y;
            const mapPoint = new Point(x, y);
            that.view.goTo(mapPoint);
            that.addLandPop(response.features[0], mapPoint);
          }
        });
      });
    },
    forceLcgf(lcgf) {
      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/geometry/Point"
        ],
        OPTION
      ).then(async ([QueryTask, Query, Point]) => {
        const queryTask = new QueryTask({ url: LCGF + "/0" });
        const query = new Query({
          outFields: ["*"],
          where: `dz='${lcgf.dz}'`,
          returnGeometry: true
        });
        const { features } = await queryTask.execute(query);
        if (!features.length) return;
        const { attributes, geometry } = features[0];
        const mapPoint = new Point({ x: geometry.x, y: geometry.y });
        this.view.popup.visible = false;
        this.view.popup = {
          title: attributes["dz"],
          content: `<div class="poptemplate_frame">
              <div>房屋状态: ${attributes["fwzt"] || `-`}</div>
              <div>面积(㎡): ${attributes["mj"] || `-`}</div>
              <div>权属单位: ${attributes["qsdw"] || `-`}</div>
              <div>房屋用途: ${attributes["fwyt"] || `-`}</div>
              <div>联系人: ${
                attributes["ksfzr"] ? `${attributes["ksfzr"][0]}先生/女士` : `-`
              }</div>
              <div>联系方式: ${attributes["ksdh"] || `-`}</div>
            </div>`,
          location: mapPoint
        };
        this.view.popup.visible = true;
        this.view.goTo(mapPoint);
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
          console.log(response.features);
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
    addListClick(obj) {
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: ZSZY + "/3"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `FNAME like '%${obj}%' ${arr.join(" ")}`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          const popupTemplate = item.feature;
          that.addPop(popupTemplate, mapPoint);
        });
      });
    }
  }
};
</script>
 <style scoped lang="less">
.Map {
  width: 100%;
  height: 100%;
  position: relative;
  .arcgisMap {
    width: 100%;
    height: 100%;
  }
}
</style>