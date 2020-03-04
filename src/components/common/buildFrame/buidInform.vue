<template>
  <div class="buildForm">
    <checklist
      ref="checklist"
      :forceBuilding="forceBuilding"
      :originData="originData"
      @moveMap="moveMap"
    />
    <transition name="frame">
      <div class="buildInform" v-show="BuildDetail">
        <div class="middle">
          <div>
            <p class="smalltitle">
              楼宇画像
              <span class="stateTipHeaderBar"></span>
              <button class="backbutton" @click="reback">返回</button>
            </p>
            <div class="middle_wrap">
              <div class="info_content">
                <div class="xq_text">
                  <img :src="imgURL" />
                  <ul>
                    <li>{{forceBuilding.name}}</li>
                    <li v-for="(item,index) in info" :key="index">
                      <span class="xq_span">{{item.name}}</span>
                      <span>{{item.value}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chart" v-if="Object.keys(asideList.kindHash).length">
          <div>
            <p class="smalltitle">
              业态分布
              <span class="stateTipHeaderBar"></span>
            </p>
            <div id="_chart" class="_chart"></div>
          </div>
        </div>
        <div class="top">
          <div>
            <p class="smalltitle">
              {{toptitle}}
              <span class="stateTipHeaderBar"></span>
              <button class="backbutton" @click="showMore(true)" v-if="isAroundBtn">楼层情况</button>
              <button class="backbutton" @click="showCheckList" v-if="isAroundBtn">分层展示</button>
            </p>
            <div class="zsInfo">
              <table>
                <tbody>
                  <tr v-for="(item,index) in eco_tab" :key="index">
                    <td>{{item.title1}}</td>
                    <td>{{item.value1}}</td>
                    <td>{{item.title2}}</td>
                    <td>{{item.value2}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div>
            <p class="smalltitle">
              楼宇周边配套设施分析
              <span class="stateTipHeaderBar"></span>
              <button class="showAroundBtn" @click="showAround" v-if="isAroundBtn">周边分析</button>
            </p>
            <div class="buildAroundTip">
              <ul>
                <li
                  v-for="(item,key,index) in aroundInfo"
                  :key="index"
                  @click="changeTypeAround(key)"
                >
                  <span>
                    <img :src="`${server}/icon/aroundIcon/v5/${aroundHash[key]}.png`" />
                  </span>
                  <span>{{aroundHash[key]}}:</span>
                  <span>{{item}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="frame">
      <div class="more" v-if="isMore">
        <div class="moreBackground">
          <i class="iconfont iconRectangleCopy" @click="showMore(false)"></i>
          <button class="goCheckBtn" @click="showCheckList" v-if="isAroundBtn">分层展示</button>
          <div>
            <header>闲置状况信息</header>
            <div class="aside">
              <div class="thead">
                <span>所在楼层</span>
                <span>房间号</span>
                <span>闲置面积</span>
                <span>每平方米月租金</span>
                <span>每平方米物业费</span>
              </div>
              <div class="tbody">
                <div v-for="(item,index) in asideList.asideFliter" :key="index">
                  <span>{{item.szlc}} 楼</span>
                  <span>{{item.fjh || `-`}}</span>
                  <span>{{item.jzmj || `-`}} m²</span>
                  <span>{{item.mpfmzj || `-`}} 元</span>
                  <span>{{item.mpfmwy || `-`}} 元</span>
                </div>
                <div class="noRecord" v-if="!asideList.asideChildren.length">- 无闲置信息 -</div>
              </div>
            </div>
          </div>
          <div>
            <header>已入驻企业信息</header>
            <div class="rent">
              <div class="thead">
                <span>所在楼层</span>
                <span>房间号</span>
                <span>商住面积</span>
                <span>每平米月租金</span>
                <span>每平米物业费</span>
                <span>出租/自用</span>
                <span>联系电话</span>
                <span>企业名称</span>
              </div>
              <div class="tbody">
                <div v-for="(item,index) in asideList.rentChildren" :key="index">
                  <span>{{item.szlc}} 楼</span>
                  <span>{{item.fjh || `-`}}</span>
                  <span>{{item.jzmj || `-`}} m²</span>
                  <span>{{item.mpfmzj || `-`}} 元</span>
                  <span>{{item.mpfmwy || `-`}} 元</span>
                  <span>{{item.status == '0' ? '出租' : '自用'}}</span>
                  <span>{{item.lxdh1 || `-`}}</span>
                  <span>{{item.rzqy || `-`}}</span>
                </div>
                <div class="noRecord" v-if="!asideList.rentChildren.length">- 无入驻信息 -</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="frame">
      <div class="buildAround" v-if="isAround">
        <div>
          <div class="aroundTitle">
            <div class="atitle">周边分析</div>
            <i class="iconfont iconRectangleCopy" @click="closeAround"></i>
          </div>
          <div class="aroundSearch">
            <div>
              <span>缓冲半径:</span>
              <div class="select" @change="emitAround">
                <select v-model="radiusAround.key">
                  <option
                    v-for="(item,index) in radiusAround.arr"
                    :key="index"
                    :value="item"
                  >{{item}}米</option>
                </select>
              </div>
            </div>
            <span></span>
            <div>
              <span>周边类型:</span>
              <div class="select">
                <select v-model="typeAround.key" @change="emitAround">
                  <option
                    v-for="(item,index) in typeAround.arr"
                    :key="index"
                    :value="item"
                  >{{aroundHash[item] || `全部`}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import checklist from "./checkList.vue";
import echarts from "echarts";
import lyzbApi from "@/api/beans/u_lyzb";
import lcxxApi from "@/api/beans/u_lcxx";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
import { buildCharOption } from "./buildInformChart";
const aroundHash = {
  sport: "娱乐健身",
  store: "便利店",
  food: "餐饮",
  hotel: "宾馆酒店",
  stop: "公交站",
  parkcar: "停车场",
  bank: "银行",
  mall: "购物百货",
  community: "房产小区",
  building: "大楼大厦",
  hospital: "医院",
  school: "学校",
  gas: "加油站",
  park: "公园广场"
};
export default {
  name: "checkTypeBox",
  data() {
    return {
      server,
      aroundHash,
      imgURL: null,
      info: [],
      aroundInfo: [],
      // moreimgURL: require(`@/components/common/image/buildingInfo.png`),
      BuildDetail: true,
      toptitle: "楼宇经济分析",
      buildName: null,
      isMore: false,
      isAround: false,
      originData: [],
      asideList: {
        asideLength: 0,
        asideChildren: [],
        rentChildren: [],
        kindHash: {}
      },
      aroundList: [],
      radiusAround: { arr: [300, 500, 1000], key: 500 },
      typeAround: {
        arr: [
          "",
          "sport",
          "store",
          "food",
          "hotel",
          "stop",
          "parkcar",
          "bank",
          "mall",
          "community",
          "building",
          "hospital",
          "school",
          "gas",
          "park"
        ],
        key: ""
      },
      eco_tab: []
    };
  },
  components: { checklist },
  props: [
    "searchbox_display",
    "buidinform_dispaly",
    "forceBuilding",
    "showAsideList",
    "isAroundBtn",
    "_asideList",
    "checklistShow"
  ],
  watch: {
    forceBuilding: {
      deep: true,
      handler(newVal, val) {
        this.imgURL = `${server}/icon/buildingImg/${newVal.name}.png`;

        this.info = [
          {
            name: "属地街道：",
            value: newVal.ssjd
          },
          {
            name: "联系人:",
            value: `${newVal.xm.substring(0, 1)}**` || "-"
          },
          {
            name: "联系电话:",
            value: newVal.lxfs || "-"
          },
          {
            name: "楼宇地址：",
            value: newVal.address
          },
          {
            name: "物业公司名称：",
            value: newVal.wygs
          }
        ];
        this.eco_tab = [
          {
            title1: "总面积",
            value1: (newVal._mj ?(newVal._mj / 10000).toFixed(2):"-" )+ " 万m²",
            title2: "员工数",
            value2: newVal.ygs || "-"
          },
          {
            title1: "租金",
            value1: (newVal.rent || "-") + " 元/m²",
            title2: "物业费",
            value2: (newVal.wyrent || "-") + " 元/m²"
          },
          {
            title1: "入驻企业数",
            value1: newVal._rzqy || "-",
            title2: "入驻率",
            value2: (newVal._rzl?((1 - newVal._rzl) * 100).toFixed(2) :"-")+ " %"
          }
        ];
        this.fetchLcxx();
        this.fetchAround();
      }
    },
    checklistShow: {
      handler(newVal, val) {
        this.$refs.checklist.Frameshow = newVal;
      }
    }
  },
  created() {
    this.showMore(this.showAsideList);
  },
  mounted() {
    this.fetchAround();
  },
  computed: {},
  methods: {
    fetchLcxx() {
      const { gdid } = this.forceBuilding;
      const asideList = {
        gdid,
        asideLength: 0,
        asideChildren: [],
        asideFliter: [],
        rentChildren: [],
        kindHash: {}
      };
      const kindHash = {};
      let sum = 0;
      lcxxApi.ds({ where: `gdid = '${gdid}'` }).then(({ data }) => {
        this.originData = data;
        data.map(item => {
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
        //  如果外部有闲置搜索的结果，则在内部列表展示符合要求的闲置结果
        asideList.asideFliter =
          this._asideList.asideChildren && this._asideList.asideChildren.length
            ? [...this._asideList.asideChildren]
            : [...asideList.asideChildren];
        this.asideList = asideList;
        this.$nextTick(() => {
          if (Object.keys(asideList.kindHash).length) {
            this.doChart(sum);
          }
        });
      });
    },
    doChart(sum) {
      const chart = echarts.init(document.getElementById("_chart"));
      const option = this.$util.clone(buildCharOption);
      const chartData = [];
      const chartLegend = [];
      for (let v in this.asideList.kindHash) {
        chartLegend.push(v);
        chartData.push({
          name: v,
          value: ((this.asideList.kindHash[v] / sum) * 100).toFixed(2)
        });
      }
      //option.legend.data = chartLegend;
      option.series[0].data = chartData;
      chart.setOption(option);
    },
    showCheckList() {
      this.isMore = false;
      this.$refs.checklist.showCheckList();
      this.$parent.fcClick = true;
      this.changeMapLoc(true);
    },
    closeAround() {
      this.isAround = false;
      this.$emit("closeAround");
    },
    showAround() {
      this.isAround = true;
      this.emitAround();
    },
    reback() {
      this.$parent.searchbox_display = true;
      this.$parent.buidinform_dispaly = false;
      //  关闭周边
      this.isAround = false;
      this.$emit("closeAround");
    },
    showMore(TAG) {
      this.isMore = TAG;
      this.changeMapLoc(false);
    },
    changeTypeAround(key) {
      if (!this.isAroundBtn) return;
      this.typeAround.key = key;
      this.isAround = true;
      this.$nextTick(() => {
        this.emitAround();
      });
    },
    emitAround() {
      this.$emit("showAround", {
        radius: this.radiusAround.key,
        type: this.typeAround.key
      });
      this.fetchAround();
    },
    fetchAround() {
      lyzbApi
        .ds({ where: `buildid='${this.forceBuilding.gdid}'` })
        .then(({ data }) => {
          const obj = data.filter(item => {
            return item.radius == this.radiusAround.key;
          });
          const aroundInfo = obj.length ? obj[0] : data[0];
          delete aroundInfo.radius;
          this.aroundInfo = aroundInfo;
        });
    },
    fetchCompany(uuid) {
      this.$parent.fetchCompany(uuid);
    },
    moveMap() {
      this.$parent.fcClick = false;
    },
    changeMapLoc(isOffset) {
      this.$parent.changeMapLoc(isOffset);
    }
  }
};
</script>

<style scoped lang="less">
@import url("./buildInform.less");
</style>