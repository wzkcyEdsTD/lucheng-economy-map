<template>
  <div class="Com_content ecoChar">
    <div class="Com_map">
      <ecoCharArcgis
        id="ecoCharArcgis"
        ref="ecoCharArcgis"
        :forceChar="forceChar"
        :mapTool="mapTool"
        :mark="mark"
        :tag="tag"
        :fromCanvass="fromCanvass"
        :leftOptions="leftOptions"
      />
    </div>
    <div class="Com_container">
      <div
        :class="`right animated ${icon_show_right?`slideInRight`:`slideOutRight`} ${fromCanvass? `topLeft`:``}`"
      >
        <div>
          <rightCompetition :forceChar="forceChar" />
        </div>
        <span @click="hiddenRight()" class="hidden_right_button"></span>
      </div>
      <div id="charlunbo">
        <div id="lunbo" :class="`animated ${icon_show_middle?`slideInUp`:`slideOutDown`}`">
          <lunbo ref="lunbo" :icon_show_right="icon_show_right" />
        </div>
      </div>
      <div
        :class="`left animated ${icon_show_left?`slideInLeft`:`slideOutLeft`} ${fromCanvass? `topLeft`:``}`"
      >
        <div class="leftCompetition">
          <leftCompetition ref="leftCompetition" :forceChar="forceChar" />
        </div>
        <span @click="hiddenLeft()" class="hidden_button"></span>
      </div>
    </div>
    <!-- <transition name="frame">
      <ecoCharSingle v-if="showDetail" :forceChar="forceChar" />
    </transition>-->
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="ImgUrl" />
    <transition name="frame">
      <QjFrame v-show="QjShow" ref="searchBox" :iframName="iframName" :iframeAddr="iframeAddr" />
    </transition>
  </div>
</template>

<script>
import ecoCharArcgis from "./ecoCharArcgis";
import leftCompetition from "./leftChar";
import rightCompetition from "./rightChar";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
// import ecoCharSingle from "./ecoCharSingle";
import bigImg from "../EcoArcgis/bigImg";
import lunbo from "./lunbo/lunbo";
import streetApi from "@/api/beans/u_streetinfo";
import streetDataApi from "@/api/beans/u_streetdata";
import { loadModules } from "esri-loader";
import { WRT_config, ZSZY, OPTION } from "@/components/common/Tmap";
import QjFrame from "@/components/canvass/CanvassQJ/QjFrame";
const { server } = WRT_config;
export default {
  name: "ecochar",
  data() {
    return {
      icon_show_right: true,
      icon_show_left: true,
      icon_show_middle: true,
      // showDetail: false,
      leftOptions: [],
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      mark: 0,
      streetList: {},
      forceChar: {},
      tag: "lb",
      ImgUrl: null,
      showImg: false,
      iframName: null,
      iframeAddr: null,
      QjShow: false,
      vrLink: []
    };
  },
  components: {
    ecoCharArcgis,
    leftCompetition,
    rightCompetition,
    // ecoCharSingle,
    lunbo,
    bigImg,
    QjFrame
  },
  props: {
    // 嵌入canvass模块左侧栏置顶
    fromCanvass: Boolean
  },
  async created() {
    await this.fetchStreet();
    await this.fetchStreetData();
    //  默认街道
    this.forceChar = this.streetList["七都街道"];

    this.VrName();
  },
  mounted() {},
  methods: {
    /**
     * 左侧
     */
    hiddenLeft() {
      this.icon_show_left = !this.icon_show_left;
    },
    hiddenRight() {
      this.icon_show_right = !this.icon_show_right;
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    switchChar(item) {
      this.forceChar = this.streetList[item.label];
    },
    fetchStreet() {
      const that = this;
      return new Promise((resolve, reject) => {
        const streetList = {};
        streetApi.ds().then(({ data }) => {
          data.map(item => {
            streetList[item.name] = {
              ...item,
              point: [item.pointx, item.pointy],
              image1: `${server}/icon/streetProject/${item.name}1.jpg`,
              image2: `${server}/icon/streetProject/${item.name}2.jpg`,
              _intro: `${item.intro.slice(0, 200)}...`,
              _jj: `${item.jj.slice(0, 100)}...`,
              url: `${server}/icon/streetImg/${item.name}.png`
            };
          });
          that.streetList = streetList;
          resolve(true);
        });
      });
    },
    fetchStreetData() {
      const that = this;
      return new Promise((resolve, reject) => {
        streetDataApi.ds({ order: "year asc,month asc" }).then(({ data }) => {
          const streetList = that.streetList;
          data.map(item => {
            if (!streetList[item.name].data) streetList[item.name].data = [];
            streetList[item.name].data.push(item);
          });
          that.streetList = streetList;
          resolve(true);
        });
      });
    },
    // clickImg(e) {
    //   this.showImg = true;
    //   // 获取当前图片地址
    //   this.imgSrc = e.currentTarget.src;
    // },
    viewImg() {
      this.showImg = false;
    },

    /**
     * 2020.4.1
     * 全景
     */
    VrName() {
      const that = this;
      const _leftOptions = [];
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: ZSZY + "/1"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = "1=1";
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          const vrname = response.features.map(item => {
            return { item };
          });
          for (let v = 0; v < vrname.length; v++) {
            if (
              vrname[v].item.attributes.SHORTNAME == "印象南塘" ||
              vrname[v].item.attributes.SHORTNAME == "人民路漫游" ||
              vrname[v].item.attributes.SHORTNAME == "市中心漫游"
            ) {
              that.vrLink.push({
                name: vrname[v].item.attributes.SHORTNAME,
                addr: `${server}/${vrname[v].item.attributes.VR}`
              });
            } else {
              that.vrLink.push({
                name: vrname[v].item.attributes.SHORTNAME,
                addr: vrname[v].item.attributes.VR
              });
            }
          }
        });
      });
    },
    showVr(item) {
      const name = item.name || item;
      for (let i = 0; i < this.vrLink.length; i++) {
        this.vrLink.map(_item => {
          if (name == _item.name) {
            this.iframName = _item.name;
            this.iframeAddr = _item.addr;
          }
        });
      }
      this.QjShow = true;
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./ecoChar.less");
</style>