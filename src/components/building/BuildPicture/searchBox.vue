<template>
  <div class="blueform" id="positionRight">
    <div>
      <div class="search">
        <div>
          <input class="searchBox" v-model="searchText" type="text" />
          <i class="icon iconfont iconRectangleCopy2" id="searchButton" @click="search()"></i>
        </div>
        <div>
          <label>闲置面积</label>
          <input type="text" v-model="searchRange.jzmj[0]" />&nbsp;㎡ &nbsp;~&nbsp;&nbsp;
          <input type="text" v-model="searchRange.jzmj[1]" />&nbsp;㎡
        </div>
        <div>
          <label>租金</label>
          <input type="text" v-model="searchRange.mpfmzj[0]" />&nbsp;元/㎡ &nbsp;~&nbsp;&nbsp;
          <input type="text" v-model="searchRange.mpfmzj[1]" />&nbsp;元/㎡
        </div>
        <div>
          <label>物业费</label>
          <input type="text" v-model="searchRange.mpfmwy[0]" />&nbsp;元/㎡ &nbsp;~&nbsp;&nbsp;
          <input type="text" v-model="searchRange.mpfmwy[1]" />&nbsp;元/㎡
        </div>
        <div>
          <label>所属街道</label>
          <v-select @input="selectedChange" v-model="ssjd" multiple :options="Street"></v-select>
        </div>
      </div>
      <div class="checkTypeBox">
        <ul>
          <li
            v-for="(item,index) in forceList"
            :key="index"
            @click="showAsideList(item,true)"
            class="typelist"
          >
            <div>
              <p class="building_Name">
                {{item.name}}
                <i>
                  (闲置房间
                  <i class="i_gold">{{item.asideLength}}</i>处)
                </i>
              </p>
              <!-- <ul class="asideList" @click.stop="showAsideList(item,true)">
                <li v-for="(_item,_index) in item.display" :key="_index">
                  <span>{{_item.szlc}}楼</span>
                  <span>面积:{{_item.jzmj || '-'}}㎡</span>
                  <span>房间号:{{_item.fjh || `-`}}</span>
                </li>
                <li v-if="item.asideLength > 5">查看更多..</li>
              </ul>-->
              <div class="building_Detail">
                <span>
                  <img :src="item.info.imgUrl" @error="imgError(item)" />
                </span>
                <ul>
                  <li>
                    <i>所属街道:</i>
                    <i>{{item.info.ssjd}}</i>
                  </li>
                  <li>
                    <i>楼宇地址:</i>
                    <i>{{item.info.address}}</i>
                  </li>
                  <li>
                    <i>物业公司:</i>
                    <i>{{item.info.wygs}}</i>
                  </li>
                  <li>
                    <i>业主单位:</i>
                    <i>{{item.info.yzdw}}</i>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="no_result" v-if="!forceList.length">没有匹配的结果</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import lcxxApi from "@/api/beans/u_lcxx";
import lyxxApi from "@/api/beans/u_lyxx";
import { WRT_config } from "@/components/common/Tmap";
import vSelect from "vue-select";
const { server } = WRT_config;
import { Street } from "./Street";
export default {
  name: "checkTypeBox",
  data() {
    return {
      server,
      Street,
      forceList: [],
      area: "",
      areaVal: [],
      // 搜索
      searchText: "",
      searchRange: {
        jzmj: ["", ""],
        mpfmzj: ["", ""],
        mpfmwy: ["", ""]
      },
      ssjd: []
    };
  },
  components: { vSelect },
  created() {},
  mounted() {
    this.search();
  },
  computed: {},
  methods: {
    selectedChange() {},
    imgError({ gdid }) {
      this.forceList.map((item, index) => {
        if (item.gdid == gdid) {
          this.forceList[
            index
          ].info.imgUrl = `${server}/icon/commonIcon/noImg.png`;
          return;
        }
      });
    },
    showAsideList(item, shallAside) {
      this.$emit("changeForceBuild", item, shallAside);
    },
    search() {
      const rangeSql = [];
      const asideSortByBuild = {};
      const forceList = [];
      const isAside =
        (this.searchRange.jzmj[0] && this.searchRange.jzmj[1]) ||
        (this.searchRange.mpfmzj[0] && this.searchRange.mpfmzj[1]) ||
        (this.searchRange.mpfmwy[0] && this.searchRange.mpfmwy[1])
          ? true
          : false;
      const _ssjd = [];
      this.ssjd.map(item => {
        _ssjd.push(item);
      });
      const _ssjd_ = _ssjd.length
        ? ` and ssjd in (${_ssjd
            .map(item => {
              return `'${item}'`;
            })
            .join(`,`)})`
        : ``;
      for (let v in this.searchRange) {
        const item = this.searchRange[v];
        rangeSql.push(
          item[0] && item[1]
            ? ` and ${v} >= ${item[0]} and ${v} <= ${item[1]}`
            : ``
        );
      }
      lcxxApi
        .lyList({
          where: `name like '%${this.searchText}%' ${_ssjd_} ${rangeSql.join(
            ` `
          )}${isAside ? ` and status = '2'` : ``}`
        })
        .then(({ data }) => {
          data.map(item => {
            if (!asideSortByBuild[item.gdid])
              asideSortByBuild[item.gdid] = {
                name: item.name,
                gdid: item.gdid,
                asideLength: 0,
                asideChildren: [],
                rentChildren: []
              };
            if (item.status == "2") {
              asideSortByBuild[item.gdid].asideChildren.push(item);
              asideSortByBuild[item.gdid].asideLength++;
            } else {
              asideSortByBuild[item.gdid].rentChildren.push(item);
            }
          });
          lyxxApi.ds().then(({ data }) => {
            data.map(_item => {
              if (asideSortByBuild[_item.gdid]) {
                asideSortByBuild[_item.gdid] = {
                  ...asideSortByBuild[_item.gdid],
                  info: {
                    ..._item,
                    imgUrl: `${server}/icon/buildingImg/${_item.name}.png`
                  }
                };
              }
            });
            for (let d in asideSortByBuild) {
              forceList.push({
                ...asideSortByBuild[d],
                display: asideSortByBuild[d].asideChildren.slice(0, 5)
              });
            }
            this.forceList = forceList.sort(this.$util.compare("gdid"));
          });
        });
    },
    fetchBuild(gdid) {
      const that = this;
      that.forceList.map((item, index) => {
        if (item.gdid == gdid) {
          that.showAsideList(item, true);
        }
      });
    }
  }
};
</script>

