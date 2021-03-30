<template>
  <div class="Com_content">
    <div class="Com_map">
      <commonArcgis
        id="estMap"
        ref="ecoEstateMap"
        :shallMapType="leftformdata.value"
        :leftOptions="leftOptions"
        :mapTool="mapTool"
        :forceTableTopic="forceTableTopic"
        :FrameName="FrameName"
        :FrameShow="FrameShow"
        :BqShow="BqShow"
        :Bquuid="Bquuid"
        :type="type"
        :moveLeft="moveLeft"
        :fromCanvass="fromCanvass"
        :CommonResult="CommonResult"
      />
    </div>
    <div class="Com_container">
      <div :class="`left ${fromCanvass ? `topLeft`:``}`">
        <div :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`}  `">
          <leftMultiSelect
            :leftformdata="leftformdata"
            :leftOptions="leftOptions"
            :imgUrl="imgUrl"
          />
          <span @click="hidden2()" class="hidden_button"></span>
        </div>
      </div>
      <commonSearch
        ref="Estate"
        :CommonfromCanvass="CommonfromCanvass"
        @JumpecoCompany="JumpecoCompany"
        :aeoBtn="true"
      />
      <div class="rightSearch" v-if="searchShow">
        <transition name="frame">
          <Rsearch :search="search" :Result="Result" :rSearchTravel="rSearchTravel" />
        </transition>
      </div>
      <transition name="frame">
        <AEO v-if="aeoSearch" :fromCanvass="fromCanvass" />
      </transition>
      <transition name="frame">
        <TopCompany ref="company" v-if="showTopCompany" :Title="Title" />
      </transition>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import commonArcgis from "@/components/economy/EcoArcgis/commonArcgis";
