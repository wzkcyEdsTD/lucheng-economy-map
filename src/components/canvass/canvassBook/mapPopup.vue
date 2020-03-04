<template>
  <div class="mapFrame">
    <div class="title">
      <!-- <p>{{`${this.$props.canvass["name"]}`}}</p> -->
      <i class="iconfont iconRectangleCopy" @click="leftclose(false)"></i>
    </div>
    <div id="innerMap"></div>
  </div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import {
  OPTION,
  spatialReference,
  IMAGELAYER,
  TDTIMAGE2017,
  TDTJY,
  ZSZY,
  CANVASS ,
  ALLLANDREGULATORY,
  TDT25DCONFIG,
  QHMB,
  LANDSOLD,
  DKHX,
} from "@/components/common/Tmap";
import canvassApi from "@/api/beans/u_canvass";
export default {
  name: "map-popup",
  data() {
    return {
      map: null,
      view: null
    };
  },
  components: {},
  props: {
    locOption: Object
  },
  created() {},
  async mounted() {
    const that = this;
    /**init map**/
    await this.createMap();
    await this.addQh();
    await this.addCanvass();
    // await this.addCanvassRegulatory();
    // this.addLandSold();
  },
  watch: {},
  computed: {},
  methods: {
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
            url: IMAGELAYER
          });
          // map加载底图
          that.map = new Map({
            spatialReference,
            layers: [layer]
          });
          //设置地图容器
          that.view = new MapView({
            container: "innerMap",
            spatialReference,
            map: that.map,
            // zoom: 12,
            // center: [120.61419448808013, 28.039695289562555]
            zoom: that.locOption.zoom,
            center: that.locOption.center
          });
          // that.legend = new Legend({
          //   view: that.view
          // });
          // that.view.ui.add(that.legend, "bottom-right");

          // console.log(that.position);

          resolve(true);
        });
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
              sublayers: [{ id: 3 }, { id: 2 }]
            });
            that.map.add(canvassArea, 5);
            const canvassPoint = new MapImageLayer({
              url: ZSZY,
              id: "canvassPoint",
              sublayers: [{ id: 0 }]
            });
            that.map.add(canvassPoint, 5);
            // that.legend.layerInfos.push({
            //   layer: canvassPoint
            // });
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
            sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
          });
          that.map.add(qh, 2);
          resolve(true);
        });
      });
    },
    //  招商规划
    addCanvassRegulatory() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const canvassRegulatory = new MapImageLayer({
              url: CANVASS,
              id: "canvassRegulatory",
              sublayers: [{ id: 3 }]
            });
            that.map.add(canvassRegulatory, 2);
            // that.legend.layerInfos.push({
            //   layer: canvassRegulatory
            // });
            resolve(true);
          }
        );
      });
    },
    addLandSold() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(["esri/layers/MapImageLayer"], OPTION).then(
          ([MapImageLayer]) => {
            const landSold = new MapImageLayer({
              url: DKHX,
              id: "landSold",
              sublayers: [{ id: 0 }]
            });
            that.map.add(landSold, 4);
            resolve(true);
          }
        );
      });
    },
    leftclose(tag) {
      this.$parent.isShow = tag;
    }
  }
};
</script>
 

<style scoped lang="less">
.mapFrame {
  position: absolute;
  z-index: 120;
  top: 100px;
  left: 20px;
  height: 80%;
  width: 80%;
  transition: all 1s;
  background: rgba(19, 45, 85, 0.9);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 10px;
  flex-direction: column;
  .title {
    width: 100%;
    height: 6%;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    .iconRectangleCopy {
      cursor: pointer;
      font-size: 34px;
      position: absolute;
      right: 30px;
    }
    p {
      width: 88%;
      font-size: 20px;
      color: #2cf6ff;
      text-align: center;
      display: inline-block;
      margin: 0 auto;
    }
  }

  #innerMap {
    width: 100%;
    height: 94%;
  }
}
</style>