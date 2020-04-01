<template>
  <div class="Map">
    <div id="ecoCharArcgis" class="arcgisMap"></div>
    <transition name="frame">
      <Frame
        @close="change(false)"
        v-if="isShow"
        :company="forceCompany"
        :show_left="show_left || !shallCompany"
        :fromCanvass="fromCanvass"
        :Left="Left"
      />
    </transition>
    <transition name="frame">
      <indexFrame
        @close="indexchange(false)"
        v-if="indexShow"
        :indexForce="forceTopic"
        :Left="Left"
      />
    </transition>
    <transition name="frame">
      <Eight @close="Eightchange(false)" v-if="eightShow" :forceEight="forceEight" :Left="Left" />
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import qyzcApi from "@/api/beans/u_qyzc";
import qynbApi from "@/api/beans/u_qynb";
import indexApi from "@/api/beans/u_index";
import Tip from "@/components/common/Tip";
import Eight from "../EcoCompany/Eight";
import {
  OPTION,
  spatialReference,
  IMAGELAYER,
  JJTS,
  QHMB,
  LVYOU,
  ZSZY,
  CANVASSQJ,
  STREETPOINT,
  WRT_config
} from "@/components/common/Tmap";
import Frame from "../EcoArcgis/frame";
import indexFrame from "../EcoArcgis/indexFrame";
const { server } = WRT_config;
let map;
let view;
export default {
  name: "ecoCharArcgis",
  data() {
    return {
      isShow: false,
      indexShow: false,
      eightShow: false,
      map: null,
      sketchViewModel: null,
      view: null,
      forceCompany: [],
      forceTravel: {},
      forceTopic: {},
      forceZYSC: {},
      sketchViewModel: null,
      show_left: false,
      Throttle: false,
      Left: "30",
      companyPoint: false,
      forceEight: []
    };
  },
  components: { Frame, indexFrame, Tip, Eight },
  props: {
    id: String,
    forceChar: Object,
    mark: {
      type: Number,
      default: 0
    },
    fromCanvass: Boolean,
    mapTool: Object,
    leftOptions: Array
  },
  created() {},
  async mounted() {
    const that = this;
    /**init map**/
    await this.createMap();
    //  await this.addRoad();
    await this.addQh();
    // await this.addMarket();
    // await this.addFeatureProject();
    // await this.addTopCompany();
    // await this.addBuild();
    // await this.addLand();
    // await this.addPop();
  },
  computed: {},
  watch: {
    forceChar: {
      handler(newVal, val) {
        if (this.view) {
          this.view.goTo({
            center: [Number(newVal.pointx), Number(newVal.pointy)],
            zoom: this.fromCanvass && this.$window.env == "outside" ? 14 : 13
          });
          //  this.addPop();
          this.addBlank(newVal.name);
        }
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
    }
  },
  methods: {
    /**
     * 数、组勾选触发图层寻找
     * @param {Object} item 单个元素
     */
    doFun(item) {
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : eval(`this.${item.fun}()`);
      } else {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = false)
          : null;
      }
    },
    doMaptoolFun(item) {
      if (item.check) {
        if (this.map && this.map.findLayerById(item.id)) {
          this.map.findLayerById(item.id).visible = true;
        } else {
          this.addMapToolMap(item);
        }
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
          ["esri/Map", "esri/views/MapView", "esri/layers/VectorTileLayer"],
          OPTION
        ).then(([Map, MapView, VectorTileLayer]) => {
          const layer = new VectorTileLayer({
            url: IMAGELAYER
          });
          // map加载底图
          that.map = new Map({ spatialReference, layers: [layer] });
          //设置地图容器
          that.view = new MapView({
            container: "ecoCharArcgis",
            spatialReference,
            map: that.map,
            zoom: that.fromCanvass && that.$window.env == "outside" ? 14 : 13,
            center: [120.7591478960478, 28.006868323436706]
          });
          that.view.on("click", function(evt) {
            if (that.$props.tag == "产业布局") {
              // that.IdentifyTaskFun(evt, true);
            } else {
              that.jjtsIdentifyTaskFun(evt, false);
            }
          });
          resolve(true);
        });
      });
    },
    addPop() {
      const item = this.forceChar;
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/geometry/Point"], OPTION).then(async ([Point]) => {
          that.view.popup.visible = false;
          const { pointx, pointy } = item;
          const mapPoint = new Point({ x: pointx, y: pointy });
          that.view.popup = {
            title: item.name,
            content: `<div class="poptemplate_frame">
              <div class="poptemplate_frame_img"><img src="${server}/icon/streetImg/${item.name}.png"/></div>
              <div class="poptemplate_frame_intro">${item.intro}</div>
            </div>`,
            location: mapPoint
          };
          that.view.popup.visible = true;
          await this.addBlank(item.name);
          resolve(true);
        });
      });
    },

    /**
     * 2020.4.1
     * 全景地图
     */
    addQJDT() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const qjLayer = new MapImageLayer({
              url: ZSZY,
              id: "lcqj",
              sublayers: [{ id: 1, definitionExpression: "ssjd = '南汇街道'" }]
            });
            that.map.add(qjLayer);
            resolve(true);
          }
        );
      });
    },
    //  添加专业市场
    addMarket() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const market = new MapImageLayer({
              url: JJTS,
              id: "market",
              sublayers: [{ id: 3 }]
            });
            that.map.add(market);
            resolve(true);
          }
        );
      });
    },
    //  添加重点项目
    addFeatureProject() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const featureProject = new MapImageLayer({
              url: JJTS,
              id: "featureProject",
              sublayers: [{ id: 1, definitionExpression: "duty = '南汇街道'" }]
            });
            that.map.add(featureProject);
            resolve(true);
          }
        );
      });
    },
    //百强企业
    addTopCompany() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const topCompany = new MapImageLayer({
              url: JJTS,
              id: "topCompany",
              sublayers: [{ id: 5 }]
            });
            that.map.add(topCompany);
            resolve(true);
          }
        );
      });
    },
    //优质楼宇
    addBuild() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const build = new MapImageLayer({
              url: `http://172.20.89.59/server/rest/services/lcjjdt/ly_nanhui/MapServer`,
              id: "build"
            });
            that.map.add(build);
            resolve(true);
          }
        );
      });
    },
    //招商地块
    addLand() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const land = new MapImageLayer({
              url: JJTS,
              id: "land",
              sublayers: [{ id: 4, definitionExpression: "ssjd = '南汇街道'" }]
            });
            that.map.add(land);
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
              sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
            });
            that.map.add(qh);
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
    //  添加街镇蒙白(高亮)
    addBlank(label) {
      if (!label) return;
      this.view.graphics.removeAll();
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
        OPTION
      ).then(([QueryTask, Query, Graphic]) => {
        const queryTask = new QueryTask({
          url: QHMB + "/2"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `${label ? `FNAME = '${label}'` : `FNAME = ''`}`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const geometry = response.features[0].geometry;
            const fillSymbol = {
              type: "simple-fill",
              color: [21, 249, 253, 0.3],
              outline: {
                color: [21, 249, 253],
                width: 4
              }
            };
            const polygonGraphic = new Graphic({
              geometry,
              symbol: fillSymbol
            });
            that.view.graphics.add(polygonGraphic);
          }
        });
      });
    },

    /**
     * 2020.4.1
     * 详情
     */
    jjtsIdentifyTaskFun({ mapPoint }, tag, fn) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(async ([IdentifyTask, IdentifyParameters]) => {
        const params = new IdentifyParameters();
        params.tolerance = 10;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        const identifyTask_JJTS = new IdentifyTask(JJTS);
        const response = await identifyTask_JJTS.execute(params);
        if (response.results.length) {
          if (!response.results[0].feature.attributes["统一社会信"]) {
            that.indexPoint(response.results[0].feature.attributes);
            that.view.goTo({ center: [mapPoint.x, mapPoint.y] });
            that.setLocationSymbol(response.results[0].feature.geometry);
            that.change(false);
          } else {
            that.fetchCompany(
              response.results[0].feature.attributes,
              response.results[0].feature.geometry
            );
            that.indexchange(false);
          }
        } else {
          that.fetQJ(mapPoint);
          // const identifyTask_TRAVEL = new IdentifyTask(LVYOU);
          // const response_travel = await identifyTask_TRAVEL.execute(params);
          // if (response_travel.results.length) {
          //   this.goTravel({
          //     ...response_travel.results[0].feature.attributes,
          //     name: response_travel.results[0].feature.attributes["名称"]
          //   });
          // }
        }
        fn && fn();
      });
    },
    //  企业供地面
    setCompanyArea(geometry) {
      this.view.graphics.removeAll();
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
        OPTION
      ).then(([QueryTask, Query, Graphic]) => {
        const queryTask = new QueryTask({
          url: DKHX + "/3"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = "1=1";
        query.extent = geometry.extent;
        query.geometry = geometry;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const geometry = response.features[0].geometry;
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
        attributes["统一社会信用代码"] ||
        attributes;
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
    indexPoint(attributes) {
      const name =
        attributes["name1009"] ||
        attributes["NAME"] ||
        attributes["名称"] ||
        attributes["FNAME"] ||
        attributes;
      if (!name) return;
      indexApi.ds({ where: `name='${name}'`, count: 10 }).then(({ data }) => {
        if (!data.length) return this.indexchange(false);
        if (data[0].type === "0") {
          indexApi.Eight({ where: `xmmc='${name}'` }).then(({ data }) => {
            this.forceEight = data;
          });
          this.Eightchange(true);
          // this.eightShow = true;
          this.isShow = false;
          this.indexShow = false;
        } else if (data[0].type === "1") {
          indexApi
            .zysc({ where: `a.name = '${name}'`, count: 10 })
            .then(({ data }) => {
              this.forceTopic = data[0];
            });
          this.indexchange(true);
        } else if (data[0].type === "2") {
          indexApi.zdcyxmb({ where: `name='${name}'` }).then(({ data }) => {
            this.forceTopic = data[0];
          });
          this.indexchange(true);
        } else if (data[0].type === "3") {
          indexApi.lyxx({ where: `name='${name}'` }).then(({ data }) => {
            this.forceTopic = data[0];
          });
          this.indexchange(true);
        } else {
          this.forceTopic = data[0];
          this.indexchange(true);
        }
      });
    },
    goCompanyLocation(item) {
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: CYBJ + "/4"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `统一社会信='${item.uuid}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const obj = response.features[0].attributes;
            that.setLocationSymbol(response.features[0].geometry);
            that.view.goTo({
              center: [obj.POINT_X || obj.x, obj.POINT_Y || obj.y]
            });
          }
        });
      });
    },
    goTravelLocation({ name, type, jj }) {
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(async ([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: LVYOU + "/0"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `name = '${name}'`;
        query.returnGeometry = true;
        const { features } = await queryTask.execute(query);
        if (features.length) {
          that.view.goTo(features[0].geometry);
          this.view.popup.visible = false;
          this.view.popup = {
            title: name,
            content: `<div class="poptemplate_frame">
              <div><img id="travel_${name}" src="${server}/icon/travel/${name}.jpg" onerror="document.getElementById('travel_${name}').src='${server}/icon/commonIcon/noImg.png'"/></div>
              <div>景点简介: ${jj || `-`}</div>
            </div>`,
            location: features[0].geometry
          };
          this.view.popup.visible = true;
        }
      });
    },
    goIndex(item) {
      const that = this;
      var name;
      if (item[0] == "5") {
        name = "企业名称";
      } else if (item[0] == "0") {
        name = "bklx";
      } else {
        name = "NAME";
      }
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query", "esri/Graphic"],
        OPTION
      ).then(([QueryTask, Query, Graphic]) => {
        const queryTask = new QueryTask({
          url: JJTS + `/${item[0]}`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `${name}='${item[1]}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const obj = response.features[0].attributes;
            that.setLocationSymbol(response.features[0].geometry);
            that.view.goTo({
              center: [obj.POINT_X, obj.POINT_Y]
            });
          }
        });
      });
    },

    setLocationSymbol(geometry) {
      const that = this;
      this.view.graphics.removeAll();
      //  产业布局企业点设置供地面
      this.company && this.setCompanyArea(geometry);
      loadModules(
        ["esri/Graphic", "esri/symbols/PictureMarkerSymbol"],
        OPTION
      ).then(([Graphic, PictureMarkerSymbol]) => {
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/point.png`,
          width: "101px",
          height: "100px",
          yoffset: 15
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
        this.$parent.moveLeft = "30";
        this.$parent.icon_show_left = !this.$parent.icon_show_left;
      }
    },
    indexchange(INDEXTAG) {
      this.indexShow = INDEXTAG;
      !INDEXTAG && this.view.graphics.removeAll();
      if (INDEXTAG && this.$parent.icon_show_left) {
        this.$parent.moveLeft = "30";
        this.$parent.icon_show_left = !this.$parent.icon_show_left;
      }
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
        params.tolerance = 12;
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
    }
  }
};
</script>
 <style scoped lang="less">
.Map {
  width: 100%;
  height: 100%;
  #ecoCharArcgis {
    width: 100%;
    height: 100%;
  }
}
</style>