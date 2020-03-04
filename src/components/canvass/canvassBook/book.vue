<template>
  <div class="view">
    <div class="book_box">
      <i class="iconfont iconRectangleCopy" @click="closeBook()"></i>
      <div class="book_content flipbook"></div>
      <div  class="cover"></div>
      <div class="Shadowe">
        <div class="book_text"></div>
      </div>
      <ul class="bookmark">
        <li class="mark_01" data-id="1">返回首页</li>
        <li class="mark_02" data-id="7">重点项目</li>
        <!-- <li class="mark_04" data-id="57">鹿城全景</li> -->
      </ul>
      <transition name="frame">
        <Popup v-if="isShow" :locOption="locOption" @close="change(false)"></Popup>
      </transition>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import initDom from "./js/base.js";
import Popup from "./mapPopup";
import { loadModules, dojoRequire, bootstrap } from "esri-loader";
import {
  OPTION,
  IMAGELAYER,
  QHMB,
  TDT25DCONFIG,
  TDT25D,
  TDTJY,
  spatialReference,
  CANVASSMAP,
  CANVASSHIGHWAY
} from "@/components/common/Tmap";
import {
  freewayList,
  placeList,
  freewayLines,
  freewayText
} from "@/components/canvass/CanvassBusiness/canvassOverviewGeo/geoData";
export default {
  name: "book",
  data() {
    return {
      mapPage2: null,
      mapPage3: null,
      viewPage2: null,
      viewPage3: null,
      overlay: null,
      view: null,
      map: null,
      evtArr: [],
      index: 1,
      interval: null,
      isShow: false,
      locOption: null
    };
  },
  components: { Popup },
  props: {},
  created() {},
  mounted() {
    initDom();
    this.createPageMap();
    this.createMap(() => {
      this.moveCity2();
    });
    this.evtArr = [
      this.moveCity2,
      this.moveCity1,
      this.moveFreeway,
      this.moveStation
    ];
    this.interval = setInterval(() => {
      this.evtArr[this.index % 4]();
      ++this.index;
    }, 8000);

    this.bindClick();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {},
  methods: {
    createPageMap() {
      const that = this;
      return new Promise((resolve, reject) => {
        loadModules(
          [
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/MapImageLayer",
            "esri/layers/VectorTileLayer",
            "esri/layers/WebTileLayer",
            "esri/layers/support/TileInfo",
            "esri/geometry/Point",
            "esri/core/watchUtils",
            "dojo/domReady!"
          ],
          OPTION
        ).then(
          ([
            Map,
            MapView,
            MapImageLayer,
            VectorTileLayer,
            WebTileLayer,
            TileInfo,
            Point,
            watchUtils
          ]) => {
            // 矢量底图
            const layer = new VectorTileLayer({
              // url: IMAGELAYER
              url: TDTJY
            });
            const jyLayer = new VectorTileLayer({
              url: TDTJY
            });
            // map加载底图
            that.mapPage2 = new Map("page2", {
              spatialReference,
              layers: [layer]
            });
            //设置地图容器
            that.viewPage2 = new MapView({
              container: "page2",
              map: that.mapPage2,
              zoom: 16,
              center: [120.65847732601643, 28.01211093132429]
            });
            const tileInfo = new TileInfo(JSON.parse(TDT25DCONFIG));
            const _layer = new WebTileLayer(TDT25D, {
              tileInfo,
              id: "build_25d",
              spatialReference
            });
            that.mapPage2.add(_layer, 1);

            that.mapPage3 = new Map({
              spatialReference,
              layers: [jyLayer]
            });

            that.viewPage3 = new MapView({
              container: "page3",
              map: that.mapPage3,
              zoom: 16,
              center: [120.65847732601643, 28.01211093132429]
            });
            const qh = new MapImageLayer({
              url: QHMB,
              id: "lcjjdt",
              sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
            });
            that.mapPage3.add(qh);

            // 监听缩放
            watchUtils.whenTrue(that.viewPage3, "stationary", function() {
              that.viewPage2.extent = that.viewPage3.extent;
            });

            watchUtils.whenTrue(that.viewPage2, "stationary", function() {
              that.viewPage3.extent = that.viewPage2.extent;
            });

            resolve(true);
          }
        );
      });
    },
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
            container: "canvass",
            map: that.map,
            center: [120.6935, 27.98181],
            zoom: 12,
            // 限制缩放级别
            constraints: {
              minZoom: 3,
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
              url: CANVASSHIGHWAY
            })
          );
          that.view.when(function() {
            that.overlay = new EchartsLayer(that.view, echarts);
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
                } else if (that.view.zoom >= 3 && that.view.zoom <= 4) {
                  that.countryHandler();
                }
              }
            });
          });
        }
      );
    },
    moveStation() {
      this.view.goTo(
        {
          center: [120.6935, 27.98181],
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
          center: [119.1554140624978, 28.446496290035544],
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
          center: [116.69447656249879, 32.941402347345225],
          zoom: 5
        },
        {
          duration: 1000
        }
      );
      this.cityHandler2();
    },
    moveCountry() {
      this.view.goTo(
        {
          center: [65.019085, 39.416692],
          zoom: 3
        },
        {
          duration: 1000
        }
      );
      this.countryHandler();
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
                placeList["HX"],
                placeList["CSJ"],
                placeList["HZ"],
                placeList["SH"]
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
                placeList["WH"]
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
                    coord: placeList["WH"].value
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
    countryHandler() {
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
              data: [placeList["LuC"], placeList["Serbia"]]
            },
            {
              id: "LuC",
              type: "scatter",
              data: []
            },
            {
              id: "geoLines",
              type: "lines",
              label: {
                show: true,
                position: "middle",
                formatter: "{d}"
              },
              data: [
                [
                  {
                    coord: placeList["Serbia"].value
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
    change(tag) {
      this.isShow = tag;
    },
    bindClick() {
      const that = this;
      $("body").on("click", ".page4", function() {
        that.isShow = true;
        that.locOption = {
          center: [120.624, 28.015],
          zoom: 15
        };
      });
      $("body").on("click", ".page5", function() {
        that.isShow = true;
        that.locOption = {
          center: [120.662, 28.018],
          zoom: 16
        };
      });
      $("body").on("click", ".page6", function() {
        that.isShow = true;
        that.locOption = {
          center: [120.658, 27.992],
          zoom: 14
        };
      });
      $("body").on("click", ".page7", function() {
        that.isShow = true;
        that.locOption = {
          center: [120.652, 28.027],
          zoom: 16
        };
      });
      $("body").on("click", ".page8", function() {
        that.isShow = true;
        that.locOption = {
          center: [120.608, 28.024],
          zoom: 14
        };
      });
    },
    closeBook(){
      this.$parent.bookShow = false;
      this.$parent.icon_show_left = false;
      this.$parent.icon_show_right = false;
    }
  }
};
</script>
<style scoped lang="less">
@import url("./base.less");
</style>
