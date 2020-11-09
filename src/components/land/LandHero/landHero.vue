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
    <div
      class="landHeroLeft"
      :class="`animated ${icon_show_left ? `slideOutLeft` : `slideInLeft`}  `"
    >
      <div class="landHeroLeft-top">
        <div class="landHeroLeft-top-top">
          <span class="_line" />
          <span class="echartTitle">
            参评企业数量
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <div class="landHeroLeft-top-top-left">
              <echarts id="cp1" ref="cp1" :option="cp1Option" />
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
          <span class="_line" style="margin-bottom: 10px" />
          <span class="echartTitle">
            亩均效益分析
            <span class="stateTipHeaderBar"></span>
          </span>
          <div class="echartBody">
            <echarts id="mjss" :option="mjssOption" />
          </div>
          <span class="_line" style="margin-bottom: 0px" />
        </div>
      </div>
      <span @click="hiddenLeft()" class="hidden_button">
        <!-- <i class="iconfont icon-angle-double-left" v-show="!icon_show_left"></i>
        <i class="iconfont icon-angle-double-right" v-show="icon_show_left"></i>-->
      </span>
    </div>
    <div
      class="right"
      :class="`animated ${
        icon_show_right ? `slideInRight` : `slideOutRight`
      }  `"
    >
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
          <span class="_line" style="margin-bottom: 0px" />
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
  streetRank,
} from "./landHerodata";
import $ from "jquery";
import commonArcgis from "@/components/land/LandArcgis/commonArcgis";
import echarts from "@/components/common/echarts";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import companyRank from "./companyRank";
import qynbApi from "@/api/beans/u_qynb";
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
      rankCompany: {},
    };
  },
  components: { echarts, commonArcgis, hoverPanel, companyRank },
  props: { company: Object },
  created() {
    // this.mapTool["vector"]["children"]["largeDataStyle"].check = true;
  },
  mounted() {
    this.changeEcharts();
  },
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
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    changeEcharts() {
      const that = this;
      qynbApi.pjzb_count().then(({ data }) => {
        this.cp1Option.series[0].data[0] = data[0].sumNum;
        this.cp1Option.series[0].data[1] = data[1].sumNum;
        this.$refs.cp1.changeEcharts("cp1", this.cp1Option);
        qynbApi.pjzb_xyfx().then(({ data }) => {
          this.mjssOption.series[0].data = [];
          data.map((item) => {
            switch (item.kind) {
              case "待提高":
                this.mjssOption.series[0].data[4] = item.jia;
                break;
              case "一般":
                this.mjssOption.series[0].data[3] = item.jia;
                break;
              case "良好":
                this.mjssOption.series[0].data[2] = item.jia;
                break;
              case "优秀":
                this.mjssOption.series[0].data[1] = item.jia;
                break;
              case "极优":
                this.mjssOption.series[0].data[0] = item.jia;
                break;
            }
          });
          this.$refs.cp1.changeEcharts("mjss", this.mjssOption);
          qynbApi.pjzb_sspm({ where: `lx='规上'` }).then(({ data }) => {
            let sortarr = [];
            data.map((item) => {
              sortarr.push({ name: item.ssjd, A: 0, B: 0, C: 0, D: 0 });
            });
            qynbApi.pjzb_hysl({ where: `lx='规上'` }).then(({ data }) => {
              this.hy1Option.series[0].data = [];
              this.hy1Option.xAxis.data = [];
              data.map((item) => {
                this.hy1Option.xAxis.data.push(item.hylx);
                this.hy1Option.series[0].data.push(item.sumNum);
              });
              this.$refs.cp1.changeEcharts("hy1", this.hy1Option);

              qynbApi.pjzb_pjjg({ where: `lx='规上'` }).then(({ data }) => {
                this.jdOption.series[1].data = [];
                this.jdOption.series[2].data = [];
                this.jdOption.series[3].data = [];
                this.jdOption.series[4].data = [];
                this.jdOption.yAxis[0].data = [];

                data.map((item) => {
                  sortarr.map((value) => {
                    if (item.ssjd == value.name) {
                      value[item.dc] = item.sumNum;
                    }
                  });
                });
                sortarr.sort(that.compare("A"));
                for (var i = 0; i < sortarr.length; i++) {
                  this.jdOption.yAxis[0].data.push(sortarr[i].name);
                }

                for (var j = 0; j < this.jdOption.yAxis[0].data.length; j++) {
                  that.jdOption.series[1].data.push(sortarr[j].A);
                  that.jdOption.series[2].data.push(sortarr[j].B);
                  that.jdOption.series[3].data.push(sortarr[j].C);
                  that.jdOption.series[4].data.push(sortarr[j].D);
                }
                this.$refs.cp1.changeEcharts("jd", that.jdOption);
              });
            });
          });
        });
      });
    },
  },
};
</script>
 <style scoped lang="less">
@import url("./landHero.less");

._line {
  margin-bottom: 10px;
}
</style>



