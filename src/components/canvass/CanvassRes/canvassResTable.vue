<template>
  <div class="canvassResTable">
    <header>
      <header>
        {{title}}
        <!-- <span class="stateTipHeaderBar"></span> -->
      </header>
      <span>
        <div>
          <i class="iconfont iconRectangleCopy2"></i>
          <input type="text" v-model="searchText" :placeholder="inputName" />
        </div>
        <button @click="fetchList">搜索</button>
      </span>
      <span>
        <div>
          <label>招商类型</label>
          <select v-model="forceType" @change="forceTypeChange">
            <option key="2" value="land">用地地块</option>
            <option key="1" value="canvass">招商项目</option>
            <option key="0" value="build">楼宇资源</option>
            <option key="3" value="lcgf">公房资源</option>
          </select>
        </div>
      </span>
      <span class="canvassResTableSearch">
        <div v-if="forceType == 'canvass'">
          <div>
            <label>所属街道</label>
            <v-select v-model="ssjd" multiple :options="multiSsjd"></v-select>
          </div>
        </div>
        <div v-else-if="forceType == 'land'">
          <div>
            <label>用地面积</label>
            <input type="text" v-model="formdata.land.search.ydmj[0]" class="mu1" />&nbsp;亩~
            <input type="text" v-model="formdata.land.search.ydmj[1]" class="mu1" />&nbsp;亩
          </div>
          <div>
            <label>用地性质</label>
            <v-select v-model="formdata.land.search.ydxz" multiple :options="overKind"></v-select>
          </div>
        </div>
        <div v-else-if="forceType == 'build'">
          <div>
            <label>闲置面积</label>
            <input type="text" v-model="formdata.build.search.jzmj[0]" class="mu1" />&nbsp;~
            <input type="text" v-model="formdata.build.search.jzmj[1]" class="mu1" />&nbsp;㎡
          </div>
          <div>
            <label>月租金</label>
            <input type="text" v-model="formdata.build.search.mpfmzj[0]" class="mu1" />&nbsp;~
            <input type="text" v-model="formdata.build.search.mpfmzj[1]" class="mu1" />&nbsp;元/㎡
          </div>
          <div>
            <label>物业费</label>
            <input type="text" v-model="formdata.build.search.mpfmwy[0]" class="mu1" />&nbsp;~
            <input type="text" v-model="formdata.build.search.mpfmwy[1]" class="mu1" />&nbsp;元/㎡
          </div>
          <div>
            <label>所属街道</label>
            <v-select v-model="ssjd" multiple :options="multiSsjd"></v-select>
          </div>
        </div>
        <div v-else>
          <div>
            <label>房屋面积</label>
            <input type="text" v-model="formdata.lcgf.search.mj[0]" class="mu1" />&nbsp;~
            <input type="text" v-model="formdata.lcgf.search.mj[1]" class="mu1" />&nbsp;㎡
          </div>
          <div>
            <label>权属单位</label>
            <v-select v-model="formdata.lcgf.search.qsdw" multiple :options="multiQsdw"></v-select>
          </div>
          <div>
            <label>房屋状态</label>
            <v-select v-model="formdata.lcgf.search.fwzt" multiple :options="lcgfFwzt"></v-select>
          </div>
        </div>
      </span>
      <div class="match" @click="fetchList">匹配</div>
    </header>
    <hr color="#FFF" size="1" />
    <div class="canRes_Table">
      <div v-if="forceType=='land'" class="landTable">
        <header>
          <span v-for="name in formdata[forceType].table" :key="name">{{name}}</span>
        </header>
        <ul v-show="matchDispaly">
          <li v-for="(item,index) in list[forceType]" :key="index" @click="goTo(item)">
            <span>{{item.name}}</span>
            <span>{{item.ssjd}}</span>
            <span>{{item.lx}}</span>
          </li>
          <li v-if="!list[forceType].length">没有匹配的结果</li>
        </ul>
      </div>
      <div v-else-if="forceType=='canvass'" class="landTable">
        <header>
          <span v-for="name in formdata[forceType].table" :key="name">{{name}}</span>
        </header>
        <ul v-show="matchDispaly">
          <li v-for="(_item,_index) in list[forceType]" :key="_index" @click="goTo(_item)">
            <span>{{_item.name }}</span>
            <span>{{_item.ssjd}}</span>
            <span>{{_item.lx}}</span>
          </li>
          <li v-if="!list[forceType].length">没有匹配的结果</li>
        </ul>
      </div>
      <div v-else-if="forceType=='build'" class="buildTable">
        <ul v-show="matchDispaly">
          <li
            v-for="(item,index) in list[forceType]"
            :key="index"
            class="typelist"
            @click="showAsideList(item,false)"
          >
            <div>
              <p class="company_Name">
                {{item.name}}
                <i>
                  (闲置房间
                  <i class="i_gold">{{item.asideLength}}</i>处)
                </i>
              </p>
              <ul class="asideList" @click.stop="showAsideList(item,true)">
                <li v-for="(_item,_index) in item.display" :key="_index">
                  <span>{{_item.szlc}}楼</span>
                  <span>面积:{{_item.jzmj || '-'}}㎡</span>
                  <span>房间号:{{_item.fjh || `-`}}</span>
                </li>
                <li v-if="item.asideLength > 5">查看更多..</li>
              </ul>
            </div>
          </li>
          <li v-if="!list[forceType].length">没有匹配的结果</li>
        </ul>
      </div>
      <div v-else class="lcgfTable">
        <header>
          <span v-for="name in formdata[forceType].table" :key="name">{{name}}</span>
        </header>
        <ul v-show="matchDispaly">
          <li
            v-for="(_item,_index) in list[forceType]"
            :key="_index"
            @click.stop="$parent.$refs.canMap.forceLcgf(_item)"
          >
            <span>{{_item.dz}}</span>
            <span>{{_item.mj}}</span>
            <span>{{_item.fwzt}}</span>
          </li>
          <li v-if="!list[forceType].length">没有匹配的结果</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { ZSZY, OPTION } from "@/components/common/Tmap";
