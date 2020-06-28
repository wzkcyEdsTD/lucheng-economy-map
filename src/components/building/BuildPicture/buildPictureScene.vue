<template>
  <div class="buildMap">
    <div id="buildPictureScene"></div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  OPTION,
  WRT_config,
  FINEMODEL,
  IMAGELAYERDSJ,
  BUILDAROUND,
  LYHX,
  LYZS,
  NICEMODEL,
  LIGHTBAR,
  LIGHTBAR_RFEATURE,
  FINEMODEL_FEATURE
} from "@/components/common/Tmap";
const { server } = WRT_config;
import Building from "@/components/common/buildFrame/buildListData";
const { yylBuilding } = Building;
import { createPicutureMap, createUnusedMap, addUnused } from "./arcgis";
import indexApi from "@/api/beans/u_index";
import qyzcApi from "@/api/beans/u_qyzc";
import qynbApi from "@/api/beans/u_qynb";
export default {
  name: "buildPictureScene",
  data() {
    return {
      map: null,
      view: null,
      sceneLayerView: null,
      yylBuilding,
      scene: null,
      title: null,
      buildid: null,
      isShow: false,
      fromCanvass: false,
      forceCompany: [],
      x: null,
      y: null
    };
  },
  props: [
    "forceBuildingId",
    "mapsceneShow",
    "isAside",
    "lyItem",
    "fcClick",
    "commonSearch",
    "searchbox_display"
  ],
  watch: {
    mapsceneShow: {
      handler(newVal, val) {
        this.changeMapTool(newVal);
      },
      immediate: true
    },
    isAside: {
      handler(newVal, val) {
        this.changeMap();
      }
    },
    fcClick: {
      handler(newVal, val) {
        if (newVal) {
          this.gotoMap();
        } else {
          this.changeBuildingDisplay();
        }
      }
    }
  },
  created() {},
  async mounted() {
    await this.createMap(() => {
      this.changeMap();
    });
  },
  computed: {},
  methods: {
    createMap: function(fn) {
      const that = this;
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/layers/VectorTileLayer",
          "dojo/domReady!"
        ],
        OPTION
      ).then(([Map, SceneView, SceneLayer, VectorTileLayer]) => {
        const imgLayer = new VectorTileLayer({
          url: IMAGELAYERDSJ,
          id: "swyx"
        }); //三维底图
        that.map = new Map({ layers: [imgLayer /* imgBasic */] });
        that.view = new SceneView({
          container: "buildPictureScene",
          map: that.map,
          environment: {
            lighting: {
              directShadowsEnabled: true,
              ambientOcclusionEnabled: true
            }
          }
        });
        that.view.popup.autoOpenEnabled = false;
        //地图点击事件，显示楼宇信息，楼宇图片和楼层按钮
        that.view.on("click", function(evt_) {
          that.view.hitTest(evt_).then(response => {
            that.view.goTo({
              position: {
                x: response.results[0].mapPoint.x,
                y: response.results[0].mapPoint.y - 0.012,
                z: 1000,
                spatialReference: {
                  wkid: 4326
                }
              },
              heading: 0,
              tilt: 61
            });

            //帅选图层字段
            let attrs = response.results.filter(item => {
              return (
                item.graphic.layer.id == "lightbar" ||
                item.graphic.layer.id == "buildingsLayer1" ||
                item.graphic.layer.id == "buildingsLayer2" ||
                item.graphic.layer.id == "buildingsLayer3"
              );
            });
            const attr = attrs.length ? attrs[0] : null;
            if (!attr.graphic.attributes.固定id) {
              attr &&
                that.fetchBuild({
                  name: "objectid",
                  val: attr.graphic.attributes.objectid,
                  url: LIGHTBAR_RFEATURE
                });
            } else {
              attr &&
                that.fetchBuild({
                  name: "buildid",
                  val: attr.graphic.attributes.固定id,
                  url: FINEMODEL_FEATURE
                });
            }
          });
        });
        // 地图加载完成后视角
        that.view.whenLayerView(imgLayer).then(layerView => {
          that.view.goTo({
            position: {
              x: 120.66094203201507,
              y: 27.99906119621565,
              z: 800,
              spatialReference: {
                wkid: 4326
              }
            },
            heading: 0,
            tilt: 60
          });

          //  默认传入楼宇跳转定位
          that.fetchBuild({
            name: "buildid",
            val: this.lyItem || this.commonSearch,
            url: LIGHTBAR_RFEATURE
          });
        });
        fn && fn();
      });
    },
    changeMapTool(_item) {
      if (!this.map && !this.view) return;
    },

    /**
     * 楼宇属性表、地理位置获取
     */
    fetchBuild({ name, val, url = LIGHTBAR_RFEATURE }, fn) {
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
            if (that.$parent.isAside) {
              that.$parent.isAside = false;
            }
          }
        });
      });
    },
    closeAround() {
      this.map.findLayerById("graphics") &&
        this.map.remove(this.map.findLayerById("graphics"));
    },
    showAround(params) {
      this.fetchArea(params);
    },
    fetchArea({ radius, type }) {
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: `${BUILDAROUND}/${radius == 300 ? 16 : radius == 500 ? 17 : 18}`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `固定id='${that.buildid}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          // 结果不为空，则叠加企业面
          if (response.features.length) {
            const geometry = response.features[0].geometry;
            geometry.rings = [
              response.features[0].geometry.rings[0].map(item => {
                return [...item, 10];
              })
            ];
            that.fetchAreaPoint(
              geometry,
              response.features[0].attributes,
              type
            );
          }
        });
      });
    },
    fetchAreaPoint(geometry, attributes, type) {
      const typeHash = {
        sport: 1,
        store: 2,
        food: 3,
        hotel: 4,
        stop: 5,
        parkcar: 6,
        bank: 7,
        mall: 8,
        community: 9,
        building: 10,
        hospital: 11,
        school: 12,
        gas: 13,
        park: 14
      };
      const that = this;
      that.map.findLayerById("graphics") &&
        that.map.remove(that.map.findLayerById("graphics"));
      loadModules(
        [
          "esri/tasks/QueryTask",
          "esri/tasks/support/Query",
          "esri/layers/GraphicsLayer",
          "esri/Graphic"
        ],
        OPTION
      ).then(([QueryTask, Query, GraphicsLayer, Graphic]) => {
        const queryTask = new QueryTask({
          url: `${BUILDAROUND}/${typeHash[type] || 0}`
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = "1=1";
        query.extent = geometry.extent;
        query.geometry = geometry;
        // 查询参数为点
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          const graphicsLayer = new GraphicsLayer({
            id: "graphics"
          });
          that.map.add(graphicsLayer);
          const fillSymbol = {
            type: "simple-fill",
            color: [227, 139, 79, 0.6],
            outline: {
              color: [255, 255, 255],
              width: 1
            }
          };
          const polygonGraphic = new Graphic({
            geometry: {
              type: geometry.type,
              rings: geometry.rings[0]
            },
            symbol: fillSymbol
          });
          graphicsLayer.add(polygonGraphic);
          if (!response.features.length) return;
          response.features.map(item => {
            const z = 100;
            const point = {
              type: "point",
              x: item.geometry.x,
              y: item.geometry.y,
              z
            };
            const markerSymbol = {
              type: "picture-marker",
              url: `${server}/icon/aroundIcon/v5/${item.attributes.TYPE}.png`,
              width: "40px",
              height: "40px"
            };
            const pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol
            });
            graphicsLayer.add(pointGraphic);
            const textPoint = {
              type: "point",
              x: item.geometry.x,
              y: item.geometry.y,
              z: z + 30
            };
            const textGraphic = new Graphic({
              geometry: textPoint,
              symbol: {
                type: "text",
                color: "#fff",
                haloColor: "#333",
                haloSize: "1px",
                text: item.attributes.SHORTNAME,
                font: {
                  // autocasts as new Font()
                  size: 14,
                  family: "Josefin Slab"
                }
              }
            });
            graphicsLayer.add(textGraphic);
            const polyline = {
              type: "polyline",
              paths: [
                [item.geometry.x, item.geometry.y, 0],
                [item.geometry.x, item.geometry.y, z]
              ]
            };
            const lineSymbol = {
              type: "simple-line",
              color: [255, 215, 0],
              width: 2
            };
            const polylineGraphic = new Graphic({
              geometry: polyline,
              symbol: lineSymbol
            });
            graphicsLayer.add(polylineGraphic);
          });
        });
      });
    },
    changeBuildingDisplay() {
      const that = this;
      this.$parent.searchbox_display = false;
      this.$parent.buidinform_dispaly = true;
      this.yylBuilding.map(item => {
        if (`${that.buildid}` === item.objectid) {
          this.x = item.x;
          this.y = item.y;
        }
      });
      //  清除周边缓冲区
      that.map.findLayerById("graphics") &&
        that.map.remove(that.map.findLayerById("graphics"));
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: LYZS + "/5"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `固定id='${that.buildid}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            that.view.goTo({
              position: {
                x: that.x,
                y: that.y - 0.012,
                z: 1000,
                spatialReference: {
                  wkid: 4326
                }
              },
              heading: 0,
              tilt: 61
            });
          }
        });
      });
    },
    gotoMap() {
      this.view.goTo({
        position: {
          x: this.x - 0.003,
          y: this.y - 0.012,
          z: 1000,
          spatialReference: {
            wkid: 4326
          }
        },
        heading: 0,
        tilt: 60
      });
    },
    /**
     * 楼宇画像、闲置分析切换
     */
    changeMap() {
      if (!this.map && !this.view) return;
      createPicutureMap(this);
    },
    //显示入驻企业信息
    fetchCompany(uuid, fn) {
      const resultApi = [];
      qyzcApi
        .ds({ where: `uuid='${uuid.replace(/ /g, "")}'`, count: 10 })
        .then(({ data }) => {
          if (!data.length) return this.change(false);
          resultApi.push(data[0]);
          this.change(true);
          qynbApi
            .pjzb({
              where: `uuid='${uuid.replace(/ /g, "")}'`,
              count: 10
            })
            .then(({ data }) => {
              resultApi.push(data[0] || {});
              qynbApi
                .ds({
                  where: `a.uuid='${uuid.replace(/ /g, "")}'`,
                  count: 10
                })
                .then(({ data }) => {
                  resultApi.push(data);
                  qynbApi
                    .ydxx({
                      uuid: uuid.replace(/ /g, "")
                    })
                    .then(({ data }) => {
                      resultApi.push(data);
                      this.forceCompany = resultApi;
                      this.$nextTick(() => {
                        fn && fn();
                      });
                    });
                });
            });
        });
    },
    change(TAG) {
      this.isShow = TAG;
      TAG
        ? (this.$parent.checklistShow = false)
        : (this.$parent.checklistShow = true);
    }
  }
};
</script>
<style scoped lang="less">
.buildMap {
  height: 100%;
  width: 100%;
  #buildPictureScene {
    height: 100%;
    width: 100%;
  }
}
</style>