<template>
  <div class="landNoneTable">
    <header>
      <header>
        {{title}}
        <!-- <span class="stateTipHeaderBar"></span> -->
      </header>
      <span>
        <div>
          <i class="iconfont iconRectangleCopy2"></i>
          <input type="text" v-model="search.name" :placeholder="inputName" />
        </div>
        <button @click="fetchLand">搜索</button>
      </span>
      <span class="landResTableSearch">
        <div>
          <label>用地类型</label>
          <select v-model="search.lx" @change="changeInput">
            <option key="0" value>全部</option>
            <option key="1" value="可供地块">可供地块</option>
            <option key="2" value="已征待拆">已征待拆</option>
            <option key="3" value="控制性规划">控制性规划</option>
          </select>
        </div>
        <div>
          <label>用地面积</label>
          <input type="text" v-model="search.mj[0]" />&nbsp;亩~
          <input type="text" v-model="search.mj[1]" />&nbsp;亩
        </div>
        <div>
          <label>用地性质</label>
          <v-select @input="selectedChange" v-model="search.ydxz" multiple :options="overKind"></v-select>
        </div>
      </span>
      <div class="match" @click="fetchLand">匹配</div>
    </header>
    <hr color="#FFF" size="1" />
    <div class="landNone_Table">
      <header>
        <span>原地块名称</span>
        <span>地块类型</span>
        <span>用地面积</span>
      </header>
      <ul v-if="matchDispaly">
        <li v-for="(item,index) in list" :key="index" @click.stop="goForceLand(item)">
          <span>{{item.ydkmc}}</span>
          <span>{{item.lx}}</span>
          <span>{{parseFloat(item.mj).toFixed(2)}}亩</span>
        </li>
        <li class="no_result" v-if="!list.length">没有匹配的结果</li>
      </ul>
    </div>
    <div class="blueBorder">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
import landApi from "@/api/beans/u_land";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { overKind, valKind, allKind } from "@/components/common/multi";
import { OPTION, ALLLANDREGULATORY } from "@/components/common/Tmap";
export default {
  name: "landNoneTableFrame",
  data() {
    return {
      overKind,
      allKind,
      title: "用地匹配",
      inputName: "请输入用地名称",
      list: [],
      search: {
        mj: ["", ""],
        name: "",
        lx: "",
        ydxz: []
      },
      matchDispaly: true
    };
  },
  components: { vSelect },
  props: {
    forceOne: Object,
    resultTable: Array
  },
  watch: {
    resultTable: {
      handler(newVal, val) {
        this.list = newVal.map(item => {
          return item.attributes;
        });
      }
    }
  },
  created() {},
  mounted() {
    this.fetchLand();
  },
  methods: {
    selectedChange() {},
    changeInput() {
      this.search.lx == "控制性规划"
        ? (this.inputName = "请输入地块编号")
        : (this.inputName = "请输入地块名称");
    },
    goForceLand(item) {
      this.$parent.landList = item;
    },
    fetchLand() {
      const _mj =
        this.search.mj[0] && this.search.mj[1]
          ? ` and convert(float,mj) >= ${parseFloat(this.search.mj[0]).toFixed(
              2
            )} and convert(float,mj) <= ${parseFloat(this.search.mj[1]).toFixed(
              2
            )}`
          : ``;
      let _ydxz_ = [];
      this.search.ydxz.map(({ code }) => {
        const arr = allKind.filter(d => {
          return d.label.includes(code);
        });
        _ydxz_ = _ydxz_.concat(arr);
      });
      const _ydxz = _ydxz_.length
        ? ` and ydxz in (${_ydxz_
            .map(item => {
              return `'${item.code}'`;
            })
            .join(`,`)})`
        : ``;
      if (_mj != "" || _ydxz_.length > 0) {
        this.$parent.matchShow = true;
      }
      if (this.search.lx != "控制性规划") {
        landApi
          .yd({
            where: `lx like '%${this.search.lx}%' and ydkmc like '%${this.search.name}%' ${_mj} ${_ydxz}`
          })
          .then(({ data }) => {
            this.list = data;
            if (this.$parent.matchShow) {
              this.$parent.matchTable = data.map(item => {
                return {
                  name: item.ydkmc
                };
              });
            }
            this.$parent.ydxz = data
              .map(item => {
                return `'${item.ydkmc}'`;
              })
              .join(`,`);
            this.$parent.ydxzLen = this.search.ydxz.length;
            this.$parent.ydxzSearchChange(
              this.search.lx || this.search.name || _mj || _ydxz
            );
          });
      } else {
        const that = this;
        loadModules(
          ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
          OPTION
        ).then(async ([QueryTask, Query]) => {
          const queryTask = new QueryTask({
            url: ALLLANDREGULATORY + "/0"
          });
          const query = new Query();
          query.outFields = ["*"];
          query.where = `DKBH like '%${this.search.name}%' ${_mj} ${_ydxz}`;
          query.returnGeometry = true;
          queryTask.execute(query).then(respone => {
            this.list = respone.features.map(item => {
              return {
                ...item,
                ydkmc: item.attributes.DKBH,
                lx: "-",
                mj: item.attributes.YDMJ
              };
            });
          });
        });
      }
    },
    changeColor(lx) {
      return lx == "可供地块" ? "kg" : "yz";
    }
  }
};
</script>
 <style lang="less">
