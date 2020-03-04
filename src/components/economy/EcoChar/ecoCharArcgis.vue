<template>
  <div class="Map">
    <div id="ecoCharArcgis" class="arcgisMap"></div>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import {
  OPTION,
  spatialReference,
  IMAGELAYER,
  JJTS,
  QHMB,
  STREETPOINT,
  WRT_config
} from "@/components/common/Tmap";
const { server } = WRT_config;
let map;
let view;
export default {
  name: "ecoCharArcgis",
  data() {
    return {
      isShow: false,
      map: null,
      sketchViewModel: null,
      view: null
    };
  },
  props: [],
  components: {},
  props: {
    id: String,
    forceChar: Object,
    mark: {
      type: Number,
      default: 0
    },
    fromCanvass: Boolean,
    mapTool: Object,
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
          this.addMapToolMap(item)
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
              sublayers: [{ id: 1 }]
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
              url: JJTS,
              id: "build",
              sublayers: [{ id: 2 }]
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
              sublayers: [{ id: 4 }]
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