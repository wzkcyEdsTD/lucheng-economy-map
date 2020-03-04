<template>
  <div :class="`commonSearch ${CommonfromCanvass? `topMagin`:``}`">
    <div class="addDmdz">
      地名地址
      <!-- <input id="addDmdz" type="checkbox" v-model="check" /> -->
      <ToggleSwitch @change="change" />
    </div>
    <div class="stateInput">
      <div class="aeoBtn" title="优质企业" v-if="aeoBtn" @click="()=>{$parent.aeoSearch=true}">
        <img :src="`${server}/icon/commonIcon/aeo.png`" />
      </div>
      <input type="text" v-model="Name" placeholder="综合查询" @change="searchName" />
      <div class="iconfont iconRectangleCopy2" @click="search"></div>
    </div>
    <div class="ecoCompany_tableFrame" v-if="TableShow">
      <div class="ecoCompany_table">
        <div class="thead">
          <span>序号</span>
          <span>名称</span>
          <span>
            <i class="iconfont iconRectangleCopy" @click="leftclose()"></i>
          </span>
          <!-- <span>产业类型</span> -->
        </div>
        <ul class="tbody">
          <li v-for="(item,index) in tableData" :key="index" @click="location(item)">
            <span>{{++index}}</span>
            <span>{{item.name}}</span>
            <!-- <span>{{item.hydm}}</span> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import commonApi from "@/api/beans/u_common";
