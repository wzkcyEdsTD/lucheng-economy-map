<template>
  <div class="Com_content canvR_container">
    <div class="Com_map">
      <commonArcgis
        id="canMap"
        ref="canMap"
        v-show="show2dMap"
        :leftOptions="leftOptions"
        :mapTool="mapTool"
        :shallCanvassRes="true"
        :point="point"
        :icon_show_left="!icon_show_left"
        :forceCanvass="forceCanvass"
        :forceLand="forceLand"
        :forceBuilding="forceBuilding"
        :ResName="ResName"
        :commonSearch="commonSearch"
        :isSearch="isSearch"
        :ydxz="ydxz"
        :iszsly="iszsly"
      />
    </div>
    <div class="Com_container" id="can_container">
      <div
        class="left"
        :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`} topLeft  `"
      >
        <div>
          <leftMultiSelect :leftformdata="leftformdata" :leftOptions="leftOptions" />
          <ToggleSwitch @change="change" />
        </div>
        <span @click="hidden2()" class="hidden_button"></span>
      </div>
      <transition name="frame">
        <div
          class="right"
          v-show="!buidinform_dispaly"
          :class="`animated ${icon_show_right?`slideOutRight`:`slideInRight`} topLeft  `"
        >
          <!--  表格特殊化 不做可配置  -->
          <canvassResTable ref="canvassResTable" :leftMuMatch="leftMuMatch" />
          <span @click="hidden3(),legend()" class="hidden_right_button"></span>
        </div>
      </transition>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
    <div class="imgIcon" @click="showBook()" :style="{right:moveRight + 'px'}">
      <img :src="`${server}/icon/canvassImg/book.png`" />
    </div>
    <transition name="frame">
      <bookRes v-if="bookShow" />
    </transition>
    <transition name="frame">
      <buidInform
        v-if="buidinform_dispaly"
        :forceBuilding="forceBuilding"
        :showAsideList="showAsideList"
        :_asideList="asideList"
        :isAroundBtn="false"
      />
    </transition>
    <transition name="frame">
      <projectContent
        v-if="projectShow"
        :icon_show_left="icon_show_left"
        :forceCanvass="forceCanvass"
      />
    </transition>
    <transition name="frame">
      <MatchResult
        v-if="matchShow"
        :matchTable="matchTable"
        @matchListDispaly="matchListDispaly"
        @clickit="resultshow"
      />
    </transition>
  </div>
</template>