import commonSearch from "@/components/common/commonSearch/commonSearch.vue";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
import TopCompany from "./TopCompany";
import AEO from "./AEO";
import Rsearch from "./Rsearch";
import jjtsApi from "@/api/beans/u_jjts";
import travelApi from "@/api/beans/u_travel";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  name: "ecoestate",
  data() {
    return {
      icon_show_left: false,
      show: true,
      server,
      forceTableTopic: {},
      Result: null,
      searchShow: true,
      FrameName: null,
      FrameShow: false,
      Bquuid: null,
      BqShow: false,
      showTopCompany: false,
      type: [],
      rSearch: null,
      rSearchTravel: false,
      imgUrl: "topicsIcon",
      statistics: [
        { name: "产业平台", count: [0, 0, 8], class: "iorange" },
        { name: "专业市场", count: [0, 1, 0], class: "igreen" },
        { name: "重点项目", count: [0, 1, 8], class: "igold" },
        { name: "市百强企业", count: [0, 2, 5], class: "ipurple" },
        { name: "优质楼宇", count: [0, 3, 0], class: "ibule" },
        { name: "招商地块", count: [0, 1, 9], class: "ideepbule" }
      ],
      mapTool: this.$util.clone(hoverPanelConfig),
      leftformdata: {
        list: [
          { name: "产业布局图", id: "plot", fun: "addPlot" },
          { name: "产业热力图", id: "heat", fun: "addHeat" },
          {
            name: "产业聚合图",
            id: "polymerization",
            fun: "addPolymerization"
          }
        ],
        value: "plot"
      },
      leftOptions: [
        {
          label: "特色经济",
          check: true,
          show: true,
          children: [
            {
              name: "专业市场",
              id: "market",
              fun: "addMarket",
              check: true,
              img: true,
              num: 10,
              imgName: "专业市场"
            },
            {
              name: "重大产业项目",
              id: "featureProject",
              fun: "addFeatureProject",
              check: true,
              img: true,
              num: 18,
              imgName: "重点项目"
            },
            {
              name: "优质楼宇",
              id: "build",
              fun: "addBuild",
              check: true,
              img: true,
              num: 34,
              imgName: "优质楼宇"
            },
            {
              name: "招商项目",
              id: "land",
              fun: "addLand",
              check: true,
              img: true,
              num: 19,
              imgName: "招商项目"
            }
          ]
        },
        {
          label: "鹿城旅游",
          check: true,
          show: true,
          children: [
            {
              name: "AAA级景区村庄",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 6,
              img: true,
              id: "travel_AAA级景区村庄",
              imgName: "AAA级景区村庄"
            },
            {
              name: "A级风景区",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 5,
              img: true,
              id: "travel_A级风景区",
              imgName: "A级风景区"
            },
            {
              name: "其他景点",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 7,
              img: true,
              id: "travel_其他景点",
              imgName: "其他景点"
            },
            {
              name: "星级旅行社",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 13,
              img: true,
              id: "travel_星级旅行社",
              imgName: "星级旅行社"
            },
            {
              name: "星级酒店",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 14,
              img: true,
              id: "travel_星级酒店",
              imgName: "星级酒店"
            },
            {
              name: "民宿客栈",
              check: true,
              fun: "addTravel",
              takeParam: true,
              num: 3,
              img: true,
              id: "travel_民宿客栈",
              imgName: "民宿客栈"
            }
          ]
        },
        {
          label: "2020年度鹿城工作先进单位",
          check: true,
          disabled: true,
          show: true,
          children: [
            {
              name: "功勋企业",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "功勋企业家",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "工业50强",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "商贸业50强",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "服务业50强",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "建筑行业突出贡献单位",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "科技工作先进",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "开放型经济工作先进单位",
              check: true,
              img: true,
              imgName: "功勋企业"
            },
            {
              name: "经济发展业绩考评先进单位",
              check: true,
              img: true,
              imgName: "功勋企业"
            }
          ]
        }
      ],
      forceOptions: [],
      search: [],
      moveLeft: "30",
      CommonfromCanvass: false,
      CommonResult: {},
      aeoSearch: false,
      Title: null
    };
  },
  components: {
    commonArcgis,
    leftMultiSelect,
    hoverPanel,
    Rsearch,
    commonSearch,
    AEO,
    TopCompany
  },
  props: {
    // 嵌入canvass模块左侧栏置顶
    fromCanvass: Boolean,
    indexsearch: Object
  },
  watch: {
    fromCanvass: {
      handler(newVal, val) {
        this.CommonfromCanvass = newVal;
      },
      immediate: true
    },
    indexsearch: {
      handler(newVal, Val) {
        if (!newVal.features || newVal == Val) return;
        this.CommonResult = newVal;
      },
      immediate: true
    }
  },
  created() {
    // this.mapTool["vector"]["children"]["largeDataStyle"].check = true;
  },
  mounted() {},
  computed: {},
  methods: {
    hiddenRight() {
      this.icon_show_right = !this.icon_show_right;
    },
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
      if (this.icon_show_left) {
        this.moveLeft = "30";
      } else {
        this.moveLeft = "410";
      }
    },
    signclick() {
      this.icon_show_right = false;
    },
    stateBack() {
      this.icon_show_right = true;
    },
    allclick() {
      this.searchShow = true;
      jjtsApi.ds().then(({ data }) => {
        this.search = data;
      });
    },
    allSearch(evt) {
      this.rSearch = evt.target.value;
    },
    showJJTS(param) {
      jjtsApi
        .ds({
          where: `param like '%${param == "招商项目" ? "招商地块" : param}%'`
        })
        .then(({ data }) => {
          this.search = data;
        });
      this.showTopCompany = false;
      this.rSearchTravel = false;
      this.searchShow = true;
    },
    showTravel(param) {
      travelApi
        .ds({
          where: `type like '%${param}%'`
        })
        .then(({ data }) => {
          this.search = data;
        });
      this.showTopCompany = false;
      this.rSearchTravel = true;
      this.searchShow = true;
    },
    TopCompany(param) {
      this.searchShow = false;
      this.$refs.Estate.TableShow = false;
      this.showTopCompany = true;
      this.Title = param;
    },
    /**
     * 左模块checkbox双向绑定更新后触发
     * 将左边勾选或取消的tab对右边tab集做更新
     */
    changeLeftOption(options) {
      this.leftOptions = options;
      const arr = [];
      options.map(v => {
        v.children.map(item => {
          item.check ? arr.push(item.name) : null;
        });
      });
      // this.forceOptions = ["全部", ...arr];
      // if (!~arr.indexOf(this.forceOne.label)) {
      //   this.forceTheFirstOne();
      // }
    },
    /**
     * 左模块顶部checkbox点击触发
     */
    changeleftcheckBox(items) {
      this.leftformdata = items;
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    ResultNone(val) {
      this.$refs.Estate.TableShow = val;
    },
    JumpecoCompany(val) {
      this.$parent.activeName == val ? "" : (this.$parent.activeName = val);
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./ecoEstate.less");
</style>



