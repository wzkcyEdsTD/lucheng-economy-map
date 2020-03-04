<template>
  <div class="canvassOverviewGeoChart">
    <div id="map"></div>
    <div id="mapHandle">
      <div class="container" @click="play">
        <div id="app">
          <div class="pause active">
            <div class="line line_1"></div>
            <div class="line line_2"></div>
          </div>
          <div class="play">
            <div class="line line_1"></div>
            <div class="line line_2"></div>
            <div class="line line_3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { freewayList, placeList, freewayLines, freewayText } from "./geoData";
import { loadModules, dojoRequire, bootstrap } from "esri-loader";
import { OPTION, CANVASSMAP, ZSZS } from "@/components/common/Tmap";
export default {
  name: "canvassOverviewGeoChart",
  data() {
    return {
      overlay: null,
      view: null,
      map: null,
      evtArr: [],
      index: 1,
      interval: null,
      playFlag: true
    };
  },
  components: {},
  mounted() {
    this.createMap(() => {
      // this.moveStation();
      this.moveCity2();
    });
    this.evtArr = [
      // this.moveStation,
      // this.moveFreeway,
      // this.moveCity1,
      // this.moveCity2

      this.moveCity2,
      this.moveCity1,
      this.moveFreeway,
      this.moveStation
    ];
    this.interval = setInterval(() => {
      this.evtArr[this.index % 4]();
      ++this.index;
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    createMap(fn) {
      const that = this;
      loadModules(
        [
          "esri/Map",
          "esri/layers/TileLayer",
          "esri/layers/MapImageLayer",
          "esri/views/MapView",
          "esri/core/watchUtils",
          "plugin/EchartsLayer4"
        ],
        OPTION
      ).then(
        ([
          Map,
          TileLayer,
          MapImageLayer,
          MapView,
          watchUtils,
          EchartsLayer
        ]) => {
          // 地图
          that.map = new Map();
          that.view = new MapView({
            container: "map",
            map: that.map,
            center: [120.6935, 27.98181],
            zoom: 12,
            // 限制缩放级别
            constraints: {
              minZoom: 4,
              maxZoom: 12
            }
          });

          // 添加底图
          const baseLayer = new TileLayer({
            url: CANVASSMAP,
            id: "worldmap"
          });

          that.map.add(baseLayer);

          // 行政区划、道路线
          that.map.add(
            new MapImageLayer({
              url: ZSZS
            })
          );
          that.view.when(function() {
            that.overlay = new EchartsLayer(that.view, window._echarts);
            var chartsContainer = that.overlay.getEchartsContainer();
            var myChart = that.overlay.initECharts(chartsContainer);
            var series = [
              {
                id: "geoPoint",
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 8,
                label: {
                  normal: {
                    show: true,
                    position: "top",
                    formatter: "{b}",
                    textStyle: {
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#ffaa00"
                    }
                  }
                },
                symbol: "circle",
                symbolSize: 15,
                itemStyle: {
                  normal: {
                    color: "#ffaa00"
                  }
                },
                data: []
              },
              {
                id: "LuC",
                type: "scatter",
                coordinateSystem: "geo",
                zlevel: 6,
                symbolSize: 170,
                label: {
                  normal: {
                    show: true,
                    position: "inside",
                    formatter: "{b}",
                    textStyle: {
                      fontSize: 35,
                      fontWeight: "bold",
                      color: "#FFF"
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: "rgba(255, 0, 0, 0.3)",
                    borderWidth: 4,
                    borderColor: "#FF0000",
                    borderType: "dotted"
                  }
                },
                data: []
              },
              {
                id: "geoLines",
                type: "lines",
                zlevel: 2,
                effect: {
                  show: true,
                  period: 4,
                  symbol: "arrow",
                  symbolSize: 10,
                  trailLength: 0
                },
                lineStyle: {
                  normal: {
                    color: "#ffaa00",
                    width: 3,
                    curveness: 0.1
                  }
                },
                data: []
              },
              {
                id: "stationLines",
                type: "lines",
                zlevel: 2,
                effect: {
                  show: true,
                  period: 4,
                  symbol: "arrow",
                  symbolSize: 6,
                  trailLength: 0
                },
                lineStyle: {
                  normal: {
                    color: "#42E59E",
                    width: 3
                  }
                },
                data: []
              },
              {
                id: "geoPin",
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 6,
                symbolSize: 10,
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    formatter: "{b}",
                    textStyle: {
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#ffaa00"
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: "transparent"
                  }
                },
                data: []
              },
              {
                id: "freewayPin",
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 6,
                symbolSize: 10,
                label: {
                  normal: {
                    show: true,
                    position: "right",
                    formatter: "{b}",
                    textStyle: {
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#42E59E"
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: "transparent"
                  }
                },
                data: []
              }
            ];

            const option = {
              geo: {
                map: "",
                roam: true,
                itemStyle: {
                  color: "#04284e",
                  borderColor: "#5bc1c9"
                }
              },
              series: series
            };
            that.overlay.setOption(option);
            fn && fn();
          });

          // 监听缩放
          watchUtils.whenTrue(that.view, "stationary", function() {
            if (that.view.extent) {
              if (that.view.zoom >= 12) {
                that.stationHandler();
              } else if (that.view.zoom >= 9 && that.view.zoom <= 11) {
                that.freewayHandler();
              } else if (that.view.zoom >= 7 && that.view.zoom <= 8) {
                that.cityHandler1();
              } else if (that.view.zoom >= 5 && that.view.zoom <= 6) {
                that.cityHandler2();
              } 
            }
          });
        }
      );
    },
    moveStation() {
      this.view.goTo(
        {
          center: [120.7135, 27.98181],
          zoom: 12
        },
        {
          duration: 1000
        }
      );
      this.stationHandler();
    },
    moveFreeway() {
      this.view.goTo(
        {
          center: [120.49349999999795, 27.981809999999527],
          zoom: 11
        },
        {
          duration: 1000
        }
      );
      this.freewayHandler();
    },
    moveCity1() {
      this.view.goTo(
        {
          center: [118.1554140624978, 28.446496290035544],
          zoom: 7
        },
        {
          duration: 1000
        }
      );
      this.cityHandler1();
    },
    moveCity2() {
      this.view.goTo(
        {
          center: [103.69447656249879, 32.941402347345225],
          zoom: 5
        },
        {
          duration: 1000
        }
      );
      this.cityHandler2();
    },
    stationHandler() {
      this.overlay &&
        this.overlay.setOption({
          series: [
            {
              id: "geoPoint",
              type: "effectScatter",
              itemStyle: {
                normal: {
                  color: "transparent"
                }
              },
              data: [placeList["wzzf"], placeList["wzjc"], placeList["wznz"]]
            },
            {
              id: "LuC",
              type: "scatter",
              symbolSize: 170,
              label: {
                normal: {
                  textStyle: {
                    fontSize: 35
                  }
                }
              },
              data: [placeList["LuC"]]
            },
            {
              id: "geoLines",
              type: "lines",
              data: [
                [
                  {
                    coord: placeList["LuC"].value
                  },
                  {
                    coord: placeList["wzjc"].value
                  }
                ],
                [
                  {
                    coord: placeList["LuC"].value
                  },
                  {
                    coord: placeList["wznz"].value
                  }
                ]
              ]
            },
            {
              id: "stationLines",
              type: "lines",
              data: freewayLines
            },
            {
              id: "geoPin",
              type: "effectScatter",
              data: [
                {
                  name: "40 分钟",
                  value: [
                    (placeList["wzzf"].value[0] + placeList["wzjc"].value[0]) /
                      2,
                    (placeList["wzzf"].value[1] + placeList["wzjc"].value[1]) /
                      2
                  ]
                },
                {
                  name: "30 分钟",
                  value: [
                    (placeList["wzzf"].value[0] + placeList["wznz"].value[0]) /
                      2,
                    (placeList["wzzf"].value[1] + placeList["wznz"].value[1]) /
                      2
                  ]
                }
              ]
            },
            {
              id: "freewayPin",
              type: "effectScatter",
              data: freewayText
            }
          ]
        });
    },
    freewayHandler() {
      this.overlay &&
        this.overlay.setOption({
          series: [
            {
              id: "geoPoint",
              type: "effectScatter",
              itemStyle: {
                normal: {
                  color: "#ffaa00"
                }
              },
              data: [
                placeList["LW"],
                placeList["OB"],
                placeList["OH"],
                placeList["LS"]
              ]
            },
            {
              id: "LuC",
              type: "scatter",
              symbolSize: 100,
              label: {
                normal: {
                  textStyle: {
                    fontSize: 25
                  }
                }
              },
              data: [placeList["LuC"]]
            },
            {
              id: "geoLines",
              type: "lines",
              data: [
                [
                  {
                    coord: placeList["LW"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["OB"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["OH"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["LS"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ]
              ]
            },
            {
              id: "stationLines",
              type: "lines",
              data: []
            },
            {
              id: "geoPin",
              type: "effectScatter",
              data: []
            },
            {
              id: "freewayPin",
              type: "effectScatter",
              data: []
            }
          ]
        });
    },
    cityHandler1() {
      this.overlay &&
        this.overlay.setOption({
          series: [
            {
              id: "geoPoint",
              type: "effectScatter",
              itemStyle: {
                normal: {
                  color: "#ffaa00"
                }
              },
              data: [
                placeList["LuC"],
                placeList["HZ"],
                placeList["SH"],
                placeList["WH"],
                placeList["FZ"],
                placeList["TB"]
              ]
            },
            {
              id: "LuC",
              type: "scatter",
              data: []
            },
            {
              id: "geoLines",
              type: "lines",
              data: [
                [
                  {
                    coord: placeList["WH"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["HZ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["SH"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["FZ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["TB"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ]
              ]
            },
            {
              id: "stationLines",
              type: "lines",
              data: []
            },
            {
              id: "geoPin",
              type: "effectScatter",
              data: []
            },
            {
              id: "freewayPin",
              type: "effectScatter",
              data: []
            }
          ]
        });
    },
    cityHandler2() {
      this.overlay &&
        this.overlay.setOption({
          series: [
            {
              id: "geoPoint",
              type: "effectScatter",
              itemStyle: {
                normal: {
                  color: "#ffaa00"
                }
              },
              data: [
                placeList["LuC"],
                placeList["JJJ"],
                placeList["ZSJ"],
                placeList["HX"],
                placeList["CSJ"],
                placeList["CJZY"],
                placeList["WLMQ"]
              ]
            },
            {
              id: "LuC",
              type: "scatter",
              data: []
            },
            {
              id: "geoLines",
              type: "lines",
              data: [
                [
                  {
                    coord: placeList["JJJ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["ZSJ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["HX"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["CSJ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["CJZY"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ],
                [
                  {
                    coord: placeList["WLMQ"].value
                  },
                  {
                    coord: placeList["LuC"].value
                  }
                ]
              ]
            },
            {
              id: "stationLines",
              type: "lines",
              data: []
            },
            {
              id: "geoPin",
              type: "effectScatter",
              data: []
            },
            {
              id: "freewayPin",
              type: "effectScatter",
              data: []
            }
          ]
        });
    },
    play() {
      // 播放/暂停
      if (this.playFlag) {
        clearInterval(this.interval);
        this.playFlag = !this.playFlag;
      } else {
        this.playFlag = !this.playFlag;

        // 立即播放
        this.evtArr[this.index % 4]();
        ++this.index;

        // 定时循环
        this.interval = setInterval(() => {
          this.evtArr[this.index % 4]();
          ++this.index;
        }, 10000);
      }

      const pause = document.querySelector(".pause");
      const play = document.querySelector(".play");

      if (play.classList.contains("active")) {
        play.classList.remove("active");
        pause.classList.add("active");
      } else {
        pause.classList.remove("active");
        play.classList.add("active");
      }
    }
  }
};
</script>

<style scoped lang="less">
@import url("./canvassGeo.less");
</style>