.landNoneTable {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 600px;
  padding: 0 10px;
  border-left: 1px solid;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);
  // background: linear-gradient(270deg, rgba(27, 56, 101, 0.45) 0%, rgba(3, 15, 31, 0.6) 100%);
  border-image: linear-gradient(
      360deg,
      rgba(7, 73, 190, 0) 0%,
      rgba(0, 172, 255, 0.4) 32%,
      rgba(0, 255, 255, 0.8) 51%,
      rgba(0, 172, 255, 0.4) 73%,
      rgba(7, 73, 190, 0) 100%
    )
    1 10;
  > header {
    box-sizing: border-box;
    padding: 10px 0px 16px;
    header {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 20px;
      font-weight: 700;
      color: #4cd7ec;
      text-shadow: 0px 0px 4px rgba(76, 215, 236, 0.3);
      padding-left: 20px;
      .stateTipHeaderBar:before {
        content: "";
        width: 4px;
        height: 24px;
        background: #15f9fd;
        display: inline-block;
        float: left;
        margin-top: -7px;
      }
      .stateTipHeaderBar {
        width: 120px;
        height: 12px;
        background: linear-gradient(
          90deg,
          rgba(47, 253, 255, 0.5) 0%,
          rgba(21, 249, 253, 0) 100%
        );
        display: inline-block;
      }
    }
    > span {
      display: block;
    }
    > span:nth-child(2) {
      padding: 13px 0px 0px;
      display: flex;
      > button {
        color: #fff;
        display: inline-block;
        font-weight: 300;
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        // padding: 0 10px;
        width: 36px;
        height: 36px;
        line-height: 36px;
      }
      div {
        background-color: #fff;
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        padding: 0 10px;
        border-radius: 2px;
        display: flex;
        flex-direction: row;
        flex: 1;
        * {
          vertical-align: top;
        }
        > input {
          height: 36px;
          box-sizing: border-box;
          padding: 0 0 0 10px;
          border: 0px;
          outline: none;
          flex: 1;
          width: 100%;
        }
        > .iconfont {
          font-size: 18px;
          color: #bbb;
        }
      }
    }
    .match {
      width: 308px;
      height: 32px;
      background-image: url("../../canvass/CanvassRes/MatchResult/image/matchButton.png");
      // margin: 6px auto;
      margin-left: 73px;
      line-height: 31px;
      cursor: pointer;
    }
  }
  .landResTableSearch {
    padding: 4px 0px;
    > div {
      text-align: left;
      line-height: 26px;
      margin: 12px 0px;
      box-sizing: border-box;
      display: flex;
      > * {
        vertical-align: middle;
      }
      label {
        width: 75px;
        height: 100%;
        display: inline-block;
      }
      .v-select {
        flex: 1;
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        .vs__actions {
          cursor: pointer;
          .vs__open-indicator {
            fill: rgba(255, 255, 255, 0.8);
          }
        }
        .vs__selected-options {
          .vs__selected {
            background-color: #0000005e;
            color: #fff;
            padding-left: 4px;
            .vs__deselect {
              fill: rgba(255, 255, 255, 1);
            }
          }
          .vs__search {
            color: #fff;
          }
        }
        .listbox {
          max-height: 400px;
          overflow: auto;
        }
      }
      > input {
        height: 32px;
        width: 70px;
        box-sizing: border-box;
        border: 0px;
        outline: none;
        box-sizing: border-box;
        padding-left: 6px;
        color: #fff;
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
  select {
    height: 30px;
    width: 100px;
    flex: 1;
    background: rgba(216, 216, 216, 0.2);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    > option {
      width: 20px;
      height: 20px;
      color: #000;
    }
  }
  .landNone_Table {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: 8px;
    header {
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      background-color: rgba(55, 113, 183, 0.4);
      span {
        height: 40px;
        text-align: center;
        color: #2afffa;
        font-weight: 600;
      }
      display: flex;
    }
    > ul::-webkit-scrollbar {
      display: none;
    }
    > ul {
      flex: 1;
      overflow: auto;
      > li {
        cursor: pointer;
        display: flex;
        border-bottom: 1px #9e9e9e solid;
        padding: 10px 8px;

        span:first-child {
          font-weight: 600;
        }

        span:nth-child(2) {
          color: #e4ecf9;
        }
      }
      > .no_result {
        display: block;
        text-align: center;
      }
    }
    span {
      display: inline-block;
      text-align: left;
      width: 90px;
      font-size: 17px;
    }
    span:first-child {
      flex: 1;
      // text-align: center;
      box-sizing: border-box;
      padding: 0 8px;
    }
    span:last-child {
      vertical-align: middle;
    }
    // .kg {
    //   color: rgb(230, 0, 169);
    // }
    // .yz {
    //   color: rgb(255, 206, 7);
    // }
  }
}
</style>