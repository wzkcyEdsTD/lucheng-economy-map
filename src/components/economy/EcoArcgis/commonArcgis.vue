<template>
  <div class="Map">
    <div :id="id" class="arcgisMap"></div>
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
    <Tip />
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { spaceQuery } from "@/components/common/selectRadioFrame/mapMoving.js";
import qyzcApi from "@/api/beans/u_qyzc";
import qynbApi from "@/api/beans/u_qynb";
import indexApi from "@/api/beans/u_index";
import Tip from "@/components/common/Tip";
import Eight from "../EcoCompany/Eight";
import {
  OPTION,
  spatialReference,
  WRT_config,
  QHMB,
  CYBJ,
  IMAGELAYER,
  TDT25DCONFIG,
  DKHX,
  JJTS,
  YZQY,
  LVYOU,
  IMAGELAYERDSJ,
  TDTJY,
  TDTIMAGE2017
} from "@/components/common/Tmap";
const { server } = WRT_config;
import Frame from "./frame";
import indexFrame from "./indexFrame";
const mapTypeRenderer = {
  heat: {
    type: "heatmap",
    minPixelIntensity: 0,
    maxPixelIntensity: 10
  },
  polymerization: null
};
const heatHash = {
  农林牧渔业: 20,
  装备制造: 20,
  "鞋材、鞋业": 30,
  房地产业: 300,
  其他: 20,
  "交通运输、仓储和邮政业": 40,
  金融业: 25,
  企业服务业: 20,
  住宿和餐饮业: 200
};
export default {
  name: "commonEcoArcgis",
  data() {
    return {
      isShow: false,
      indexShow: false,
      eightShow: false,
      map: null,
      view: null,
      legend: null,
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
    company: String,
    indexForce: String,
    shallMapType: String,
    leftOptions: Array,
    Plate: Array,
    mapTool: Object,
    forceTableCompany: Object,
    forceTableTopic: Object,
    icon_show_left: Boolean,
    treePoint: Array,
    treeHeat: Array,
    FrameName: String,
    Bquuid: String,
    type: Array,
    shallHeat: Boolean,
    FrameShow: Boolean,
    BqShow: Boolean,
    fromCanvass: Boolean,
    tag: String,
    moveLeft: String,
    CommonResult: Object
  },
  created() {},
  async mounted() {
    const that = this;
    /**init map**/
    await this.createMap();
    await this.addQh();
    await this.addmbk();
    if (this.shallLargeDataStyle.length && this.shallLargeDataStyle[0]) {
      this.doMaptoolFun(this.shallLargeDataStyle[1]);
    }
    this.$props.leftOptions &&
      this.$props.leftOptions.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          that.doFun(item);
        });
      });
    this.$props.Plate &&
      this.$props.Plate.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          that.doFun(item);
        });
      });
    if (this.$props.company) {
      this.addCompany();
      this.addHeat();
    }
    spaceQuery(that);
  },
  computed: {
    shallCompany() {
      return this.company ? true : false;
    },
    shallLargeDataStyle() {
      if (this.$props.mapTool && this.$props.mapTool.vector) {
        const item = this.$props.mapTool["vector"]["children"][
          "largeDataStyle"
        ];
        return [item.check, item];
      } else {
        return [];
      }
    },
    layerMap() {
      let layers = [];
      this.leftOptions.map(v => {
        layers = [...layers, ...(v.children || [])];
      });
      return [...new Set([...layers, { id: "company" }])];
    }
  },
  watch: {
    shallHeat: {
      handler(newVal, val) {
        if (newVal) {
          this.addHeat();
        } else {
          this.map &&
            this.map.findLayerById("heat") &&
            this.map.remove(this.map.findLayerById("heat"));
        }
      }
    },
    treePoint: {
      handler(newVal, val) {
        if (newVal === val) return;
        this.addCompany();
      }
    },
    treeHeat: {
      handler(newVal, val) {
        if (newVal === val || !this.shallHeat) return;
        this.addHeat();
      }
    },
    //  [走进鹿城]表格点击专题点定位
    forceTableTopic: {
      handler(newVal, val) {
        this.forceTopic = newVal;
        this.forceTopicLocation(newVal.point);
      },
      deep: true
    },
    //  [产业布局]表格点击企业点定位
    forceTableCompany: {
      handler(newVal, val) {
        this.fetchCompany(newVal, null, () => {
          this.goCompanyLocation(newVal);
        });
      },
      deep: true
    },
    //  改变图像展示类型
    shallMapType(newVal, val) {
      const that = this;
      this.layerMap.map(item => {
        if (that.map && that.map.findLayerById(item.id)) {
          const _layer = that.map.findLayerById(item.id);
          if (!_layer[`${val}_render`]) {
            const _renderer = _layer.renderer;
            _layer[`${val}_render`] = _renderer;
          }
          const targetRenderer = _layer[`${newVal}_render`] || {
            ...mapTypeRenderer[newVal],
            maxPixelIntensity: item.id == "company" ? 1000 : 10
          };
          _layer.renderer = targetRenderer;
        }
      });
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
    Plate: {
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
    icon_show_left: {
      handler(newVal, val) {
        this.show_left = newVal;
      },
      immediate: true
    },
    FrameName: {
      handler(newVal, val) {
        this.indexPoint(newVal);
        this.indexchange(true);
        this.isShow = false;
        this.eightShow = false;
      }
    },
    FrameShow: {
      handler(newVal, val) {
        this.indexShow = newVal;
      },
      immediate: true
    },
    Bquuid: {
      handler(newVal, val) {
        this.fetchCompany(newVal);
        this.change(true);
        this.indexShow = false;
        this.eightShow = false;
        this.goCompanyLocation(newVal);
      }
    },
    BqShow: {
      handler(newVal, val) {
        this.isShow = newVal;
      },
      immediate: true
    },
    type: {
      handler(newVal, val) {
        this.goIndex(newVal);
      }
    },
    moveLeft: {
      handler(newVal, val) {
        this.Left = newVal;
      }
    },
    CommonResult: {
      handler(newVal, val) {
        if (!newVal.features) return;
        if (
          newVal.features[0].attributes.FNAME ||
          newVal.features[0].attributes.NAME
        ) {
          this.indexPoint(newVal.features[0].attributes);
          this.setLocationSymbol(newVal.features[0].geometry);
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
      // const arr = ["农林牧渔业","装备制造","鞋材、鞋业","其他","房地产业","交通运输、仓储和邮政业","金融业","批发和零售业","其他服务业","信息传输、软件和信息技术服务业","住宿和餐饮业"]
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : eval(`this.${item.fun}(${item.takeParam ? `'${item.name}'` : ``})`);
        if (item.id == "chanyePlate" && this.map.findLayerById(item.id)) {
          const zoom = this.view.zoom;
          const shallPlate = zoom > 12 ? false : true;
          this.map.findLayerById("chanyePlate").visible = shallPlate;
        }
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
          this.addMapToolMap(item, () => {
            this.map.findLayerById("mbk").opacity =
              item.id == "simpleStyle" && this.map.findLayerById(item.id)
                ? 0.5
                : 1;
          });
        }
        this.map.findLayerById("mbk").opacity =
          item.id == "simpleStyle" && this.map.findLayerById(item.id) ? 0.6 : 1;
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
            "esri/layers/VectorTileLayer",
            "esri/layers/TileLayer",
            "esri/layers/GraphicsLayer"
          ],
          OPTION
        ).then(
          ([
            Map,
            MapView,
            Legend,
            VectorTileLayer,
            TileLayer,
            GraphicsLayer
          ]) => {
            // map加载底图
            that.map = new Map({
              spatialReference
            });
            //设置地图容器
            that.view = new MapView({
              container: that.$props.id,
              spatialReference,
              map: that.map,
              zoom:
                that.fromCanvass && that.$window.env == "outside"
                  ? 13
                  : window.user.style.length
                  ? window.user.style[0].mapStyle == "largeDataStyle"
                    ? 12
                    : 13
                  : 13,
              center: window.user.style.length
                ? window.user.style[0].mapStyle == "simpleStyle"
                  ? [120.67819448808013, 28.039695289562555]
                  : [120.66419448808013, 28.039695289562555]
                : [120.67819448808013, 28.039695289562555]
            });
            const layer = new VectorTileLayer({
              url:
                that.fromCanvass && that.$window.env == "outside"
                  ? IMAGELAYER
                  : window.user.style.length
                  ? window.user.style[0].mapStyle == "largeDataStyle"
                    ? IMAGELAYERDSJ
                    : IMAGELAYER
                  : IMAGELAYER
            });
            that.map.add(layer);
            if (
              window.user.style.length &&
              window.user.style[0].mapStyle == "image2017"
            ) {
              that.map.add(
                new TileLayer({
                  url: TDTIMAGE2017,
                  id: "image2017"
                })
              );
            }
            that.legend = new Legend({
              view: that.view
            });
            that.view.whenLayerView(layer).then(layerView => {
              if (!that.$props.CommonResult.features) {
                return;
              } else if (
                that.$props.CommonResult.features[0].attributes.FNAME ||
                that.$props.CommonResult.features[0].attributes.NAME
              ) {
                that.indexPoint(
                  that.$props.CommonResult.features[0].attributes
                );
                that.setLocationSymbol(
                  that.$props.CommonResult.features[0].geometry
                );
              } else {
                that.fetchCompany(
                  that.$props.CommonResult.features[0].attributes,
                  that.$props.CommonResult.features[0].geometry
                );
              }
            });
            // that.company && that.view.ui.add(that.legend, "bottom-right");
            that.view.on("click", function(evt) {
              if (that.$props.tag == "产业布局") {
                that.IdentifyTaskFun(evt, true);
              } else {
                that.jjtsIdentifyTaskFun(evt, false);
              }
            });
            //  zoom
            that.view.on("mouse-wheel", evt => {
              const zoom = that.view.zoom + (evt.deltaY > 0 ? -1 : 1);
              const shallPlate = zoom > 12 ? false : true;
              that.map.findLayerById("chanyePlate")
                ? (that.map.findLayerById("chanyePlate").visible =
                    shallPlate && this.leftOptions[0].children[0].check)
                : null;
            });
            resolve(true);
          }
        );
      });
    },
    //  添加旅遊
    addTravel(param) {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const travel = new MapImageLayer({
              url: LVYOU,
              id: "travel_" + param,
              sublayers: [{ id: 0, definitionExpression: `type = '${param}'` }]
            });
            that.map.add(travel, 4);
            resolve(true);
          }
        );
      });
    },
    async goTravel(item) {
      this.goTravelLocation(item);
      this.isShow = false;
      this.forceTravel = item;
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
            that.map.add(market, 4);
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
              sublayers: [{ id: 1 }]
            });
            that.map.add(featureProject, 4);
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
            that.map.add(topCompany, 4);
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
              url: JJTS,
              id: "build",
              sublayers: [{ id: 2 }]
            });
            that.map.add(build, 4);
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
              sublayers: [{ id: 4 }]
            });
            that.map.add(land, 4);
            resolve(true);
          }
        );
      });
    },
    //八大平台
    addChanye() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const liuqu = new MapImageLayer({
              url: CYBJ,
              id: "liuqu",
              sublayers: [{ id: 0 }]
            });
            //  优先级置顶
            that.map.add(liuqu, 5);
            resolve(true);
          }
        );
      });
    },
    //产业板块
    addChanyePlate() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const chanyePlate = new MapImageLayer({
              url: CYBJ,
              id: "chanyePlate",
              sublayers: [{ id: 3 }]
            });
            //  优先级置顶
            that.map.add(chanyePlate, 2);
            that.legend.layerInfos.push({
              layer: chanyePlate
            });
            resolve(true);
          }
        );
      });
    },
    //一廊横贯
    addyilang() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const yilang = new MapImageLayer({
              url: CYBJ,
              id: "yilang",
              sublayers: [{ id: 1 }]
            });
            //  优先级置顶
            that.map.add(yilang, 3);
            that.legend.layerInfos.push({
              layer: yilang
            });
            resolve(true);
          }
        );
      });
    },
    //一园
    addyiyuan() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const yiyuan = new MapImageLayer({
              url: CYBJ,
              id: "yiyuan",
              sublayers: [{ id: 5 }, { id: 2 }]
            });
            //  优先级置顶
            that.map.add(yiyuan, 3);
            resolve(true);
          }
        );
      });
    },
    //三轴纵深
    addsanzhou() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const sanzhou = new MapImageLayer({
              url: CYBJ,
              id: "sanzhou",
              sublayers: [{ id: 2 }]
            });
            //  优先级置顶
            that.map.add(sanzhou, 4);
            that.legend.layerInfos.push({
              layer: sanzhou
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
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const qh = new MapImageLayer({
              url: QHMB,
              id: "lcjjdt",
              sublayers: [{ id: 3 }, { id: 0 }]
            });
            that.map.add(qh);
            resolve(true);
          }
        );
      });
    },
    addmbk() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const mbk = new MapImageLayer({
              url: QHMB,
              id: "mbk",
              sublayers: [{ id: 1 }]
            });
            that.map.add(mbk);
            resolve(true);
          }
        );
      });
    },
    //  添加企业点
    addCompany() {
      const that = this;
      that.map &&
        that.map.findLayerById("company") &&
        that.map.remove(that.map.findLayerById("company"));
      if (!that.treePoint.length) return;
      loadModules(["esri/layers/MapImageLayer"], OPTION).then(
        ([MapImageLayer]) => {
          const definitionExpression = `行业分类 in (${that.treePoint
            .map(item => {
              return `'${item}'`;
            })
            .join(`,`)})`;
          const companyPoint = new MapImageLayer({
            url: CYBJ,
            id: "company",
            sublayers: [
              {
                id: 4,
                definitionExpression
              }
            ]
          });
          that.map.add(companyPoint, 5);
          that.legend.layerInfos.push({
            layer: companyPoint
          });
        }
      );
    },
    addExploit() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const exploit = new MapImageLayer({
              url: YZQY,
              id: "exploit",
              sublayers: [{ id: 0 }]
            });
            that.map.add(exploit, 4);
            resolve(true);
          }
        );
      });
    },
    //  添加热力图
    addHeat() {
      const that = this;
      if (that.Throttle) return;
      that.map &&
        that.map.findLayerById("heat") &&
        that.map.remove(that.map.findLayerById("heat"));
      if (!that.map || !that.shallHeat || !that.treeHeat.length) return;
      loadModules(
        ["esri/layers/FeatureLayer", "esri/renderers/HeatmapRenderer"],
        OPTION
      ).then(([FeatureLayer, HeatmapRenderer]) => {
        that.Throttle = true;
        const definitionExpression = `行业分类 in (${that.treeHeat
          .map(item => {
            return `'${item}'`;
          })
          .join(`,`)})`;
        var heatmapRenderer = new HeatmapRenderer({
          blurRadius: 6,
          colorStops: [
            { ratio: 0, color: "rgba(0, 255, 0, 0)" },
            { ratio: 0.02, color: "rgb(34, 151, 143)" },
            { ratio: 0.03, color: "rgb(0, 255, 0)" },
            { ratio: 0.04, color: "rgb(50, 255, 0)" },
            { ratio: 0.05, color: "rgb(250, 255, 0)" },
            { ratio: 0.06, color: "rgb(255, 205, 0)" },
            { ratio: 0.07, color: "rgb(255, 150, 0)" },
            { ratio: 0.08, color: "rgb(255, 95, 0)" },
            { ratio: 0.09, color: "rgb(255, 40, 0)" },
            { ratio: 0.1, color: "rgb(255, 0, 0)" }
          ],
          maxPixelIntensity:
            that.treeHeat.length == 11
              ? 600
              : heatHash[that.treeHeat[0]] || 600,
          minPixelIntensity: 1
        });
        const heat = new FeatureLayer({
          url: CYBJ + "/4",
          id: "heat",
          definitionExpression,
          renderer: heatmapRenderer,
          opacity: 0.7
        });
        that.map.add(heat, 5);
        that.Throttle = false;
      });
    },
    //  mapTool地图函数
    addMapToolMap({ id, url, layer }, fn) {
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
          fn && fn();
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
    forceTopicLocation([x, y]) {
      const that = this;
      loadModules(["esri/geometry/Point"], OPTION).then(([Point]) => {
        const mapPoint = new Point({ x, y });
        that.IdentifyTaskFun({ mapPoint });
      });
    },
    //  查询
    IdentifyTaskFun({ mapPoint }, fn) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const url = CYBJ;
        const identifyTask = new IdentifyTask(url);
        const params = new IdentifyParameters();
        params.tolerance = 10;
        params.layerIds = [0, 4];
        params.layerOption = "top";
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        identifyTask.execute(params).then(response => {
          if (!response.results[0].feature.attributes["统一社会信"]) {
            that.indexPoint(response.results[0].feature.attributes);
            that.view.goTo({ center: [mapPoint.x, mapPoint.y] });
            that.setLocationSymbol(response.results[0].feature.geometry);
            that.change(false);
            // that.Eightchange(false);
          } else if (that.treePoint.length) {
            that.fetchCompany(
              response.results[0].feature.attributes,
              response.results[0].feature.geometry
            );
            that.indexchange(false);
            that.eightShow = false;
          }
          fn && fn();
        });
      });
    },
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
          const identifyTask_TRAVEL = new IdentifyTask(LVYOU);
          const response_travel = await identifyTask_TRAVEL.execute(params);
          if (response_travel.results.length) {
            this.goTravel({
              ...response_travel.results[0].feature.attributes,
              name: response_travel.results[0].feature.attributes["名称"]
            });
          }
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
      // loadModules(
      //   [
      //     "esri/Graphic",
      //     "esri/core/watchUtils",
      //     "esri/views/2d/layers/BaseLayerViewGL2D",
      //     "esri/geometry/support/webMercatorUtils",
      //     "esri/core/promiseUtils"
      //   ],
      //   OPTION
      // ).then(([Graphic,watchUtils, BaseLayerViewGL2D,webMercatorUtils,promiseUtils]) => {

      //   that.view.graphics.add(graphic);
      // });
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
      if (INDEXTAG && !this.$parent.icon_show_left) {
        this.$parent.moveLeft = "30";
        this.$parent.icon_show_left = !this.$parent.icon_show_left;
      }
    },
    Eightchange(EightTag) {
      this.eightShow = EightTag;
      !EightTag && this.view.graphics.removeAll();
      if (EightTag && !this.$parent.icon_show_left) {
        this.$parent.moveLeft = "30";
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
    }
  }
};
</script>
 <style scoped lang="less">
.Map {
  width: 100%;
  height: 100%;
  .arcgisMap {
    width: 100%;
    height: 100%;
  }
}
</style>