import { loadModules } from "esri-loader";
import { type, JumpActive } from "./type.js";
import ToggleSwitch from "./Switch";
import {
  CYBJ,
  ZSZY,
  MJLYX,
  DKHX,
  JJTS,
  WRT_config,
  OPTION
} from "@/components/common/Tmap";
const { server } = WRT_config;
import router from "@/router";
import Vue from "vue";
export default {
  name: "ecoCompanyTableFrame",
  data() {
    return {
      server,
      Name: "",
      TableShow: false,
      tableData: [{}],
      type,
      JumpActive,
      check: true
    };
  },
  components: { ToggleSwitch },
  props: { CommonfromCanvass: Boolean, aeoBtn: Boolean },
  created() {},
  mounted() {},
  methods: {
    searchName(val) {
      if (!val) {
        this.TableShow = false;
        this.$parent.searchShow = true;
        this.$parent.introShow = true;
      }
      // this.Name = val;
    },
    search() {
      const CommonResult = [];
      let CommonTable = [];
      if (!this.$props.CommonfromCanvass) {
        if (this.check) {
          commonApi
            .ds({ where: `a.name like '%${this.Name}%'` })
            .then(result => {
              if (result) {
                CommonResult.push(result.data);
              }
              commonApi
                .dmdz({ where: `a.name like '%${this.Name}%'` })
                .then(result => {
                  CommonResult.push(result.data);
                  if (CommonResult.length > 1) {
                    CommonTable = CommonResult[0].concat(CommonResult[1]);
                  } else {
                    CommonTable = CommonResult[0];
                  }
                  this.tableData = CommonTable.map(item => {
                    return item;
                  });
                });
            });
        } else {
          commonApi
            .ds({ where: `a.name like '%${this.Name}%'` })
            .then(result => {
              this.tableData = result.data.map(item => {
                return item;
              });
            });
        }
      } else {
        if (this.check) {
          commonApi
            .CommonfromCanvass({ where: `a.name like '%${this.Name}%'` })
            .then(result => {
              if (result) {
                CommonResult.push(result.data);
              }
              commonApi
                .dmdz({ where: `a.name like '%${this.Name}%'` })
                .then(result => {
                  CommonResult.push(result.data);
                  if (CommonResult.length > 1) {
                    CommonTable = CommonResult[0].concat(CommonResult[1]);
                  } else {
                    CommonTable = CommonResult[0];
                  }
                  this.tableData = CommonTable.map(item => {
                    return item;
                  });
                });
            });
        } else {
          commonApi
            .CommonfromCanvass({ where: `a.name like '%${this.Name}%'` })
            .then(result => {
              this.tableData = result.data.map(item => {
                return item;
              });
            });
        }
      }

      this.TableShow = true;
      this.$parent.searchShow = false;
      this.$parent.introShow = false;
    },
    location(_item) {
      let url, id, lx, FNAME, FURL;
      for (let i = 0; i < this.type.length; i++) {
        if (_item.url == this.type[i].url) {
          url = _item.url;
        }
        if (url != "0") {
          for (let v in this.type[i].id) {
            if (_item.id == this.type[i].id[v].name) {
              id = this.type[i].id[v].id;
              lx = this.type[i].id[v].type;
            }
          }
        }
      }
      if (url != "0") {
        switch (url) {
          case "CYBJ":
            if (id == 0) {
              FNAME = "name1009";
            } else {
              FNAME = "企业名称";
            }
            FURL = CYBJ;
            break;
          case "MJLYX":
            FNAME = "企业名称";
            FURL = MJLYX;
            break;
          case "DKHX":
            FNAME = "ydkmc";
            FURL = DKHX;
            break;
          case "ZSZY":
            FNAME = "FNAME";
            FURL = ZSZY;
            break;
          case "JJTS":
            if (id == 2) {
              FNAME = "楼宇名称";
            } else {
              FNAME = "NAME";
            }
            FURL = JJTS;
            break;
        }
        const that = this;
        loadModules(
          ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
          OPTION
        ).then(([QueryTask, Query]) => {
          const queryTask = new QueryTask({
            url: FURL + `/${id}`
          });
          const query = new Query();
          query.outFields = ["*"];
          query.where = `${FNAME} ='${_item.name}'`;
          query.returnGeometry = true;
          queryTask.execute(query).then(response => {
            for (let j = 0; j < that.JumpActive.length; j++) {
              if (_item.id == that.JumpActive[j].name) {
                const routerPath = that.JumpActive[j].route;
                const val = that.JumpActive[j].activeName;
                const idName = that.JumpActive[j].name;
                var arcMap = that.$parent.$refs.ecoMap
                  ? that.$parent.$refs.ecoMap
                  : that.$parent.$refs.ecoEstateMap;
                if (that.$router.history.current.name == "canvass") {
                  if (idName == "bdpt") {
                    const feature = response.features.map(obj => {
                      return { ...obj, 名称: obj.attributes.name1009 };
                    });
                    arcMap.indexPoint(feature[0]);
                  } else if (
                    idName == "zdxm" ||
                    idName == "zysc" ||
                    idName == "zdly"
                  ) {
                    that.$parent.$parent.$parent.search = response;
                  } else {
                    that.$parent.$parent.$parent.activeName =
                      "canvassResSummary";
                    that.$parent.$parent.$parent.search = response;
                  }
                  arcMap.setLocationSymbol(response.features[0].geometry);
                } else if (that.$router.history.current.name == routerPath) {
                  arcMap.view.goTo({
                    center: [
                      response.features[0].geometry.x,
                      response.features[0].geometry.y
                    ]
                  });
                  if (idName == "bdpt") {
                    const feature = response.features.map(obj => {
                      return { ...obj, 名称: obj.attributes.name1009 };
                    });
                    arcMap.indexPoint(feature[0]);
                    console.log(feature[0]);
                  } else {
                    arcMap.fetchCompany(
                      response.features[0].attributes,
                      response.features[0].geometry
                    );
                  }
                  arcMap.setLocationSymbol(response.features[0].geometry);
                } else {
                  that.$router.push({
                    name: routerPath,
                    params: {
                      activeName: val,
                      id: that.JumpActive[j].id,
                      list: response,
                      Jump: true
                    }
                  });
                }
              }
            }
          });
        });
      } else {
        const x = _item.x;
        const y = _item.y;
        const that = this;
        var arcMap = that.$parent.$refs.ecoMap
          ? that.$parent.$refs.ecoMap
          : that.$parent.$refs.ecoEstateMap;
        loadModules(["esri/geometry/Point"], OPTION).then(([Point]) => {
          const mapPoint = new Point({ x, y });
          that.setLocationSymbol(mapPoint);
        });
        arcMap.view.goTo({
          center: [x, y]
        });
      }
    },
    setLocationSymbol(geometry) {
      const that = this;
      this.$parent.$refs.ecoMap
        ? that.$parent.$refs.ecoMap.view.graphics.removeAll()
        : that.$parent.$refs.ecoEstateMap.view.graphics.removeAll();
      loadModules(
        ["esri/Graphic", "esri/symbols/PictureMarkerSymbol"],
        OPTION
      ).then(([Graphic, PictureMarkerSymbol]) => {
        var symbol = {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/point.png`,
          width: "101px",
          height: "100px",
          yoffset: 22
        };
        var graphic = new Graphic({
          geometry,
          symbol
        });
        that.$parent.$refs.ecoMap
          ? that.$parent.$refs.ecoMap.view.graphics.add(graphic)
          : that.$parent.$refs.ecoEstateMap.view.graphics.add(graphic);
      });
    },
    change(obj) {
      this.check = obj;
    },
    leftclose() {
      this.$parent.introShow = true;
      this.$parent.searchShow = true;
      this.TableShow = false;
    }
  }
};
</script>
 <style lang="less">
.topMagin {
  margin-top: 108px;
}
.commonSearch {
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: 846px;
  padding: 10px 10px;
  right: 0px;
  z-index: 4;

  .addDmdz {
    width: 380px;
    height: 20px !important;
    text-align: left;
    margin-bottom: 5px;
    display: flex;
  }
  .stateInput {
    height: 40px !important;
    display: flex;
    box-shadow: unset;
    background-color: unset;
    .aeoBtn {
      margin-right: 10px;
      cursor: pointer;
    }
    input {
      outline: none;
      color: #fff;
      height: 40px;
      background: rgba(47, 77, 123, 0.4);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      flex: 1;
      box-sizing: border-box;
      padding: 0 0 0 10px;
    }

    input::-webkit-input-placeholder {
      color: #ffffff;
    }

    .iconfont {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      box-sizing: border-box;
      background: rgba(57, 93, 147, 0.9);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .ecoCompany_tableFrame {
    box-sizing: border-box;
    padding: 10px 0px;
    margin-top: 20px;
    flex: 1;
    background: linear-gradient(
      180deg,
      rgba(0, 63, 189, 0.6) 0%,
      rgba(5, 53, 129, 0.6) 100%
    );
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
      0px 0px 44px 0px rgba(16, 146, 236, 0.3);
    border: 1px solid rgba(7, 73, 190, 0.4);
    .ecoCompany_table {
      width: 100%;
      height: 800px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      span {
        display: inline-block;
        width: 80%;
        vertical-align: middle;
        cursor: pointer;
        text-align: left;
        padding-right: 20px;
      }
      span:first-child {
        width: 20%;
        text-align: center;
        padding-right: 0px;
      }
      .thead {
        height: 42px;
        line-height: 42px;
        color: rgba(42, 255, 250, 1);
        span:nth-child(2) {
          text-align: center;
          width: 60%;
        }
        span:last-child {
          width: 16%;
          i {
            font-size: 22px;
          }
        }
      }
      .tbody::-webkit-scrollbar {
        display: none;
      }
      .tbody {
        flex: 1;
        overflow-y: scroll;
        li {
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 0;
        }
      }
    }
  }
}
</style>