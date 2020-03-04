<template>
  <div class="Map">
    <div :id="id"></div>
    <Tip />
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  spaceQuery,
  clearQuery,
  doSpaceQuery,
  doCircleQuery,
  distanceMeasure,
  areaMeasure,
  addMapToolMap
} from "@/components/common/selectRadioFrame/mapMoving.js";
import {
  OPTION,
  IMAGELAYER,
  QHMB,
  LCGF,
  spatialReference,
  IMAGELAYERDSJ,
  TDTIMAGE2017,
  WRT_config
} from "@/components/common/Tmap";
const { server } = WRT_config;
import Tip from "@/components/common/Tip";
export default {
  name: "buildLcgfMap",
  data() {
    return {
      map: null,
      view: null,
      sketchViewModel: null,
      activeWidget: null
    };
  },
  components: { Tip },
  props: {
    id: String,
    mapTool: Object,
    leftOptions: Array
  },
  watch: {
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
  async mounted() {
    await this.createMap();
    this.$props.leftOptions &&
      this.$props.leftOptions.map(_item => {
        _item.children.map(item => {
          //  id,fun 都存在表明有该选项的对应画图函数
          if (!item.id || !item.fun) return;
          this.doFun(item);
        });
      });
    spaceQuery(this);
  },
  computed: {},
  methods: {
    spaceQuery,
    clearQuery,
    doSpaceQuery,
    doCircleQuery,
    distanceMeasure,
    areaMeasure,
    /**
     * 数、组勾选触发图层寻找
     * @param {Object} item 单个元素
     */
    doFun(item) {
      if (item.check) {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = true)
          : eval(`this.${item.fun}(this,item)`);
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
          addMapToolMap(item, this);
        }
      } else {
        this.map && this.map.findLayerById(item.id)
          ? (this.map.findLayerById(item.id).visible = false)
          : null;
      }
    },
    forceLcgf({ dz }) {
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(async ([QueryTask, Query]) => {
        const queryTask = new QueryTask({ url: LCGF + "/0" });
        const query = new Query({
          outFields: ["*"],
          where: `dz='${dz}'`,
          returnGeometry: true
        });
        const { features } = await queryTask.execute(query);
        features.length && this.popUp(features[0]);
      });
    },
    identifyLcgf({ mapPoint }) {
      const that = this;
      loadModules(
        ["esri/tasks/IdentifyTask", "esri/tasks/support/IdentifyParameters"],
        OPTION
      ).then(async ([IdentifyTask, IdentifyParameters]) => {
        const identifyTask = new IdentifyTask({ url: LCGF });
        const params = new IdentifyParameters({
          geometry: mapPoint,
          tolerance: 8,
          width: that.view.width,
          height: that.view.height,
          returnGeometry: true,
          mapExtent: that.view.extent,
          layerIds: [0]
        });
        const { results } = await identifyTask.execute(params);
        results.length && this.popUp(results[0].feature);
      });
    },
    popUp({ attributes, geometry }) {
      this.view.popup.visible = false;
      this.view.popup = {
        title: attributes["dz"],
        content: `<div class="poptemplate_frame">
              <div>房屋状态: ${attributes["fwzt"] || `-`}</div>
              <div>面积(㎡): ${attributes["mj"] || `-`}</div>
              <div>权属单位: ${attributes["qsdw"] || `-`}</div>
              <div>房屋用途: ${attributes["fwyt"] || `-`}</div>
            </div>`,
        location: geometry
      };
      this.view.popup.visible = true;
      this.view.goTo(geometry);
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
        ).then(([Map, MapView, MapImageLayer, TileLayer, VectorTileLayer]) => {
          // 矢量底图
          const layer = new VectorTileLayer({
            // url: IMAGELAYER
            url: window.user.style.length
              ? window.user.style[0].mapStyle == "largeDataStyle"
                ? IMAGELAYERDSJ
                : IMAGELAYER
              : IMAGELAYER
          });
          const qh = new MapImageLayer({
            url: QHMB,
            id: "lcjjdt",
            sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
          });
          // map加载底图
          that.map = new Map({
            spatialReference,
            layers: [layer, qh]
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
            that.identifyLcgf(evt);
          });
          resolve(true);
        });
      });
    },
    addLcgfPoint(context, { id }) {
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/MapImageLayer", "dojo/domReady!"],
          OPTION
        ).then(([MapImageLayer]) => {
          context.map.add(
            new MapImageLayer({
              url: LCGF,
              id,
              sublayers: [{ id: 0 }]
            })
          );
          resolve(true);
        });
      });
    },
    addLcgfPolygon(context, { id }) {
      return new Promise((resolve, reject) => {
        loadModules(
          ["esri/layers/MapImageLayer", "dojo/domReady!"],
          OPTION
        ).then(([MapImageLayer]) => {
          context.map.add(
            new MapImageLayer({
              url: LCGF,
              id,
              sublayers: [{ id: 1 }]
            })
          );
          resolve(true);
        });
      });
    }
  }
};
</script>
 <style scoped lang="less">
.Map {
  height: 100%;
  #buildLcgf_map {
    height: 100%;
  }
}
</style>