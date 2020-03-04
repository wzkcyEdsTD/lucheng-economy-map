<template>
  <div class="landhero Com_content">
    <div class="Com_map">
      <commonArcgis
        id="landHeroMap"
        :mapTool="mapTool"
        :_forceCompany="company"
        :Left="Left"
        :rankCompany="rankCompany"
      />
    </div>
    <div class="landHeroLeft" :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`}  `">
      <div class="landHeroLeft-top">
        <div class="landHeroLeft-top-top">
          <span class="_line" />
          <span class="echartTitle">
            参评企业数量
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <div class="landHeroLeft-top-top-left">
              <echarts id="cp1" :option="cp1Option" />
            </div>
          </div>
          <span class="_line" />
        </div>
        <div class="landHeroLeft-top-bottom">
          <!-- <span class="_line" /> -->
          <span class="echartTitle">
            评价结果类型
            <span class="stateTipHeaderBar"></span>
            <span class="showMore" @click="showRank()">查看详情</span>
          </span>
          <div class="echartBody">
            <div class="landHeroLeft-top-bottom-left"></div>
          </div>
          <!-- <span class="_line" /> -->
        </div>
        <div class="landHeroLeft-bottom">
          <span class="_line"  style="margin-bottom: 10px;"/>
          <span class="echartTitle">
            亩均效益分析
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <echarts id="mjss" :option="mjssOption" />
          </div>
          <span class="_line" style="margin-bottom: 0px;" />
        </div>
      </div>
      <span @click="hiddenLeft()" class="hidden_button">
        <!-- <i class="iconfont icon-angle-double-left" v-show="!icon_show_left"></i>
        <i class="iconfont icon-angle-double-right" v-show="icon_show_left"></i>-->
      </span>
    </div>
    <div class="right" :class="`animated ${icon_show_right?`slideInRight`:`slideOutRight`}  `">
      <div class="right-top">
        <div class="right-top-left">
          <span class="_line" />
          <span class="echartTitle">
            街镇亩均税收排名
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <echarts id="streetRank" :option="streetRank" />
          </div>
          <!-- <span class="_line" /> -->
        </div>
      </div>
      <div class="right-middle">
        <div class="right-top-left">
          <span class="_line" />
          <span class="echartTitle">
            规上企业行业数量
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <echarts id="hy1" :option="hy1Option" />
          </div>
          <!-- <span class="_line" /> -->
        </div>
      </div>
      <div class="right-bottom">
        <div class="right-top-left">
          <span class="_line" />
          <span class="echartTitle">
            规上企业评价结果
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <echarts id="jd" :option="jdOption" />
          </div>
          <span class="_line" style="margin-bottom: 0px;" />
        </div>
      </div>
      <span @click="hiddenRight" class="hidden_right_button"></span>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
    <companyRank v-if="companyShow" />
  </div>
</template>

<script>
import {
  cp1Option,
  mjssOption,
  hy1Option,
  jdOption,
  streetRank
} from "./landHerodata";
import $ from "jquery";
import commonArcgis from "@/components/land/LandArcgis/commonArcgis";
import echarts from "@/components/common/echarts";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import companyRank from "./companyRank";
export default {
  name: "landhero",
  data() {
    return {
      cp1Option,
      mjssOption,
      hy1Option,
      jdOption,
      streetRank,
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      icon_show_left: false,
      icon_show_right: true,
      Left: "30",
      companyShow: false,
      rankCompany: {}
    };
  },
  components: { echarts, commonArcgis, hoverPanel, companyRank },
  props: { company: Object },
  created() {
    // this.mapTool["vector"]["children"]["largeDataStyle"].check = true;
  },
  mounted() {},
  computed: {},
  methods: {
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    hiddenLeft() {
      this.icon_show_left = !this.icon_show_left;
      // $(".esri-ui .esri-ui-bottom-left")[0].style.left = this.icon_show_left
      //   ? "10px"
      //   : "350px";
        this.Left = !this.icon_show_left ? "410" : "30";
    },
    hiddenRight() {
      this.icon_show_right = !this.icon_show_right;
      
    },
    showRank() {
      this.companyShow = true;
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./landHero.less");

._line {
  margin-bottom: 10px;
}
</style>