<script>
import commonArcgis from "@/components/canvass/CanvassArcgis/commonArcgis";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
// import rightRadioFrame from "@/components/common/selectRadioFrame/rightRadioFrame";
import canvassResTable from "@/components/canvass/CanvassRes/canvassResTable";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import buidInform from "@/components/common/buildFrame/buidInform";
import framePDF from "../CanvassArcgis/framePDF";
import { WRT_config } from "@/components/common/Tmap";
import bookRes from "@/components/canvass/canvassBook/book";
const { server } = WRT_config;
import projectContent from "./canvassContent/rightConten";
import MatchResult from "./MatchResult/MatchResult";
import $ from "jquery";
import ToggleSwitch from "./Switch";
const leftHash = {
  可供地块: "dk",
  已征待拆地块: "dk",
  楼宇招商: "ly",
  重点招商项目: "zs",
  鹿城公房: "gf"
};
export default {
  name: "canvassRes",
  data() {
    return {
      icon_show_left: false,
      icon_show_right: false,
      show2dMap: true,
      buidinform_dispaly: false,
      forceCanvass: null,
      forceLand: null,
      goForceBuild: null,
      showAsideList: null,
      asideList: {},
      forceBuilding: {},
      server,
      moveRight: "410",
      Left: "30",
      bookShow: false,
      projectShow: false,
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      leftformdata: {
        list: [],
        value: "plot"
      },
      leftOptions: [
        {
          label: "招商信息",
          check: false,
          show: true,
          children: [
            // {
            //   name: "规划地块",
            //   id: "allLandRegulatory",
            //   fun: "addAllLandRegulatory",
            //   check: false
            // },
            {
              name: "可供地块",
              id: "landAva",
              fun: "addLandAva",
              check: true
            },
            {
              name: "已征待拆地块",
              id: "YZDC",
              fun: "addYZDC",
              check: true
            },
            {
              name: "楼宇招商",
              id: "buildCanvass",
              fun: "addBuildCanvass",
              check: true
            },
            {
              name: "重点招商项目",
              id: "canvassArea@canvassPoint",
              fun: "addCanvass",
              check: true
            },
            {
              name: "鹿城公房",
              id: "lcgf_point",
              fun: "addLcgfPoint",
              check: false
            }
          ]
        }
      ],
      ResName: {},
      commonSearch: {},
      matchShow: false,
      matchTable: [],
      isSearch: false,
      iszsly: false,
      ydxz: "",
      leftMuMatch: {
        dk: [],
        ly: [],
        zs: [],
        gf: []
      }
    };
  },
  components: {
    commonArcgis,
    leftMultiSelect,
    // rightRadioFrame,
    canvassResTable,
    hoverPanel,
    buidInform,
    bookRes,
    projectContent,
    MatchResult,
    ToggleSwitch
  },
  props: {
    point: Array,
    ProjectName: Object,
    canvassResSearch: Object
  },
  watch: {
    ProjectName: {
      handler(newVal, val) {
        this.ResName = newVal;
      },
      immediate: true
    },
    canvassResSearch: {
      handler(newVal, val) {
        if (!newVal.features) return;
        if (!newVal.features[0].attributes.lx) {
          this.commonSearch = newVal;
          this.forceCanvass = newVal.features[0].attributes;
          this.projectShow = true;
          this.icon_show_left = true;
          this.Left = "30";
        } else {
          this.commonSearch = newVal;
        }
      },
      immediate: true
    }
  },
  methods: {
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
      this.Left = !this.icon_show_left ? "410" : "30";
    },
    hidden3() {
      this.icon_show_right = !this.icon_show_right;
      this.moveRight = !this.icon_show_right ? "410" : "30";
    },
    /**
     * 左模块checkbox双向绑定更新后触发
     */
    changeLeftOption(options) {
      this.leftOptions = options;
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    changeForceBuild(item, shallAside) {
      this.showAsideList = shallAside;
      this.asideList = item;
      this.forceBuilding = { gdid: item.gdid };
      this.$refs.canMap.fetchBuild({ name: "buildid", val: item.gdid });
    },
    showBook() {
      this.bookShow = true;
      this.icon_show_left = true;
      this.icon_show_right = true;
    },
    legend() {
      if (!this.icon_show_right) {
        $("body .esri-ui-bottom-right").css({ right: "410px" });
      } else {
        $("body .esri-ui-bottom-right").css({ right: "0px" });
      }
    },
    matchListDispaly(val) {
      this.$refs.canvassResTable.matchDispaly = val;
    },
    /**
     * 用地判断是否有搜索条件
     */
    ydxzSearchChange(_boolean) {
      if (_boolean) {
        const _leftOptions = this.$util.clone(this.leftOptions);
        _leftOptions[0].children = _leftOptions[0].children.map(item => {
          return { ...item, check: false };
        });
        this.leftOptions = _leftOptions;
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    },
    /**
     * 招商楼宇判断是否有搜索条件
     */
    zslySearchChange(_boolean, _index, _id, _fun) {
      if (_boolean) {
        const _leftOptions = this.$util.clone(this.leftOptions);
        this.iszsly = true;
        _leftOptions[0].children = _leftOptions[0].children.map(item => {
          return { ...item, check: false, id: "", fun: "" };
        });
        for (let i = 0; i < _leftOptions[0].children.length; i++) {
          if (_index == i) {
            _leftOptions[0].children[i].check = true;
            _leftOptions[0].children[i].id = _id;
            _leftOptions[0].children[i].fun = _fun;
          }
        }
        this.leftOptions = _leftOptions;
      } else {
        this.iszsly = false;
      }
    },
    resultshow() {
      this.matchShow = false;
      this.$refs.canvassResTable.matchDispaly = true;
    },
    change(obj) {
      const _leftOptions = this.$util.clone(this.leftOptions);
      if (obj) {
        _leftOptions[0].children[1].id = "landAva";
        _leftOptions[0].children[1].fun = "addLandAva";
      } else {
        _leftOptions[0].children[1].id = "landAvadefinition";
        _leftOptions[0].children[1].fun = "addLandAvadefinition";
      }
      this.leftOptions = _leftOptions;
    },
    Listcontact(oitem) {
      const leftMuMatch = { dk: [], ly: [], zs: [], gf: [] };
      if (oitem && oitem.check) {
        leftMuMatch[leftHash[oitem.name]].push(oitem);
      }
      this.leftMuMatch = leftMuMatch;
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./canvassRes.less");
.imgIcon {
  position: absolute;
  transition: all 1s;
  top: 108px;
  width: 64px;
  height: 64px;
  background: rgba(60, 131, 211, 0.55);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  border: 1px solid rgba(106, 223, 255, 0.4);
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>



