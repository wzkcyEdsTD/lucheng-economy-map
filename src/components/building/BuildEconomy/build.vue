<template>
  <div class="build_container">
    <div class="middle">
      <mapArcgis
        id="buildEco_map"
        :flag="true"
        mapsceneShow="_2d"
        :leftOptions="leftOptions"
        :mapTool="mapTool"
        :type="type"
      />
    </div>
    <div class="Com_container">
      <div class="left animated slideInLeft">
        <div :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`}`">
          <leftMultiSelect :leftOptions="leftOptions" :imgUrl="imgUrl" />
          <span @click="hidden2()" class="hidden_button"></span>
        </div>
      </div>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import mapArcgis from "../BuildCommon/buildMap";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import leftMultiSelect from "./leftMenu";
import { WRT_config } from "@/components/common/Tmap";
export default {
  name: "buildEco",
  data() {
    return {
      view: null,
      map: null,
      legend: null,
      icon_show_left: false,
      mapTool: this.$util.clone(hoverPanelConfig),
      imgUrl: "commonIcon",
      type: "ly",
      leftOptions: [
        {
          label: "五个一批",
          check: true,
          show: true,
          children: [
            {
              name: "规划一批",
              id: "ghyp",
              fun: "addghyp",
              check: true,
              img: true,
              num: "6幢"
            },
            {
              name: "建设一批",
              id: "ysyp",
              fun: "addysyp",
              check: true,
              img: true,
              num: "5幢"
            },
            {
              name: "招商一批",
              id: "zsyp",
              fun: "addzsyp",
              check: true,
              img: true,
              num: "10幢"
            },
            {
              name: "集聚一批",
              id: "jqyp",
              fun: "addjqyp",
              check: true,
              img: true,
              num: "5幢"
            },
            {
              name: "培育一批",
              id: "pyyp",
              fun: "addpyyp",
              check: true,
              img: true,
              num: "34幢"
            },
            {
              name: "亿元以上",
              id: "million",
              fun: "addmillion",
              check: false,
              img: true,
              num: "6幢",
              pad: 25
            },
            {
              name: "8千万-亿元",
              id: "eight",
              fun: "addeight",
              check: false,
              img: true,
              num: "8幢",
              pad: 25
            },
            {
              name: "5千万-8千万",
              id: "five",
              fun: "addfive",
              check: false,
              img: true,
              num: "4幢",
              pad: 25
            },
            {
              name: "2千万-5千万",
              id: "tow",
              fun: "addtwo",
              check: false,
              img: true,
              num: "16幢",
              pad: 25
            }
          ]
        }
      ]
    };
  },
  components: {
    mapArcgis,
    hoverPanel,
    leftMultiSelect
  },
  props: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    changName(name) {
      this.$parent.activeName = name;
    },
    JumpPic(item) {
      this.$parent.item = item;
    },
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
    },
    changeLeftOption(options) {
      this.leftOptions = options;
    }
  }
};
</script>
 <style scoped lang="less">
@import url("build.less");
.hidden_button {
  position: relative;
  top: -57%;
  left: 102%;
  height: 106px;
  width: 17px;
  background-image: url(../../common/image/slip.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  line-height: 20px;
  transform: translate(-50%, -10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  background-color: unset;
  border: unset;
}
</style>



