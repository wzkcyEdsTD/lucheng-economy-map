<template>
  <div class="buildOverview_container">
    <div class="left">
      <div class="build-left-top">
        <span class="_line" />
        <div>
          <header>
            楼宇概述
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro overview">
            <span v-for="(item, index) in glList" :key="index">
              <div class="iconImg">
                <img :src="`${item.img}`" />
              </div>
              <div class="iconText">
                <span>{{ item.title }}</span>
                <span v-html="item.value"></span>
              </div>
            </span>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="build-left-middle">
        <div>
          <header>
            优质楼宇梯队培育
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <charts id="build_ecoOption" :option="ecoOption"></charts>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="build-left-bottom">
        <div>
          <header>
            业态分布
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <div
              id="build_zsOption"
              class="build_zsOption"
              :option="zsOption"
            ></div>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="blueBorder">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    <div class="middle">
      <div class="build-middle-top">
        <buildGeoChart :buildingOption="buildingOption" />
      </div>
      <div class="build-middle-bottom">
        <div class="build_table">
          <table>
            <thead>
              <th>楼宇名称</th>
              <th>楼长</th>
              <th>所属街道</th>
              <th>详细地址</th>
            </thead>
          </table>
          <div class="marquee_box">
            <ul :class="{ marquee_top: animate }">
              <li
                v-for="(item, index) in buildData"
                :key="index"
                :class="index == activeIndex ? 'analyzeListActive' : ''"
              >
                <span>{{ item["name"] || "" }}</span>
                <span>{{ item["xm"] || "" }}</span>
                <span>{{ item["ssjd"] || "" }}</span>
                <span>{{ item["address"] || "" }}</span>
              </li>
            </ul>
          </div>
          <div class="tableBorder">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="build-right-top">
        <span class="_line" />
        <div>
          <header>
            楼宇入驻企业
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <charts id="build_rzOption" :option="rzOption"></charts>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="build-right-middle">
        <div>
          <header>
            楼宇分布
            <span class="stateTipHeaderBar"></span>
          </header>
          <div class="textIntro">
            <charts id="buildNumber" :option="slOption"></charts>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="build-right-bottom">
        <div>
          <header>
            规上服务业入驻数量
            <span class="stateTipHeaderBar" style="width: 85px"></span>
          </header>
          <div class="textIntro">
            <charts id="build_jdOption" :option="jdOption"></charts>
          </div>
        </div>
        <span class="_line" />
      </div>
      <div class="blueBorder">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
import echarts_ from "echarts";
import charts from "@/components/common/echarts";
import buildGeoChart from "./buildGeoChart";
import {
  zsOption,
  ecoOption,
  jdOption,
  rzOption,
  slOption,
} from "./chartOption";
import { WRT_config, OPTION, LYZS } from "@/components/common/Tmap";
import { loadModules } from "esri-loader";
import lyxxApi from "@/api/beans/u_lyxx";
const { server } = WRT_config;
import lcxxApi from "@/api/beans/u_lcxx";