import {
  overKind,
  allKind,
  lcgfFwzt,
  multiSsjd,
  multiQsdw
} from "@/components/common/multi";
import lcxxApi from "@/api/beans/u_lcxx";
import zsdkmApi from "@/api/beans/u_canvass";
import landApi from "@/api/beans/u_land";
import lcgfApi from "@/api/beans/u_lcgf";
export default {
  name: "canvassResTableFrame",
  data() {
    return {
      overKind,
      allKind,
      multiSsjd,
      multiQsdw,
      lcgfFwzt,
      searchText: "",
      ssjd: [],
      forceType: "land",
      title: "招商项目",
      formdata: {
        build: {
          search: {
            jzmj: ["", ""],
            mpfmzj: ["", ""],
            mpfmwy: ["", ""]
          },
          table: ["序号", "楼宇名称", "入驻企业数", "物业费(元/m²)"]
        },
        land: {
          search: {
            mj: ["", ""],
            ydmj: ["", ""],
            ydxz: []
          },
          table: ["名称", "所属街道", "类型"]
        },
        canvass: {
          search: {
            mj: ["", ""]
          },
          table: ["名称", "所属街道", "类型"]
        },
        lcgf: {
          search: {
            mj: ["", ""],
            fwzt: [],
            qsdw: []
          },
          table: ["地址", "面积(㎡)", "状态"]
        }
      },
      list: {
        build: [],
        land: [],
        canvass: [],
        lcgf: []
      },
      canvass: [],
      land: [],
      matchDispaly: true,
      dklx: "",
      ydxz: "",
      inputName: "请输入用地名称"
    };
  },
  watch: {
    forceType(newVal) {
      this.fetchList();
    },
    leftMuMatch: {
      handler(newVal, val) {
        this.dklx = "";
        this.ydxz = "";
        const dkLeghth = newVal["dk"].length;
        const lyLength = newVal["ly"].length;
        const zsLength = newVal["zs"].length;
        const gfLength = newVal["gf"].length;
        if (dkLeghth && zsLength) {
          this.forceType = "land";
          if (dkLeghth > 1) {
            newVal["dk"].map(item => {
              if (item.id == "landAvadefinition") {
                this.ydxz = "工业用地";
              }
            });
          } else {
            newVal["dk"].map(item => {
              if (item.id == "landAvadefinition") {
                this.ydxz = "工业用地";
                this.dklx = "可供地块";
              } else if (item.id == "landAva") {
                this.ydxz = "";
                this.dklx = "可供地块";
              } else {
                this.ydxz = "";
                this.dklx = "已征待拆";
              }
            });
          }
          // this.dofun();
        } else if (dkLeghth) {
          this.forceType = "land";
          if (dkLeghth > 1) {
            newVal["dk"].map(item => {
              if (item.id == "landAvadefinition") {
                this.ydxz = "工业用地";
              }
            });
          } else {
            newVal["dk"].map(item => {
              if (item.id == "landAvadefinition") {
                this.ydxz = "工业用地";
                this.dklx = "可供地块";
              } else if (item.id == "landAva") {
                this.ydxz = "";
                this.dklx = "可供地块";
              } else {
                this.ydxz = "";
                this.dklx = "已征待拆";
              }
            });
          }
          // this.doLand();
        } else if (zsLength) {
          this.forceType = "canvass";
        } else if (lyLength) {
          this.forceType = "build";
        } else if (gfLength) {
          this.forceType = "lcgf";
        }
      },
      immediate: true,
      deep: true
    }
  },
  components: { vSelect },
  props: { leftMuMatch: Object },
  created() {},
  mounted() {
    this.fetchList();
  },
  methods: {
    goForceLand(item) {
      this.$parent.forceLand = item;
      this.$parent.projectShow = false;
    },
    forceTypeChange() {
      this.searchText = "";
      if (this.forceType == "land") {
        this.inputName = "请输入用地名称";
      } else if (this.forceType == "canvass") {
        this.inputName = "请输入招商项目名称";
      } else {
        this.inputName = "请输入楼宇名称";
      }
    },
    goTo(item) {
      if (item.lx == "招商项目") {
        this.goForceCanvass(item);
      } else {
        this.goForceLand(item);
      }
    },
    goForceCanvass(item) {
      this.$parent.forceCanvass = item;
      this.$parent.projectShow = true;
      this.$parent.icon_show_left = true;
    },
    showAsideList(item, shallAside) {
      this.$parent.changeForceBuild(item, shallAside);
    },
    fetchList() {
      if (this.forceType == "land") {
        this.fetchLand();
      } else if (this.forceType == "canvass") {
        this.fetchCanvassList();
      } else if (this.forceType == "build") {
        this.fetchBuildList();
      } else if (this.forceType == "lcgf") {
        this.fetchLcgfList();
      }
    },
    fetchLcgfList() {
      const mj1 = parseFloat(
        this.formdata[this.forceType].search.mj[0]
      ).toFixed(2);
      const mj2 = parseFloat(
        this.formdata[this.forceType].search.mj[1]
      ).toFixed(2);
      const _mj =
        !isNaN(mj1) && !isNaN(mj2)
          ? ` and convert(float,mj) >= ${mj1} and convert(float,mj) <= ${mj2}`
          : ``;
      const fwzt = this.formdata[this.forceType].search.fwzt;
      const _fwzt_ = fwzt.length
        ? `and fwzt in (${fwzt.map(item => {
            return `'${item.code}'`;
          })})`
        : ``;
      const qsdw = this.formdata[this.forceType].search.qsdw;
      const _qsdw_ = qsdw.length
        ? `and qsdw in (${qsdw.map(item => {
            return `'${item.code}'`;
          })})`
        : ``;
      lcgfApi
        .ds({
          where: `dz like '%${this.searchText}%' ${_fwzt_} ${_qsdw_} ${_mj} `
        })
        .then(({ data }) => {
          this.list[this.forceType] = data;
        });
    },
    fetchBuildList() {
      const rangeSql = [];
      const asideSortByBuild = {};
      const forceList = [];
      const isAside =
        (this.formdata.build.search.jzmj[0] &&
          this.formdata.build.search.jzmj[1]) ||
        (this.formdata.build.search.mpfmzj[0] &&
          this.formdata.build.search.mpfmzj[1]) ||
        (this.formdata.build.search.mpfmwy[0] &&
          this.formdata.build.search.mpfmwy[1])
          ? true
          : false;
      for (let v in this.formdata.build.search) {
        const item = this.formdata.build.search[v];
        rangeSql.push(
          item[0] && item[1]
            ? ` and ${v} >= ${item[0]} and ${v} <= ${item[1]}`
            : ``
        );
      }
      const _ssjd_ = this.ssjd.length
        ? `and ssjd in (${this.ssjd.map(item => {
            return `'${item.code}'`;
          })})`
        : ``;
      lcxxApi
        .ds({
          where: `name like '%${this.searchText}%' ${_ssjd_} ${rangeSql.join(
            ` `
          )} ${isAside ? ` and status = '2'` : ``}`
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
          for (let d in asideSortByBuild) {
            forceList.push({
              ...asideSortByBuild[d],
              display: asideSortByBuild[d].asideChildren.slice(0, 5)
            });
          }
          this.list.build = forceList
            .sort(this.$util.compare("asideLength"))
            .reverse();

          this.$parent.matchTable = this.list.build;
          this.$parent.zslySearchChange(
            isAside || this.searchText,
            4,
            "buildCanvass",
            "addBuildCanvass"
          );
          if (isAside || this.ssjd || this.searchText) {
            this.$parent.matchShow = true;
          }
        });
    },
    fetchCanvassList() {
      const _ssjd_ = this.ssjd.length
        ? `and ssjd in (${this.ssjd.map(item => {
            return `'${item.code}'`;
          })})`
        : ``;
      zsdkmApi
        .zsdkm({
          where: `xmmc like '%${this.searchText}%' ${_ssjd_}`
        })
        .then(({ data }) => {
          if (data.length) {
            this.list[this.forceType] = data.map(item => {
              return {
                ...item,
                name: item.xmmc,
                ssjd: item.ssjd,
                lx: "招商项目",
                pid: item.pid,
                x: item.x,
                y: item.y
              };
            });
          } else {
            this.list[this.forceType] = "";
          }
          // this.$parent.zslySearchChange(
          //   this.searchText || this.ssjd,
          //   5,
          //   "canvassArea@canvassPoint",
          //   "addCanvass"
          // );

          if ((this.searchText || this.ssjd) && this.list[this.forceType]) {
            this.$parent.matchTable = this.list[this.forceType];
            this.$parent.matchShow = true;
          }
        });
    },
    fetchLand() {
      const mj1 = parseFloat(
        this.formdata[this.forceType].search.ydmj[0]
      ).toFixed(2);
      const mj2 = parseFloat(
        this.formdata[this.forceType].search.ydmj[1]
      ).toFixed(2);
      const _mj =
        !isNaN(mj1) && !isNaN(mj2)
          ? ` and convert(float,mj) >= ${mj1} and convert(float,mj) <= ${mj2}`
          : ``;
      let _ydxz_ = [];
      this.formdata[this.forceType].search.ydxz.map(({ code }) => {
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
      const arr = [];
      for (let v in this.formdata.land.search) {
        const item = this.formdata.land.search[v];
        if (item[0] && item[1]) {
          arr.push(`and ${v} >= ${item[0]} and ${v} <= ${item[1]}`);
        }
      }
      landApi
        .yd({
          where: ` ydkmc like '%${this.searchText}%' ${_mj} ${_ydxz}`,
          order: `ydkmc`
        })
        .then(({ data }) => {
          this.land = data;
          if (this.land) {
            this.list[this.forceType] = this.land.map(item => {
              return {
                name: item.ydkmc,
                ssjd: item.ssjd,
                lx: item.lx,
                pid: "-",
                x: "-",
                y: "-"
              };
            });
            this.$parent.ydxz = this.list[this.forceType]
              .map(item => {
                return `'${item.name}'`;
              })
              .join(`,`);
          } else {
            this.list[this.forceType] = "";
          }
          this.$parent.ydxzSearchChange(
            this.searchText || !isNaN(mj1) || !isNaN(mj2) || _ydxz
          );
          if (
            (this.searchText || !isNaN(mj1) || !isNaN(mj2) || _ydxz) &&
            this.land
          ) {
            this.$parent.matchTable = this.land.map(item => {
              return {
                name: item.ydkmc,
                lx: item.lx,
                pid: "-",
                x: "-",
                y: "-"
              };
            });
            this.$parent.matchShow = true;
          }
        });
    },
    dofun(fn) {
      let result = [];
      zsdkmApi.zsdkm({}).then(({ data }) => {
        this.canvass = data.map(item => {
          return {
            ...item,
            name: item.xmmc,
            ssjd: item.ssjd,
            lx: "招商项目",
            pid: item.pid,
            x: item.x,
            y: item.y
          };
        });
        result.push(this.canvass);
        landApi
          .yd({
            where: ` lx like '%${this.dklx}%' and ydxz like '%${this.ydxz}%'`,
            order: `ydkmc`
          })
          .then(({ data }) => {
            this.land = data;
            this.land = data.map(item => {
              return {
                name: item.ydkmc,
                ssjd: item.ssjd,
                lx: item.lx,
                pid: "-",
                x: "-",
                y: "-"
              };
            });
            result.push(this.land);
            this.resultList(result);
            fn && fn();
          });
      });
    },
    doLand() {
      landApi
        .yd({
          where: ` lx like '%${this.dklx}%' and ydxz like '%${this.ydxz}%'`,
          order: `ydkmc`
        })
        .then(({ data }) => {
          this.list[this.forceType] = data.map(item => {
            return {
              name: item.ydkmc,
              ssjd: item.ssjd,
              lx: item.lx,
              pid: "-",
              x: "-",
              y: "-"
            };
          });
        });
    },
    doCanvass() {
      zsdkmApi.zsdkm({}).then(({ data }) => {
        this.list[this.forceType] = data.map(item => {
          return {
            ...item,
            name: item.xmmc,
            ssjd: item.ssjd,
            lx: "招商项目",
            pid: item.pid,
            x: item.x,
            y: item.y
          };
        });
      });
    },
    resultList(vla) {
      let resultConcat = [];
      if (vla.length > 1) {
        resultConcat = vla[0].concat(vla[1]);
      } else if (vla.length > 0) {
        resultConcat = vla;
      } else {
        return;
      }
      this.$parent.matchTable = resultConcat;
      this.list[this.forceType] = resultConcat.map(item => {
        return item;
      });
    }
  }
};
</script>
 <style lang="less">
@import url("./canvassResTable.less");
// @import url("../../common/css/style.less");
</style>