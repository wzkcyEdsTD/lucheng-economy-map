<template>
  <div class="leftChar">
    <header class="stateTipHeader">
      {{forceChar.name}}
      <!-- <span class="stateTipHeaderBar"></span> -->
      <span v-if="forceChar.name=='南汇街道' && panelType==0" class="stateTipBtn" @click="charDetail">详情</span>
      <span
        v-if="forceChar.name=='南汇街道' && panelType==1"
        class="stateTipBtn"
        @click="()=>{ panelType = 0 }"
      >返回</span>
    </header>
    <div v-if="panelType==0" class="intro">
      <div>
        <img :src="forceChar.url" @click="clickImg(forceChar.url)" />
      </div>
      <div
        class="intro_text"
        v-html="`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${forceChar.intro}`"
      ></div>
    </div>
    <!-- <div class="first">
      <header>规上工业增加值增速</header>
      <ecoecharts id="Chart" :option="gsgyOption"></ecoecharts>
    </div>
    <div class="second">
      <header>限上批零住餐销售(营业)总额(亿元)</header>
      <ecoecharts id="Chart1" :option="xsplzcOption"></ecoecharts>
    </div>
    <div class="third">
      <header>限上消费品零售总额(亿元)</header>
      <ecoecharts id="Chart2" :option="xsxfpOption"></ecoecharts>
    </div>-->
    <leftMultiSelect
      ref="leftMultiSelect"
      v-if="panelType==1"
      :leftOptions="leftOptions"
      :imgUrl="imgUrl"
    />
    <div class="blueBorder">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import ecoecharts from "@/components/common/echarts";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
import { ChartOption, Chart1Option, Chart2Option } from "./chartsOption";
export default {
  name: "leftCompetition",
  data() {
    return {
      gsgyOption: ChartOption,
      xsplzcOption: Chart1Option,
      xsxfpOption: Chart2Option,
      imgUrl: "topicsIcon",
      panelType: 0,
      leftOptions: []
    };
  },
  components: { leftMultiSelect },
  props: { forceChar: Object },
  watch: {
    forceChar: {
      handler(newVal, val) {
        // const gsgyOption = this.$util.clone(ChartOption);
        // const xsplzcOption = this.$util.clone(Chart1Option);
        // const xsxfpOption = this.$util.clone(Chart2Option);
        // newVal.data &&
        //   newVal.data.map(item => {
        //     gsgyOption.series[0].data.push(item.gsgy_rise);
        //     xsplzcOption.series[0].data.push(item.xsplzc);
        //     xsxfpOption.series[0].data.push(item.xsxfp);
        //   });
        // this.gsgyOption = gsgyOption;
        // this.xsplzcOption = xsplzcOption;
        // this.xsxfpOption = xsxfpOption;
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    clickImg(e) {
      this.$parent.ImgUrl = e;
      this.$parent.showImg = true;
    },

    /**
     * 2020.4.1
     * 南汇街道详情
     */
    charDetail() {
      // 暂停轮播
      this.$parent.$refs.lunbo.pause();
      // 定位放大
      this.$parent.$refs.ecoCharArcgis.view.goTo({
        center: [120.6903116838896, 27.991332968822448],
        zoom: 15
      });

      // 面板切换
      this.panelType = 1;

      // 添加列表
      this.leftOptions = [
        {
          label: "特色经济",
          check: true,
          show: true,
          children: [
            {
              name: "重大产业项目",
              id: "featureProject",
              fun: "addFeatureProject",
              check: true,
              img: true,
              num: 2,
              imgName: "重点项目"
            },
            {
              name: "优质楼宇",
              id: "build",
              fun: "addBuild",
              check: true,
              img: true,
              num: 18,
              imgName: "优质楼宇"
            },
            {
              name: "招商项目",
              id: "land",
              fun: "addLand",
              check: true,
              img: true,
              num: 2,
              imgName: "招商项目"
            }
          ]
        },
        {
          label: "鹿城全景",
          check: true,
          show: true,
          children: [
            {
              name: "南汇街道全景",
              id: "lcqj",
              fun: "addQJDT",
              check: true
            }
          ]
        }
      ];
      this.$parent.leftOptions = this.leftOptions;
    },
    /**
     * 左模块checkbox双向绑定更新后触发
     * 将左边勾选或取消的tab对右边tab集做更新
     */
    changeLeftOption(options) {
      this.$parent.leftOptions = options;
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
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.$parent.mapTool = _mapTool;
    }
  }
};
</script>
 <style scoped lang="less">
.leftChar {
  height: 100%;
  padding: 14px 10px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  border-top: 1px solid;
  border-image: linear-gradient(
      270deg,
      rgba(7, 73, 190, 0.6) 0%,
      rgba(89, 199, 252, 1) 51%,
      rgba(7, 73, 190, 0.6) 100%
    )
    1 10;
  .stateTipHeader {
    height: 50px;
    line-height: 40px;
    text-align: left;
    font-size: 20px;
    font-weight: 700;
    color: #4cd7ec;
    text-shadow: 0px 0px 4px rgba(76, 215, 236, 0.3);
    padding-left: 20px;

    .stateTipBtn {
      float: right;
      margin-right: 10px;
      border: 1px solid;
      line-height: 35px;
      padding: 0 12px;
      border-radius: 8px;
      background: #233c6c;
      font-size: 16px;
      cursor: pointer;
    }

    .stateTipHeaderBar:before {
      content: "";
      width: 4px;
      height: 20px;
      background: #15f9fd;
      display: inline-block;
      margin-top: -4px;
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
  .intro {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    img {
      width: 100%;
      border-radius: 4px;
    }
    .intro_text::-webkit-scrollbar {
      display: none;
    }
    .intro_text {
      flex: 1;
      overflow: auto;
      text-align: left;
      color: #cddffc;
      margin: 20px 0px 5px;
      line-height: 1.7;
      // background: rgba(26, 42, 75, 0.7);
    }
  }
  p {
    padding: 15px 0 0 10px;
    float: left;
    font-size: 18px;
  }
  .first,
  .second,
  .third {
    width: 100%;
    height: 33.3%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #dddddd6e;
    > div {
      width: 100%;
      float: left;
    }
    > .commonEchart {
      flex: 1;
    }
  }
  > div:last-child {
    border-bottom: 0px;
  }
  #Chart,
  #Chart1,
  #Chart2 {
    width: 100%;
    height: 100%;
  }
}
</style>



