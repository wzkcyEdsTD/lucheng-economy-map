<template>
  <div class="canvass_container">
    <div class="left">
      <div class>
        <div>
          <header>用地招商进度分布</header>
          <div>
            <div class="_left1">
              <section v-for="(item,index) in canvass_land_progress" :key="index">
                <span>{{item.label}}</span>
                <span>{{item.area}}</span>
              </section>
            </div>
            <div class="_right1 chart">
              <canvassEcharts id="cProgessOption" :option="cProgessOption" />
            </div>
          </div>
        </div>
      </div>
      <div class>
        <div id="text">
          <p>
            &nbsp;&nbsp;鹿城区地处浙江省东南部，是温州市的
            <strong>政治、经济、文化中心</strong>。鹿城始建于东晋太宁元年
            <strong>(公元323年)</strong>，相传筑城时有白鹿衔花而过，故名鹿城。
            鹿城自古商贾云集，素有
            <strong>"东欧名镇"</strong>之称，南宋时期诗人杨蟠就有
            <strong>“一片繁华海上头，从来换作小杭州”</strong>的诗句。鹿城依山面江，城中有山有水，享有
            <strong>“江城如画”</strong>
            的美誉
          </p>
        </div>
      </div>
      <div class>
        <div>
          <header>招商用地类型</header>
          <div class="chart">
            <canvassEcharts id="cKindOption" :option="cKindOption" />
          </div>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class>
        <div class="echarts_map">
          <canvassGeoChart @canJump="canJump" />
        </div>
        <div class="echarts_map_legend">
          <i></i>招商项目
        </div>
      </div>
      <div class>
        <div>
          <header>招商项目</header>
          <div class="buildPic">
            <div class="options">
              <div
                v-for="(list,index) in lists"
                :key="index"
                class="option"
                :class="{active: list.isActive}"
                :style="{backgroundImage:list.img,backgroundSize:'cover'}"
                @click="changeImg(index)"
              >
                <!-- <div class="shadow"></div> -->
                <div class="label">
                  <div class="icon">
                    <i class="fas fa-walking"></i>
                  </div>
                  <div class="info">
                    <div class="title">{{ list.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class>
        <div>
          <header>用地招商投资额分布</header>
          <div class="chart">
            <canvassEcharts id="cInvestoption" :option="cInvestoption" />
          </div>
        </div>
      </div>
      <div class>
        <div class>
          <header>招商政策</header>
          <!-- <div class="cy">
            <span>产业优惠政策</span>
            <span>人才保障政策</span>
            <span>行政服务政策</span>
            <span>项目用地政策</span>
            <span>企业帮扶政策</span>
            <span>财税配套政策</span>
            <span>浙江经济政策</span>
            <span>财税配套政策</span>
          </div>-->
          <div class="chart">
            <canvassEcharts id="zszcOption" :option="zszcOption" />
          </div>
        </div>
      </div>
      <div class>
        <div>
          <header>街镇招商情况</header>
          <div class="canvass_street">
            <ul>
              <li v-for="(value,key,index) in kindHash" :key="index">
                <span :class="value" />
                <i>{{key}}</i>
              </li>
            </ul>
            <ul class="street_ul">
              <li v-for="(item,index) in canvass_street_kind" :key="index">
                <p>{{item.street}}</p>
                <div>
                  <span
                    class="canvass_land_span"
                    :style="{width: `${item.land.area/top.land*100*0.6}%`}"
                  ></span>
                  <i>{{item.building.num}} {{item.building.area}}</i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import canvassGeoChart from "./canvassGeo/canvassGeoChart";
import canvassEcharts from "@/components/common/echarts";
import {
  canvassProgessOption,
  canvssInvestoption,
  canvassKindOption,
  zszcOption
} from "./chartOption";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
export default {
  name: "canbusiness",
  data() {
    return {
      // chartOptoin
      cProgessOption: canvassProgessOption,
      cInvestoption: canvssInvestoption,
      cKindOption: canvassKindOption,
      zszcOption: zszcOption,
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      // data
      canvass_land_progress: [
        { label: "正在规划4处", area: "24000亩" },
        { label: "正在拆迁3处", area: "15100亩" },
        { label: "用地已推平", area: "22100亩" },
        { label: "年度已落地", area: "52100亩" }
      ],
      kindHash: {
        招商用地: "canvass_land_span"
        // 招商楼宇: "canvass_building_span",
        // 招商数量: "canvass_num_span"
      },
      //  排名最高的街镇, 条长度基准
      top: {
        building: 900,
        land: 900,
        num: 15
      },
      canvass_street_kind: [
        {
          street: "滨江街道",
          building: { num: "15处", area: "80亩" },
          land: { num: 6, area: 900 },
          num: 15
        },
        {
          street: "五马街道",
          building: { num: 6, area: 800 },
          land: { num: 6, area: 800 },
          num: 15
        },
        {
          street: "丰门街道",
          building: { num: 6, area: 700 },
          land: { num: 6, area: 700 },
          num: 15
        },
        {
          street: "蒲鞋市街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        },
        {
          street: "大南街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        },
        {
          street: "南郊街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        },
        {
          street: "南汇街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        },
        {
          street: "滨江街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        },
        {
          street: "滨江街道",
          building: { num: 6, area: 600 },
          land: { num: 6, area: 600 },
          num: 15
        }
      ],
      lists: [
        {
          title: "鹿城区（南郊）数字经济产业园",
          img: `url(${server}/icon/projectImg/鹿城区（南郊）数字经济产业园.png)`,
          isActive: true
        },
        {
          title: "黄龙商贸城集新未来社区项目",
          img: `url(${server}/icon/projectImg/黄龙商贸城集新未来社区项目.png)`,
          isActive: false
        },
        {
          title: "公园路历史文化商业街",
          img: `url(${server}/icon/projectImg/公园路历史文化商业街.png)`,
          isActive: false
        },
        {
          title: "仁信大厦",
          img: `url(${server}/icon/projectImg/仁信大厦.png)`,
          isActive: false
        },
        {
          title: "汇富大厦",
          img: `url(${server}/icon/projectImg/汇富大厦.png)`,
          isActive: false
        },
        {
          title: "吴桥小微双创集聚区",
          img: `url(${server}/icon/projectImg/吴桥小微双创集聚区.png)`,
          isActive: false
        },
        {
          title: "藤桥下岸工业片区",
          img: `url(${server}/icon/projectImg/藤桥下岸工业片区.png)`,
          isActive: false
        },
        {
          title: "轻工业区外垟地块",
          img: `url(${server}/icon/projectImg/轻工业区外垟地块.png)`,
          isActive: false
        },
        {
          title: "周岙底产业示范区",
          img: `url(${server}/icon/projectImg/周岙底产业示范区.png)`,
          isActive: false
        },
        {
          title: "鹿城鞋艺小镇",
          img: `url(${server}/icon/projectImg/鹿城鞋艺小镇.png)`,
          isActive: false
        },
        {
          title: "温州七度科技文化中心",
          img: `url(${server}/icon/projectImg/温州七度科技文化中心.png)`,
          isActive: false
        }
      ]
    };
  },
  components: { canvassEcharts, canvassGeoChart },
  props: {},
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    changeImg(id) {
      for (var i = 0; i < this.lists.length; i++) {
        this.lists[i].isActive = false;
      }

      this.lists[id].isActive = true;
    },
    canJump(point) {
      this.$emit("canJump", point);
    },
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    }
  }
};
</script>
 <style lang="less">
@import url("./canvassBusiness.less");

.buildPic {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // align-items: center;
}

.label {
  top: 10em;
}

.options {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  min-width: 600px;
  max-width: 900px;
  width: 100%;
  height: 400px;
  /* margin:60px auto; */
}

@media screen and (max-width: 718px) {
  .options {
    min-width: 520px;
  }

  .options .option:nth-child(5) {
    display: none;
  }
}

@media screen and (max-width: 638px) {
  .options {
    min-width: 440px;
  }

  .options .option:nth-child(4) {
    display: none;
  }
}

@media screen and (max-width: 558px) {
  .options {
    min-width: 360px;
  }

  .options .option:nth-child(3) {
    display: none;
  }
}

@media screen and (max-width: 478px) {
  .options {
    min-width: 280px;
  }

  .options .option:nth-child(2) {
    display: none;
  }
}

.options .option {
  position: relative;
  overflow: hidden;
  min-width: 30px;
  margin: 8px;
  // background: var(--optionBackground, var(--defaultBackground, #e6e9ed));
  background-size: cover;
  // background-position: center;
  cursor: pointer;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
}

.options .option.active {
  flex-grow: 10000;
  -webkit-transform: scale(1);
  transform: scale(1);
  max-width: 600px;
  margin: 0px;
  border-radius: 40px;
  background-size: auto 100%;
  /*&:active {
     transform:scale(0.9);
  }*/
}

.options .option.active .shadow {
  box-shadow: inset 0 -120px 120px -120px black,
    inset 0 -120px 120px -100px black;
}

.options .option.active .label {
  bottom: 20px;
  left: 20px;
}

.options .option.active .label .info > div {
  left: 0px;
  opacity: 1;
}

.options .option:not(.active) {
  flex-grow: 1;
  border-radius: 30px;
}

.options .option:not(.active) .shadow {
  bottom: -40px;
  box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
}

.options .option:not(.active) .label {
  bottom: 10px;
  left: 10px;
}

.options .option:not(.active) .label .info > div {
  left: 20px;
  opacity: 0;
}

.options .option .shadow {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 120px;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
}

.options .option .label {
  display: flex;
  position: absolute;
  right: 0px;
  height: 40px;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
}

.options .option .label .icon {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  border-radius: 100%;
  background-color: white;
  color: var(--defaultBackground);
  margin: 0;
}

.options .option .label .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  color: white;
  white-space: pre;
}

.options .option .label .info > div {
  position: relative;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
}

.options .option .label .info .title {
  font-weight: bold;
  font-size: 1.2rem;
}

.options .option .label .info .sub {
  transition-delay: 0.1s;
}
</style>



