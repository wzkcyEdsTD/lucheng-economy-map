<template>
  <div class="Map">
    <div :id="id" class="buildPictureMap2"></div>
    <Tip />
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { spaceQuery } from "@/components/common/selectRadioFrame/mapMoving.js";
import {
  OPTION,
  IMAGELAYER,
  LYZS,
  QHMB,
  TDT25DCONFIG,
  TDT25D,
  spatialReference,
  IMAGELAYERDSJ,
  TDTIMAGE2017
} from "@/components/common/Tmap";
import Tip from "@/components/common/Tip";
export default {
  name: "buildMap",
  data() {
    return {
      fiveMark: "1=1",
      pyMark: null,
      sketchViewModel: null,
      activeWidget: null
    };
  },
  components: {Tip},
  props: {
    id: String,
    flag: Boolean,
    forceBuildingId: String,
    mapsceneShow: String,
    leftOptions: Array,
    mapTool: Object,
    type: String
  },
  watch: {
    mapsceneShow: {
      handler(newVal, val) {
        this.changeMapTool(newVal);
      }
    },
    forceBuildingId: {
      handler(newVal, val) {
        this.changeDisplaychange(true);
      }
    },
    leftOptions: {
      handler(newVal, val) {
        const that = this;
        if (!that.map) return;
        newVal.map(_item => {
          if (_item.children) {
            _item.children.map(item => {
              if (!item.id || !item.fun) return;
              that.doFun(item);
            });
          }
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
    }
  },
  created() {},
  async mounted() {
    await this.createMap();
    await this.addQh();
    this.mapsceneShow === "_25d" && (await this.add25d());
    this.$props.leftOptions &&
      this.$props.leftOptions.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          this.doFun(item);
        });
      });
    // await this.addPoint();
    spaceQuery(this);
  },
  computed: {},
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
    createMap() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/MapImageLayer",
            "esri/layers/TileLayer",
            "esri/layers/VectorTileLayer",
            "dojo/domReady!"
          ],
          OPTION
        ).then(([Map, MapView, MapImageLayer, TileLayer,VectorTileLayer]) => {
          // 矢量底图
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
            zoom: window.user.style.length
                ? window.user.style[0].mapStyle == "largeDataStyle"
                  ? 13
                  : 14
                : 14,
            center: [120.66092090621764, 28.010845855663625]
          });
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
          that.view.on("click", function(evt) {
            if (that.$props.type === "ly") {
              that.$parent.changName("buildPic");
              that.IdentifyTaskFun(evt, true);
            }
          });
          resolve(true);
        });
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
            sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
          });
          that.map.add(qh);
          resolve(true);
        });
      });
      //this.changeDisplaychange(true);
    },
    add25d() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/WebTileLayer", "esri/layers/support/TileInfo"],
          OPTION
        ).then(([WebTileLayer, TileInfo]) => {
          const tileInfo = new TileInfo(JSON.parse(TDT25DCONFIG));
          const _layer = new WebTileLayer(TDT25D, {
            tileInfo,
            id: "build_25d",
            spatialReference
          });
          that.map.add(_layer, 1);
          resolve(true);
        });
      });
    },
    IdentifyTaskFun({ mapPoint }, fn) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(([IdentifyTask, IdentifyParameters]) => {
        const url = LYZS;
        const identifyTask = new IdentifyTask(url);
        const params = new IdentifyParameters();
        params.tolerance = 10;
        params.width = that.view.width;
        params.height = that.view.height;
        params.returnGeometry = true;
        params.geometry = mapPoint;
        params.mapExtent = that.view.extent;
        identifyTask.execute(params).then(response => {
          console.log("entry-IdentifyTaskFun");
          console.log("res", response);
          that.$parent.JumpPic(response.results[0].feature.attributes);
          fn && fn();
        });
      });
    },
    addghyp() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const ghyp = new MapImageLayer({
              url: LYZS,
              id: "ghyp",
              sublayers: [
                {
                  id: 0,
                  visible: true
                }
              ]
            });
            that.map.add(ghyp);
            resolve(true);
          }
        );
      });
    },
    addysyp() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const ysyp = new MapImageLayer({
              url: LYZS,
              id: "ysyp",
              sublayers: [
                {
                  id: 1,
                  visible: true
                }
              ]
            });
            that.map.add(ysyp);
            resolve(true);
          }
        );
      });
    },
    addzsyp() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const zsyp = new MapImageLayer({
              url: LYZS,
              id: "zsyp",
              sublayers: [
                {
                  id: 2,
                  visible: true
                }
              ]
            });
            that.map.add(zsyp);
            resolve(true);
          }
        );
      });
    },
    addjqyp() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const jqyp = new MapImageLayer({
              url: LYZS,
              id: "jqyp",
              sublayers: [
                {
                  id: 3,
                  visible: true
                }
              ]
            });
            that.map.add(jqyp);
            resolve(true);
          }
        );
      });
    },
    addpyyp() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const pyyp = new MapImageLayer({
              url: LYZS,
              id: "pyyp",
              sublayers: [
                {
                  id: 4,
                  visible: true
                }
              ]
            });
            that.map.add(pyyp);
            resolve(true);
          }
        );
      });
    },
    //培育一批
    addtwo() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const tow = new MapImageLayer({
              url: LYZS,
              id: "tow",
              sublayers: [
                {
                  id: 5,
                  definitionExpression: "tidui=4"
                }
              ]
            });
            that.map.add(tow);
            resolve(true);
          }
        );
      });
    },
    addfive() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const five = new MapImageLayer({
              url: LYZS,
              id: "five",
              sublayers: [
                {
                  id: 5,
                  definitionExpression: "tidui=3"
                }
              ]
            });
            that.map.add(five);
            resolve(true);
          }
        );
      });
    },
    addeight() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const eight = new MapImageLayer({
              url: LYZS,
              id: "eight",
              sublayers: [
                {
                  id: 5,
                  definitionExpression: "tidui=2"
                }
              ]
            });
            that.map.add(eight);
            resolve(true);
          }
        );
      });
    },
    addmillion() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            if (that.map.findLayerById("million")) return;
            const million = new MapImageLayer({
              url: LYZS,
              id: "million",
              sublayers: [
                {
                  id: 5,
                  definitionExpression: "tidui=1"
                }
              ]
            });
            that.map.add(million);
            resolve(true);
          }
        );
      });
    },
    //楼宇画像地图工具
    async changeMapTool(_item) {
      if (_item === "2d") {
        this.map.findLayerById("build_25d") &&
          (this.map.findLayerById("build_25d").visible = false);
      } else {
        if (this.map.findLayerById("build_25d")) {
          this.map.findLayerById("build_25d").visible = true;
        } else {
          this.add25d();
        }
      }
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
    changeDisplaychange(flag) {
      const that = this;
      let x;
      let y;
      this.$parent.searchbox_display = !flag;
      this.$parent.buidinform_dispaly = flag;
      if (flag) {
        loadModules(
          ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
          OPTION
        ).then(([QueryTask, Query]) => {
          const queryTask = new QueryTask({
            url: LYZS + "/5"
          });
          const query = new Query();
          query.outFields = ["*"];
          query.where = `固定id= '${that.forceBuildingId}'`;
          query.returnGeometry = true;
          queryTask.execute(query).then(response => {
            if (response.features.length) {
              // const objectId = response.features[0].attributes.objectid;

              console.log("entry-changeDisplaychange");

              that.view.goTo({
                center: [
                  response.features[0].attributes.POINT_X,
                  response.features[0].attributes.POINT_Y
                ]
              });
            }
          });
        });
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
  height: 100%;
  .buildPictureMap2 {
    height: 100%;
  }
}
</style>