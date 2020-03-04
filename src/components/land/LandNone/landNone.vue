<template>
  <div class="Com_content landNone_container">
    <div class="Com_map">
      <commonArcgis
        id="landMap"
        ref="land"
        :shallMapType="leftformdata.value"
        :leftOptions="leftOptions"
        :mapTool="mapTool"
        :toCenter="toCenter"
        :type="type"
        :landList="landList"
        :ydxzLen="ydxzLen"
        :ydxz="ydxz"
        :commonSearch="commonSearch"
        :isSearch="isSearch"
      />
    </div>
    <div class="Com_container">
      <div class="left" :class="`animated ${!icon_show_left?`slideOutLeft`:`slideInLeft`}  `">
        <div>
          <leftMultiSelect :leftformdata="leftformdata" :leftOptions="leftOptions" />
          <ToggleSwitch @change="change" />
        </div>
        <span @click="hidden2" class="hidden_button"></span>
      </div>
      <div class="right" :class="`animated ${icon_show_right?`slideInRight`:`slideOutRight`}  `">
        <!--  表格特殊化 不做可配置  -->
        <landNoneTable ref="landNoneTables" :forceOne="forceOne" :resultTable="resultTable" />

        <span @click="hidden3(),legend()" class="hidden_right_button">
          <!-- <i class="iconfont icon-angle-double-left" v-show="!icon_show_right"></i>
          <i class="iconfont icon-angle-double-right" v-show="icon_show_right"></i>-->
        </span>
      </div>
    </div>
    <transition name="frame">
      <MatchResult
        v-if="matchShow"
        :matchTable="matchTable"
        @matchListDispaly="matchListDispaly"
        @clickit="resultshow"
      />
    </transition>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import commonArcgis from "@/components/land/LandArcgis/commonArcgis";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
import landNoneTable from "@/components/land/LandNone/landNoneTable";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import ToggleSwitch from "@/components/canvass/CanvassRes/Switch";
import { dkOption, pieChart } from "./LandCharts";
import MatchResult from "@/components/canvass/CanvassRes/MatchResult/MatchResult";
import landNoneForceTabData from "./landNoneForceTabData";
import $ from "jquery";
export default {
  name: "landNone",
  data() {
    return {
      icon_show: true,
      icon_show_left: true,
      icon_show_right: true,
      dkOption: dkOption,
      landList: null,
      type: "画像",
      toCenter: {
        zoom: 13,
        center: [120.67127189591704, 28.00836708826861]
      },
      landChart: [],
      leftformdata: {
        list: [],
        value: null
      },
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      leftOptions: [
        {
          label: "用地信息",
          check: false,
          show: true,
          children: [
            {
              name: "控制性规划",
              id: "allLandRegulatory",
              fun: "addAllLandRegulatory",
              check: false,
              img: false,
              color: "#FF0000"
            },
            {
              name: "可出让地块",
              id: "landAva",
              fun: "addLandAva",
              check: true,
              img: false,
              color: "#00FF00"
            },
            {
              name: "已征待拆地块",
              id: "YZDC",
              fun: "addYZDC",
              check: true,
              img: false,
              color: "#0000FF"
            }
          ]
        }
      ],
      forceOptions: ["全部", "供而未用", "用而未尽"],
      forceOne: landNoneForceTabData["全部"],
      chartsData: [null],
      tag: false,
      isSearch: false,
      ydxzLen: 0,
      ydxz: "",
      commonSearch: {},
      matchShow: false,
      matchTable: [],
      resultTable: []
    };
  },
  components: {
    commonArcgis,
    leftMultiSelect,
    landNoneTable,
    hoverPanel,
    MatchResult,
    ToggleSwitch
  },
  props: { search: Object },
  watch: {
    search: {
      handler(newVal, val) {
        this.commonSearch = newVal;
      },
      immediate: true
    }
  },
  created() {
    this.mapTool["images"]["children"]["image2017"].check = true;
    this.landChart = [
      {
        title: "用而未尽",
        children: [
          this.fixPieChart("项目", [5, 2]),
          this.fixPieChart("亩数", [79.69, 45.58])
        ]
      },
      {
        title: "建而未投",
        children: [
          this.fixPieChart("项目", [3, 1]),
          this.fixPieChart("亩数", [46.42, 15])
        ]
      },
      {
        title: "投而未达",
        children: [
          this.fixPieChart("项目", [49, 32]),
          this.fixPieChart("亩数", [548.64, 454.32])
        ]
      }
    ];
  },
  mounted() {},
  computed: {},
  methods: {
    /**
     * 判断是否有搜索条件
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
    fixPieChart(label, [target, val]) {
      const colorHash = {
        项目: ["rgba(240, 23, 23, 1)", "rgba(255, 139, 139, 1)"],
        亩数: ["rgba(17, 175, 57, 1)", "rgba(121, 206, 95, 1)"]
      };
      const chart = this.$util.clone(pieChart);
      chart.title.text = label;
      chart.series[0].data = [
        {
          value: target - val,
          name: "未整治数",
          itemStyle: { color: colorHash[label][1] }
        },
        {
          value: val,
          name: "整治数",
          itemStyle: { color: colorHash[label][0] }
        }
      ];
      return chart;
    },
    /**
     * 关闭center标签
     */
    hidden() {
      this.icon_show = !this.icon_show;
    },
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
    },
    hidden3() {
      this.icon_show_right = !this.icon_show_right;
    },
    /**
     * 关闭tab页
     * @param tab 点击关闭的tab标志
     */
    closeTab(tab) {
      if (tab == "全部") return;
      const index = this.forceOptions.indexOf(tab);
      this.forceOptions =
        index >= 0
          ? [
              ...this.forceOptions.slice(0, index),
              ...this.forceOptions.slice(index + 1)
            ]
          : this.forceOptions;
      //  若关闭当前tab项(forceOne设置为展示示例用,实际赋值不会这么简单)
      if (tab == this.forceOne.label) {
        this.forceTheFirstOne();
      }
      //  更新leftOptions
      for (let v in this.leftOptions) {
        for (
          let i = 0, len = this.leftOptions[v].children.length;
          i < len;
          i++
        ) {
          if (this.leftOptions[v].children[i].name === tab) {
            this.leftOptions[v].check = false;
            this.leftOptions[v].children[i].check = false;
          }
        }
      }
    },
    /**
     * 选中tab
     * @param label 选中的tab标志
     */
    forceTab(label) {
      this.forceOne = landNoneForceTabData[label] || {
        ...landNoneForceTabData["全部"],
        label
      };
    },
    /**
     * 将第一个tab[全部]设置为选中
     * 当目前选中的tab关闭后 会触发此函数
     */
    forceTheFirstOne() {
      this.forceOne = landNoneForceTabData["全部"];
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
      this.forceOptions = ["全部", ...arr];
      if (!~arr.indexOf(this.forceOne.label)) {
        this.forceTheFirstOne();
      }
    },
    /**
     * 左模块顶部checkbox点击触发
     */
    changeleftcheckBox(item) {
      // console.log(item)
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    legend() {
      if (this.icon_show_right) {
        $("body .esri-ui-bottom-right").css({ right: "416px" });
      } else {
        $("body .esri-ui-bottom-right").css({ right: "0px" });
      }
    },
    matchListDispaly(val) {
      this.$refs.landNoneTables.matchDispaly = val;
    },
    resultshow() {
      this.matchShow = false;
      this.$refs.landNoneTables.matchDispaly = true;
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
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./landNone.less");
</style>



