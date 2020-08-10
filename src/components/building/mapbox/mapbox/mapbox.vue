<template>
  <div class="buildMap">
    <div id="main"></div>
    <transition name="frame">
      <Frame
        @close="change(false)"
        v-if="isShow"
        :company="forceCompany"
        :fromCanvass="fromCanvass"
      />
    </transition>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import {
  OPTION,
  WRT_config,
  IMAGELAYER,
  MAPBOXLAYER,
  BUILDAROUND,
  LIGHTBAR_RFEATURE,
  JJTS,
  LYZS
} from "@/components/common/Tmap";
const { server } = WRT_config;
import { buildNames } from "../assets/buildNames.js";
import Building from "@/components/common/buildFrame/buildListData";
const { yylBuilding } = Building;
import indexApi from "@/api/beans/u_index";
import lcxxApi from "@/api/beans/u_lcxx";
import qyzcApi from "@/api/beans/u_qyzc";
import qynbApi from "@/api/beans/u_qynb";
import Frame from "@/components/economy/EcoArcgis/frame";
const modelListArr = [
  "shimao1",
  "shimao2",
  "fazhan1",
  "fazhan2",
  "zhongtong1",
  "zhongtong2",
  "chengyuan",
  "guoxin",
  "huameng",
  "jianshe",
  "longrui",
  "lugang",
  "songtai",
  "xincheng",
  "zhixin"
];
const modelListObj = {
  5: ["shimao1", "shimao2"],
  4: ["fazhan1", "fazhan2"],
  3: ["zhongtong1", "zhongtong2"],
  16: ["chengyuan"],
  20: ["guoxin"],
  1: ["huameng"],
  15: ["jianshe"],
  14: ["longrui"],
  21: ["lugang"],
  13: ["songtai"],
  9: ["xincheng"],
  11: ["zhixin"]
};
export default {
  name: "mapbox",
  data() {
    return {
      chart: null,
      options: null,
      typeList: [
        "便利店",
        "宾馆酒店",
        "餐饮",
        "大楼大厦",
        "房产小区",
        "公交站",
        "公园广场",
        "购物百货",
        "加油站",
        "停车场",
        "学校",
        "医院",
        "银行",
        "娱乐健身"
      ],
      modelList: [],
      yylBuilding,
      buildid: null,
      isShow: false,
      fromCanvass: false,
      forceCompany: [],
      x: null,
      y: null,
      tempPoint: [],
      lyItemid: null
    };
  },
  components: { Frame },
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
    isAside: {
      handler(newVal, val) {
        this.changeMap();
      }
    },
    lyItem: {
      handler(newVal, Val) {
        this.lyItemid = newVal;
      },
      immediate: true
    }
  },

  created() {},
  async mounted() {
    this.$hub.$off("model-on");
    this.$hub.$on("model-on", async () => {
      await this.init();
    });
  },
  methods: {
    init() {
      const that = this;
      return new Promise((resolve, reject) => {
        if (that.map) return resolve(true);
        that.map = new window.mapboxgl.Map({
          container: "main",
          center: [120.68752090621764, 28.010845855663625, 0],
          zoom: 13,
          pitch: 45,
          altitudeScale: 2,
          style: {
            version: 8,
            glyphs: `${IMAGELAYER}/tile/13/{fontstack}/{range}.pbf`,
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [
                  `${MAPBOXLAYER}/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png`
                ],
                tileSize: 256
              }
            },
            layers: [
              {
                id: "simple-tiles",
                type: "raster",
                source: "raster-tiles",
                minzoom: 0,
                maxzoom: 22
              }
            ]
          },
          postEffect: {
            enable: true,
            FXAA: {
              enable: true
            }
          }
        });

        that.map.on("style.load", () => {
          // 商务楼
          that.createBusinessModel();
          that.fetchBuild({
            name: "buildid",
            val: this.lyItemid,
            url: JJTS + "/2"
          });

          // 分块顺序加载白模
          that
            .createBaseModel(0)
            .then(() => {
              return that.createBaseModel(1);
            })
            .then(() => {
              return that.createBaseModel(2);
            })
            .then(() => {
              return that.buildPicLoad();
            })
            .then(() => {
              return that.addBuildPic();
            })
            .then(() => {
              return that.createBackModel();
            })
            .then(() => {
              return that.aroundPicLoad();
            });

          //控规模型
          that
            .createKGModel(0)
            .then(() => {
              return that.createKGModel(1);
            })
            .then(() => {
              return that.createKGModel(2);
            });

          that.map.on("click", e => {
            const features = that.map.queryRenderedFeatures(e.point, {
              layers: ["swl_back"]
            });

            if (features.length) {
              that.$parent.build_gdid = features[0].properties.ID;
              that.closeAround();
              that.fetchBuild({
                name: "buildid",
                val: features[0].properties.ID,
                url: JJTS + "/2"
              });
            }
          });
        });
        resolve(true);
      });
    },

    // 添加精细模型
    addModelLayers(doAll, buildid) {
      const value = modelListObj[buildid];
      const that = this;
      var promise = new Promise((resolve, reject) => {
        // that.modelList = [...modelListArr];
        const _modelList_ = [];
        modelListArr.map(item => {
          if (doAll) {
            if (!~that.modelList.indexOf(item)) {
              that.map.addLayer(
                that.createModelLayer(item, [
                  120.66662090621764,
                  28.014045855663625,
                  0
                ])
              );
              _modelList_.push(item);
            }
          } else {
            value &&
              value.map(v => {
                if (!~that.modelList.indexOf(v) && item == v) {
                  that.map.addLayer(
                    that.createModelLayer(item, [
                      120.66662090621764,
                      28.014045855663625,
                      0
                    ])
                  );
                  _modelList_.push(item);
                }
              });
          }
        });
        that.modelList = that.modelList.concat(_modelList_);
        that.modelList.map(item => {
          that.map.setLayoutProperty(item, "visibility", "visible");
        });
        resolve();
      });
      return promise;
    },

    // 创建白模
    createBaseModel(mId) {
      const that = this;

      var promise = new Promise((resolve, reject) => {
        that.map.addLayer({
          id: `baseModel${mId}-1`,
          type: "fill-extrusion",
          source: {
            type: "geojson",
            data: `${server}/mapbox/geojson/kgbm${mId}.geojson`
          },
          paint: {
            "fill-extrusion-color": "rgba(162, 169, 183, 1)",
            "fill-extrusion-height": ["get", "e3"],
            "fill-extrusion-opacity": 0.8
          }
        });

        resolve();
      });
      return promise;
    },
    // 创建控规模型
    createKGModel(mId) {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        that.map.addLayer({
          id: `kgModel${mId}-1`,
          type: "fill-extrusion",
          source: {
            type: "geojson",
            data: `${server}/mapbox/geojson/kgbm${mId}.geojson`
          },
          layout: {
            visibility: "none"
          },
          paint: {
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "e3"],
            "fill-extrusion-opacity": 0.6
          }
        });
        resolve();
      });
      return promise;
    },

    // 加载周边查询图片
    aroundPicLoad() {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        for (let item of that.typeList) {
          that.map.loadImage(
            `${server}/mapbox/img/around_pic/${item}.png`,

            (error, image) => {
              if (error) throw error;
              if (!that.map.hasImage(`type${item}`))
                that.map.addImage(`type${item}`, image);
            }
          );
        }

        resolve();
      });
      return promise;
    },

    // 加载商务楼名字图片
    buildPicLoad() {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        for (let item of buildNames.features) {
          that.map.loadImage(
            `${server}/mapbox/img/name_pic/${item.attributes.固定id}.png`,
            (error, image) => {
              if (error) throw error;
              if (!that.map.hasImage(`name${item.attributes.固定id}`))
                that.map.addImage(`name${item.attributes.固定id}`, image);
            }
          );
        }
        resolve();
      });
      return promise;
    },

    // 添加商务楼名字图片
    addBuildPic() {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        that.map.addLayer({
          id: "buildNamePic",
          type: "symbol",
          source: {
            type: "geojson",
            data: `${server}/mapbox/geojson/buildNames.geojson`
          },
          layout: {
            "icon-image": "name{固定id}",
            "icon-offset": [0, -20],
            "icon-anchor": "bottom",
            "icon-allow-overlap": true,
            "icon-size": 0.9
          }
        });

        resolve();
      });
      return promise;
    },

    // 创建商务楼模型
    createBusinessModel() {
      const that = this;
      that.map.addLayer({
        id: "swl",
        type: "fill-extrusion",
        source: {
          type: "geojson",
          data: `${server}/mapbox/geojson/swl.geojson`
        },
        layout: {
          visibility: "visible"
        },
        paint: {
          "fill-extrusion-opacity": 1,
          "fill-extrusion-color": ["get", "color"],
          "fill-extrusion-height": ["get", "e6"]
        }
      });
    },

    // 创建商务楼模型_透明
    createBackModel() {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        that.map.addLayer({
          id: "swl_back",
          type: "fill-extrusion",
          source: {
            type: "geojson",
            data: `${server}/mapbox/geojson/swl.geojson`
          },
          layout: {
            visibility: "visible"
          },
          paint: {
            "fill-extrusion-opacity": 0,
            "fill-extrusion-color": ["get", "color"],
            "fill-extrusion-height": ["get", "e6"]
          }
        });
        resolve();
      });
      return promise;
    },

    // 创建精细模型
    createModelLayer(mName, mOrigin) {
      var modelRotate = [Math.PI / 2, 0, 0];

      var modelAsMercatorCoordinate = window.mapboxgl.MercatorCoordinate.fromLngLat(
        mOrigin
      );

      var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],

        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
      };

      const THREE = window.THREE;

      return {
        id: mName,
        type: "custom",
        renderingMode: "3d",
        onAdd: function(map, gl) {
          this.camera = new THREE.Camera();
          this.scene = new THREE.Scene();

          var directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          var directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          var directionalLight3 = new THREE.DirectionalLight(0xffffff);
          directionalLight3.position.set(0, 70, -100).normalize();
          this.scene.add(directionalLight3);

          var directionalLight4 = new THREE.DirectionalLight(0xffffff);
          directionalLight4.position.set(0, -70, -100).normalize();
          this.scene.add(directionalLight4);

          var loader = new THREE.GLTFLoader();

          loader.load(
            `${server}/mapbox/models/${mName}.gltf`,
            function(gltf) {
              this.scene.add(gltf.scene);
            }.bind(this)
          );

          this.map = map;

          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
          });

          this.renderer.autoClear = false;
        },
        render: function(gl, matrix) {
          var rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX
          );
          var rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
          );
          var rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
          );

          var m = new THREE.Matrix4().fromArray(matrix);
          var l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale
              )
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          this.camera.projectionMatrix = m.multiply(l);
          this.renderer.state.reset();
          this.renderer.render(this.scene, this.camera);
          this.map.triggerRepaint();
        }
      };
    },

    // 创建范围面
    createPolygon(center, radius) {
      const that = this;
      that.map.addSource("around", that.createGeoJSONCircle(center, radius));

      that.map.addLayer({
        id: "around",
        type: "fill-extrusion",
        source: "around",
        paint: {
          "fill-extrusion-color": "rgb(255, 0, 0)",
          "fill-extrusion-opacity": 0.3
        }
      });
    },

    // 画圆范围面
    createGeoJSONCircle(center, radius) {
      const points = 64;

      var coords = {
        latitude: center[1],
        longitude: center[0]
      };

      var km = radius / 1000;

      var ret = [];
      var distanceX =
        km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
      var distanceY = km / 110.574;

      var theta, x, y;
      for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
      }
      ret.push(ret[0]);

      return {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [ret]
              }
            }
          ]
        }
      };
    },

    // 创建周边查询图片
    addAroundPic(geoData) {
      const that = this;
      var promise = new Promise((resolve, reject) => {
        that.map.addLayer({
          id: "aroundPic",
          type: "symbol",
          source: {
            type: "geojson",
            data: geoData
          },
          layout: {
            "icon-image": "type{TYPE}",
            "icon-offset": [0, -20],
            "icon-anchor": "bottom",
            "icon-size": 0.7,
            "icon-allow-overlap": true,
            "text-field": "{NAME}",
            "text-offset": [0, -4]
          },
          paint: {
            "text-opacity": 1,
            "text-color": "#FFFFFF",
            "text-halo-color": "rgba(0, 0, 0, 1)",
            "text-halo-width": 2
          }
        });

        resolve();
      });
      return promise;
    },

    // 移除图层
    removeLayer(layerId) {
      const that = this;
      if (that.map.getLayer(layerId)) {
        that.map.removeLayer(layerId);
        that.map.removeSource(layerId);
      }
    },

    // 显示周边查询
    showAround(params) {
      this.fetchArea(params);
    },

    // 获取范围
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
        query.where = `buildid=${that.buildid}`;
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
              radius,
              type
            );
          }
        });
      });
    },

    // 获取范围内的点
    fetchAreaPoint(geometry, attributes, radius, type) {
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
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
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
          const geo = that.convertToGeo(response.features);
          that.map.flyTo({
            zoom: 16,
            center: that.tempPoint,
            pitch: 60
          });

          that.closeAround();

          that.addAroundPic(geo);

          that.createPolygon(
            [geometry.extent.center.x, geometry.extent.center.y],
            radius
          );
        });
      });
    },

    // 转换成geojson格式
    convertToGeo(data) {
      let list = { type: "FeatureCollection", features: [] };

      data.map(item => {
        list.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.geometry.x, item.geometry.y]
          },
          properties: {
            OBJECTID: item.attributes.OBJECTID,
            NAME: item.attributes.NAME,
            TYPE: item.attributes.TYPE
          }
        });
      });

      return list;
    },

    fetchBuild({ name, val, url = JJTS + "/2" }, fn) {
      if (!val) return;
      console.log("entry-fetchBuild");
      const that = this;
      const arr = [0, 0, 0];
      let lyhx = {};

      that.buildid = val;
      indexApi.lcxx({ where: `gdid='${that.buildid}'` }).then(({ data }) => {
        if (!data.length) return;
        data.map(item => {
          if (item.status == "0") {
            //入驻企业数
            arr[0]++;
          } else if (item.status == "2") {
            //闲置面积
            arr[2] += item.jzmj ? parseFloat(item.jzmj) : 0;
          }
          //总面积
          arr[1] += item.jzmj ? parseFloat(item.jzmj) : 0;
        });
        lyhx = data.map(item => {
          return {
            ...item,
            _mj: arr[1],
            _rzqy: arr[0],
            _rzl: arr[1] && arr[2] ? arr[2] / arr[1] : ""
          };
        });
        that.$parent.forceBuilding = lyhx[0];
      });
      that.changeBuildingDisplay(() => {
        that.$parent.isAside = +new Date();
      });
    },
    changeBuildingDisplay(fn) {
      const that = this;
      that.$parent.searchbox_display = false;
      that.$parent.buidinform_dispaly = true;
      // that.yylBuilding.map(item => {
      //   if (`${that.buildid}` === item.objectid) {
      //     that.x = item.x;
      //     that.y = item.y;
      //   }
      // });
      //  清除周边缓冲区
      that.closeAround();
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: LYZS + "/5"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `gdid='${that.buildid}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const { x, y } = response.features[0].geometry;
            const point = [x, y + 0.0025];
            that.map.flyTo({
              center: point,
              zoom: 16.5,
              pitch: 60,
              bearing: 0
            });
            that.tempPoint = point;
            that.x = x;
            that.y = y;
            fn && fn();
          }
        });
      });
    },

    closeAround() {
      this.removeLayer("aroundPic");
      this.removeLayer("around");
    },

    // 楼宇画像、闲置分析切换
    changeMap() {
      if (!this.map) return;
      const that = this;

      // 楼宇名称显示隐藏
      that.map.setLayoutProperty(
        "buildNamePic",
        "visibility",
        that.isAside == "闲置分析" ? "visible" : "none"
      );
      if (that.isAside == "闲置分析") {
        if (that.modelList.length) {
          that.modelList.map(item => {
            that.map.setLayoutProperty(item, "visibility", "none");
          });
        }
        for (let i = 0; i < 3; i++) {
          that.map.setLayoutProperty(`kgModel${i}-1`, "visibility", "none");
          that.map.setLayoutProperty(
            `baseModel${i}-1`,
            "visibility",
            "visible"
          );
        }
        // 商务楼显示
        that.map.setFilter("swl", ["all"]);
      } else if (that.isAside == "控制性规划") {
        for (let i = 0; i < 3; i++) {
          that.map.setLayoutProperty(`kgModel${i}-1`, "visibility", "visible");
          that.map.setLayoutProperty(`baseModel${i}-1`, "visibility", "none");
        }
      } else {
        for (let i = 0; i < 3; i++) {
          that.map.setLayoutProperty(`kgModel${i}-1`, "visibility", "none");
          that.map.setLayoutProperty(
            `baseModel${i}-1`,
            "visibility",
            "visible"
          );
        }
        // 商务楼筛选显示
        that.map.setFilter("swl", [
          "!in",
          "ID",
          1,
          3,
          4,
          5,
          9,
          11,
          13,
          14,
          15,
          16,
          20,
          21
        ]);
        that.addModelLayers(that.isAside == "三维沙盘", that.buildid);
      }
    },

    //显示入驻企业信息
    fetchCompany(uuid, fn) {
      const resultApi = [];
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
    },
    changeMapLoc(isOffset) {
      if (this.tempPoint.length != 0) {
        let center;
        if (isOffset) {
          center = [this.tempPoint[0] - 0.0025, this.tempPoint[1]];
        } else {
          center = [this.tempPoint[0], this.tempPoint[1]];
        }
        this.map.flyTo({
          zoom: 16.5,
          center: center,
          pitch: 60
        });
      }
    }
  }
};
</script>

<style lang="less">
@import url("./mapbox.css");
.buildMap {
  height: 100%;
  width: 100%;
  #main {
    width: 100%;
    height: 100%;
  }
}
</style>