export default {
  name: "canoverview",
  data() {
    return {
      server,
      zsOption,
      ecoOption,
      jdOption,
      rzOption,
      slOption,
      buildingOption: [],
      activeIndex: 0,
      glList: [],
      buildData: [],
      animate: false,
      buildName: {
        南汇街道: { mj: [0], qys: [0], name: "南汇" },
        南郊街道: { mj: [0], qys: [0], name: "南郊" },
        松台街道: { mj: [0], qys: [0], name: "松台" },
        大南街道: { mj: [0], qys: [0], name: "大南" },
        五马街道: { mj: [0], qys: [0], name: "五马" },
        广化街道: { mj: [0], qys: [0], name: "广化" },
        滨江街道: { mj: [0], qys: [0], name: "滨江" },
        双屿街道: { mj: [0], qys: [0], name: "双屿" },
        蒲鞋市街道: { mj: [0], qys: [0], name: "蒲鞋市" },
      },
      geoData: [
        {
          name: "山福镇",
          value: [120.474425531, 28.13113692142286],
        },
        {
          name: "南郊街道",
          value: [120.651791079866, 27.9956151196537],
        },
        {
          name: "南汇街道",
          value: [120.688223689587, 27.9976727766532],
        },
        {
          name: "蒲鞋市街道",
          value: [120.68110600807, 28.013867166328],
        },
        {
          name: "大南街道",
          value: [120.659201469028, 28.011665954327],
        },
        {
          name: "广化街道",
          value: [120.625069812094, 28.0190375135252],
        },
        {
          name: "滨江街道",
          value: [120.709421614242, 28.0191811273661],
        },
        {
          name: "五马街道",
          value: [120.660720933266, 28.0289409441212],
        },
        {
          name: "松台街道",
          value: [120.642766803, 28.0170092361291],
        },
        {
          name: "双屿街道",
          value: [120.598540339967, 28.0249099121868],
        },
        {
          name: "丰门街道",
          value: [120.57675018418, 28.0436598211285],
        },
        {
          name: "仰义街道",
          value: [120.561137415292, 28.0681958098226],
        },
        {
          name: "藤桥镇",
          value: [120.490621867821, 28.088200967577],
        },
        {
          name: "七都街道",
          value: [120.765381895269, 28.0078972456898],
        },
      ],
      asideList: {
        asideLength: 0,
        asideChildren: [],
        rentChildren: [],
        kindHash: {},
      },
    };
  },
  components: { charts, buildGeoChart },
  props: {},
  watch: {},
  created() {
    this.fetchBuildings(() => {
      setInterval(this.showMarquee, 2000);
    });
    this.analyzeBuildings();
    this.fetchLcxx();
    this.fetRzqy();
  },
  mounted() {},
  computed: {},
  methods: {
    analyzeBuildings() {
      let xzsum = 0;
      let rzqy = 0;
      lyxxApi.ds().then(({ data }) => {
        const arr = [0, 0, 0, 0];
        const list = data;
        list.map((item) => {
          arr[0] += 1; //  楼宇商务楼
          arr[1] += parseFloat(item.area); //  面积
          // arr[2] += parseFloat(item.rzrate)
          //   ? parseFloat((item.area / item.rzrate) * (1 - item.rzrate))
          //   : 0; //  闲置面积
          // arr[3] += item.rzqys ? parseInt(item.rzqys) : 0; //  入驻企业数
          // arr[4] += 0; //  税收
          // arr[5] += item.rzrate && item.rzqys ? parseInt(item.rzqys) : 0; //  可计算的入驻企业数
          // arr[6] +=
          //   parseFloat(item.rzrate) && parseInt(item.rzqys)
          //     ? parseInt(item.rzqys / item.rzrate)
          //     : 0; //  可计算的可入驻企业总
        });
        lcxxApi.ds().then(({ data }) => {
          data.map((item) => {
            if (item.status) {
              if (item.status == "2") {
                xzsum += parseFloat(item.jzmj);
              } else if (item.status == "0") {
                rzqy++;
              }
            }
          });
          //闲置面积
          arr[2] = xzsum;
          //入驻单位
          arr[3] = rzqy;

          const style = `style="font-size:13px;font-style:normal;"`;
          this.glList = [
            {
              title: "商务楼宇",
              // value: `${arr[0]} <i ${style}>幢</i>`,
              value: `58 <i ${style}>幢</i>`,
              img: `${server}/icon/buildingImg/lyfx/商务楼宇.png`,
            },
            {
              title: "楼宇总面积",
              value: `${(arr[1] / 10000).toFixed(2)} <i ${style}>万㎡</i>`,
              img: `${server}/icon/buildingImg/lyfx/楼宇面积.png`,
            },
            {
              title: "闲置面积",
              value: `${(arr[2] / 10000).toFixed(2)} <i ${style}>万平方米</i>`,
              img: `${server}/icon/buildingImg/lyfx/闲置面积.png`,
            },
            {
              title: "入驻单位",
              value: `${arr[3]} <i ${style}>家</i>`,
              img: `${server}/icon/buildingImg/lyfx/入驻单位.png`,
            },
            {
              title: "税收总额",
              // value: `${arr[4] || `-`} <i ${style}>万元</i>`,
              value: `20.6 <i ${style}>亿元</i>`,
              img: `${server}/icon/buildingImg/lyfx/税收总额.png`,
            },
            {
              title: "入驻率",
              value: `${((1 - arr[2] / arr[1]) * 100).toFixed(
                2
              )} <i ${style}>%</i>`,
              img: `${server}/icon/buildingImg/lyfx/入驻率.png`,
            },
          ];
        });
      });
    },
    showMarquee() {
      this.animate = true;
      this.activeIndex = 1;
      setTimeout(() => {
        const buildData = this.$util.clone(this.buildData);
        buildData.push(this.buildData[0]);
        buildData.shift();
        this.buildData = buildData;
        this.animate = false;
        this.updateChart(buildData);
        this.activeIndex = 0;
      }, 500);
    },
    updateChart(buildData) {
      const buildingOption = [];
      const builds = buildData.slice(1).map((item) => {
        return { name: item.name, value: [item.POINT_X, item.POINT_Y] };
      });
      const optionbase = {
        type: "effectScatter",
        coordinateSystem: "geo",
        showEffectOn: "render",
        symbolSize: 7,
        zlevel: 3,
        rippleEffect: { period: 10, scale: 4, brushType: "fill" },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: "rgba(255, 235, 59, .7)",
            shadowColor: "#333",
          },
        },
      };
      buildingOption[0] = {
        ...optionbase,
        data: builds,
      };
      buildingOption[1] = {
        ...optionbase,
        zlevel: 4,
        rippleEffect: { period: 15, scale: 6, brushType: "fill" },
        itemStyle: {
          normal: {
            color: "rgb(	220,20,60)",
            shadowColor: "#333",
          },
        },
        data: buildData.slice(0, 1).map((item) => {
          return { name: item.name, value: [item.POINT_X, item.POINT_Y] };
        }),
      };
      buildingOption[2] = {
        type: "effectScatter",
        coordinateSystem: "geo",
        symbolSize: 7,
        zlevel: 10,
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              return params.name.replace("街道", "");
            },
            position: "bottom",
            color: "#E3F0FF",
            fontSize: 16,
            fontWidth: "bold",
          },
          emphasis: {
            show: true,
          },
        },
        itemStyle: {
          color: "transparent",
          shadowBlur: 5,
          shadowColor: "#fff",
        },
        data: this.geoData,
      };
      this.buildingOption = buildingOption;
    },
    fetchBuildings(fn) {
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: LYZS + "/5",
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `1=1`;
        query.returnGeometry = true;
        queryTask.execute(query).then((response) => {
          const { features } = response;

          const _build = [];
          features.map((item) => {
            if (item.geometry) {
              _build.push({
                ...item["attributes"],
                POINT_X: item["geometry"].x,
                POINT_Y: item["geometry"].y,
              });
            }
          });
          that.buildData = _build;
          this.updateChart(_build);
          fn && fn();
        });
      });
    },
    fetchLcxx() {
      const kindHash = {};
      const asideList = {
        asideLength: 0,
        asideChildren: [],
        rentChildren: [],
        kindHash: {},
      };
      let sum = 0;
      lcxxApi.ds().then(({ data }) => {
        data.map((item) => {
          if (item.status) {
            if (item.status == "2") {
              asideList.asideChildren.push(item);
              asideList.asideLength++;
            } else {
              asideList.rentChildren.push(item);
            }
          }
          if (item.status != "2" && item.hy) {
            if (!kindHash[item.hy]) {
              kindHash[item.hy] = 0;
            }
            sum++;
            kindHash[item.hy]++;
          }
        });
        asideList.kindHash = kindHash;
        this.asideList = asideList;
        this.$nextTick(() => {
          if (Object.keys(asideList.kindHash).length) {
            this.doChart(sum);
          }
        });
      });
    },
    fetRzqy() {
      lcxxApi.rzqy().then(({ data }) => {
        data.map((item) => {
          if (item.rzqy || item.rzqy != "要卖" || item.rzqy != "要转租") {
            item.ssjd && this.buildName[item.ssjd].qys++;
          }
        });
        this.$nextTick(() => {
          this.GSrzqyChart(this.buildName);
        });
      });
    },
    doChart(sum) {
      const chart = echarts_.init(document.getElementById("build_zsOption"));
      const option = this.$util.clone(zsOption);
      const chartData = [];
      const chartLegend = [];
      for (let v in this.asideList.kindHash) {
        chartLegend.push(v);
        chartData.push({
          name: v,
          value: ((this.asideList.kindHash[v] / sum) * 100).toFixed(2),
        });
      }
      //option.legend.data = chartLegend;
      option.series[0].data = chartData;
      chart.setOption(option);
    },
    GSrzqyChart(qys) {
      const chart = echarts_.init(document.getElementById("build_jdOption"));
      const option = this.$util.clone(jdOption);
      const chartData = [];
      const chartxAxis = [];
      const gsryqy = [27, 0, 5, 5, 10, 0, 0];
      for (let v in qys) {
        chartxAxis.push(v);
        chartData.push(qys[v].qys);
      }
      option.xAxis[0].data = chartxAxis;
      option.series[0].data = chartData;
      option.series[1].data = gsryqy;
      chart.setOption(option);
    },
  },
};
</script>
 <style scoped lang="less">
@import url("./buildAnalyze.less");
</style>