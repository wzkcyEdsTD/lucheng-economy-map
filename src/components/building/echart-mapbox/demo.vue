<template>
  <div class="demo">
    <div id="main"></div>
    <button id="change">精模/粗模</button>
    <button id="fly">Fly</button>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      chart: null,
      map: null,
      Line: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const that = this;
      this.chart = window.echarts.init(document.getElementById("main"));
      var origin = [120.66092090621764, 28.010845855663625, 0];
      const option = {
        mapbox3D: {
          center: origin,
          zoom: 14,
          pitch: 60,
          heading: 41,
          altitudeScale: 2,
          // 地图
          style: {
            version: 8,
            sources: {
              "raster-tiles": {
                type: "raster",
                tiles: [
                  "http://192.168.0.123:6080/arcgis/rest/services/DT1022/MapServer/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png"
                  // "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/WMTS/tile/1.0.0/MyM/default/default028mm/{z}/{y}/{x}.png"
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
        },
        series: [
          {
            // 流动道路线
            type: "lines3D",
            coordinateSystem: "mapbox3D",
            effect: {
              show: true,
              period: 2,
              trailWidth: 3,
              trailLength: 0.3,
              trailOpacity: 1
            },
            blendMode: "lighter",
            polyline: true,
            lineStyle: {
              width: 0.1,
              color: "rgb(94, 201, 35)",
              opacity: 0
            },
            data: window.Line
          }
        ]
      };

      this.chart.setOption(option);
      this.map = this.chart
        .getModel()
        .getComponent("mapbox3D")
        .getMapbox();
      var buildingPics = [];

      // 创建白模
      const createBaseModel = mId => {
        var promise = new Promise((resolve, reject) => {
          that.map.addLayer({
            id: `baseModel${mId}`,
            type: "fill-extrusion",
            source: {
              type: "geojson",

              data: `./assets/f${mId}.geojson`
            },
            paint: {
              "fill-extrusion-color": "rgba(162, 169, 183, 1)",
              "fill-extrusion-height": ["get", "e3"]
            }
          });

          resolve();
        });
        return promise;
      };

      // 加载商务楼名字图片
      const buildPicLoad = () => {
        var promise = new Promise((resolve, reject) => {
          for (let item of builgNames.features) {
            that.map.loadImage(
              `./img/name_pic/${item.attributes.固定id}.png`,
              (error, image) => {
                if (error) throw error;
                that.map.addImage(`name${item.attributes.固定id}`, image);
              }
            );
          }
          resolve();
        });
        return promise;
      };

      // 创建商务楼名字图片
      const addBuildPic = () => {
        var promise = new Promise((resolve, reject) => {
          that.map.addLayer({
            id: "buildNamePic",
            type: "symbol",
            source: {
              type: "geojson",
              data: "./assets/buildNames.geojson"
            },
            layout: {
              "icon-image": "name{固定id}",
              "icon-offset": [0, -10],
              "icon-anchor": "bottom",
              "icon-size": 1
            }
          });

          resolve();
        });
        return promise;
      };

      // 创建范围面
      const createPolygon = (name, radius) => {
        var promise = new Promise((resolve, reject) => {
          that.map.addLayer({
            id: "sm500",
            type: "fill-extrusion",
            source: {
              type: "geojson",
              data: "./assets/sm500.geojson"
            },
            paint: {
              "fill-extrusion-color": "rgb(255, 0, 0)",
              "fill-extrusion-opacity": 0.3
            }
          });

          resolve();
        });
        return promise;
      };

      // 加载周边查询图片
      const arroundPicLoad = () => {
        var promise = new Promise((resolve, reject) => {
          // for (let item of builgNames.features) {

          // map.loadImage(`./img/name_pic/${item.attributes.固定id}.png`,

          that.map.loadImage(
            `./img/arround_pic/park.png`,

            (error, image) => {
              if (error) throw error;
              that.map.addImage(`park`, image);
            }
          );

          // }

          resolve();
        });
        return promise;
      };

      // 创建周边查询图片
      const addArroundPic = () => {
        var promise = new Promise((resolve, reject) => {
          map.addLayer({
            id: "arroundPic",
            type: "symbol",
            source: {
              type: "geojson",
              data: "./assets/sm500poi.geojson"
            },
            layout: {
              "icon-image": "park",
              "icon-offset": [0, -10],
              "icon-anchor": "bottom",
              "icon-size": 0.7
            }
          });

          resolve();
        });
        return promise;
      };

      let modelList = [];

      that.map.on("style.load", () => {
        // 分块顺序加载白模
        createBaseModel(1);
        // .then(() => {
        //   return createBaseModel(2);
        // })
        // .then(() => {
        //   return createBaseModel(3);
        // })
        // .then(() => {
        //   return createBaseModel(4);
        // })
        // .then(() => {
        //   return createBaseModel(5);
        // })
        // .then(() => {
        //   return buildPicLoad();
        // })
        // .then(() => {
        //   return addBuildPic();
        // });

        // that.map.addLayer({
        //   id: "swl",
        //   type: "fill-extrusion",
        //   source: {
        //     type: "geojson",
        //     data: "./assets/swl2.geojson"
        //   },
        //   paint: {
        //     "fill-extrusion-color": ["get", "color"],
        //     "fill-extrusion-height": ["get", "e6"]
        //   }
        // });

        that.map.on("click", function(e) {
          console.log("e", e);
          // set bbox as 5px reactangle area around clicked point
          // var bbox = [
          //     [e.point.x - 5, e.point.y - 5],
          //     [e.point.x + 5, e.point.y + 5]
          // ];
          var features = that.map.queryRenderedFeatures(e.point, {
            layers: ["swl"]

            // layers: ['swl', 'baseModel1']
          });

          console.log("features", features);

          if (features.length) {
            createPolygon("世贸", 500)
              .then(() => {
                return arroundPicLoad();
              })
              .then(() => {
                return addArroundPic();
              });
          }
        });

        // 随机定位
        document.getElementById("fly").addEventListener("click", () => {
          // Fly to a random location by offsetting the point -74.50, 40
          // by up to 5 degrees.
          that.map.flyTo({
            // center: [
            //     origin[0] + (Math.random() - 0.5) * 0.05,
            //     origin[1] + (Math.random() - 0.5) * 0.05
            // ],
            // zoom: Math.floor(Math.random() * (15 - 12)) + 12

            center: [120.660578621, 28.0100676270001],
            zoom: 16
          });
        });

        let changeTag = true;

        // // 切换
        document.getElementById("change").addEventListener("click", () => {
          that.map.setLayoutProperty(
            "swl",
            "visibility",
            changeTag ? "none" : "visible"
          );

          that.map.setLayoutProperty(
            "buildNamePic",
            "visibility",
            changeTag ? "none" : "visible"
          );

          modelList.map(item => {
            that.map.setLayoutProperty(
              item,
              "visibility",
              changeTag ? "visible" : "none"
            );
          });

          changeTag = !changeTag;
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.demo {
  height: 100%;
  width: 100%;
  #main {
    height: 100%;
    width: 100%;
  }
}
</style>