<style lang='less'>
.blueform {
  position: absolute;
  right: 20px;
  top: 0;
  box-sizing: border-box;
  // padding: 80px 0px 30px 0;
  // height: 100%;
  margin-top: 108px;
  height: 836px;
  width: 350px;
  > div {
    height: 100%;
    box-sizing: border-box;
    background: linear-gradient(
      180deg,
      rgba(0, 63, 189, 1) 0%,
      rgba(5, 53, 129, 1) 100%
    );
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
      0px 0px 44px 0px rgba(16, 146, 236, 0.3);
    border: 1px solid rgba(7, 73, 190, 0.4);

    box-sizing: border-box;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  .search {
    width: 100%;
    height: 190px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    > * {
      display: block;
    }
    > div {
      width: 100%;
      height: 35px;
      display: flex;
      flex-direction: row;
      padding: 5px;
      line-height: 30px;
      .searchBox {
        height: 30px;
        flex: 1;
        background: rgba(47, 77, 123, 0.4);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 16px;
        padding-left: 10px;
      }
      #searchButton {
        font-size: 16px;
        width: 37px;
        height: 30px;
        line-height: 29px;
        position: relative;
        cursor: pointer;
        background: rgba(57, 93, 147, 0.9);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      .v-select {
        flex: 1;
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        height: 35px;
        .vs__dropdown-toggle {
          width: 100%;
        }
        .vs__actions {
          cursor: pointer;
          height: 29px;
          .vs__open-indicator {
            fill: hsla(0, 0%, 100%, 0.8);
          }
        }
        .vs__selected-options {
          .vs__selected {
            background-color: #0000005e;
            color: #fff;
            position: relative;
            top: 0px;
            padding-left: 4px;
            .vs__deselect {
              fill: rgba(255, 255, 255, 1);
            }
          }
          .vs__search {
            color: #fff;
          }
        }
      }
      > label {
        width: 24%;
        height: 100%;
      }
      > input {
        width: 17%;
        box-sizing: border-box;
        padding-left: 6px;
        color: #fff;
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
  #searchBox-type {
    width: 100px;
    height: 46.5px;
    border: 1px solid rgba(90, 169, 230, 1);
    background-color: rgba(0, 0, 0, 0.2);
    float: left;
    color: aliceblue;
    cursor: pointer;
  }
  #searchBox-type::after {
    content: " \25BC";
  }
  .checkTypeBox {
    flex: 1;
    color: aliceblue;
    overflow-y: scroll;
    > ul {
      height: 100%;
      .no_result {
        height: 40px;
        line-height: 40px;
      }
      .typelist {
        cursor: pointer;
        text-align: left;
        font-size: 14px;
        color: #fff;
        padding: 18px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }
      .typelist:last-child {
        border-bottom: 0px;
      }
      .type-title {
        float: left;
        margin-top: 20px;
        margin-right: 30px;
      }
      .building_Name {
        color: rgba(90, 169, 230, 1);
        font-weight: 900;
        font-size: 20px;
        margin-bottom: 10px;
        i {
          font-size: 14px;
          font-style: normal;
          color: #fff;
          font-weight: 300;
        }
      }
      .building_Detail {
        * {
          vertical-align: top;
          font-size: 16px;
          font-style: normal;
        }
        span {
          display: inline-block;
          width: 40%;
          img {
            width: 100%;
            height: 140px;
            border-radius: 4px;
          }
        }
        ul {
          display: inline-block;
          width: 60%;
          box-sizing: border-box;
          padding: 0 4px;
          li {
            margin-bottom: 4px;
            i:first-child {
              font-weight: bold;
              margin-right: 4px;
            }
          }
        }
      }
      .asideList {
        > li {
          > span {
            text-align: left;
            display: inline-block;
            vertical-align: middle;
            min-width: 40px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .checkTypeBox::-webkit-scrollbar {
    display: none;
  }
}
</style>
