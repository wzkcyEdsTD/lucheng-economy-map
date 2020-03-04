<template>
<div class="EcoFrame" :style="{left:Left +'px'}">
  <span class="_line" />
  <div class="frame">
    <div class="title">
      <div class="tit_company">
        {{this.$props.company ? this.name : ''}}
        <i
          class="iconfont iconRectangleCopy"
          @click="close()"
          style="color:#fff;cursor: pointer;"
        ></i>
      </div>
      <div class="info">
        <div class="info_content">
          <div class="base_info">
            <head>基础信息</head>
            <div class="info_xq">
              <div class="xq_text">
                <ul>
                  <li v-for="(item,index) in info" :key="index">
                    <span>{{item.name}}</span>
                    <span>{{item.value}}</span>
                  </li>
                </ul>
              </div>
              <img
                :src="`${server}/icon/tsjjImg/${this.name}.png`"
                @load="showisImg()"
                @error="errorImg()"
                @click="clickImg($event)"
                v-show="isImg"
              />
            </div>
          </div>
          <div class="jyfw">
            <head>经营范围</head>
            <p>{{this.jyfw}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="list" v-if="!fromCanvass && rquota">
      <ul class="xxtitle">
        <li
          v-for="(item,index) in list"
          :key="index"
          v-on:mouseenter="show(index)"
          @mouseleave="onMouleave"
        >
          {{item}}
          <table class="xxcentent" v-if="isShow == index && seen">
            <thead>
              <tr>
                <td v-for="(item,index) in test[list[isShow]].h" :key="index">{{item}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in test[list[isShow]].d" :key="index">
                <td v-for="(_item,_index) in item" :key="_index">{{_item}}</td>
              </tr>
            </tbody>
          </table>
        </li>
      </ul>
    </div>
  </div>
  <span class="_line" />
  <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="`${server}/icon/tsjjImg/${this.name}.png`" />
</div>
</template>

<script>
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
import bigImg from "./bigImg";
export default {
  name: "Ecoframe",
  data() {
    return {
      list: ["企业信用", "评价指标", "经济指标", "用地信息"],
      info: [],
      test: { 企业信用: {}, 评价指标: {}, 经济指标: {}, 用地信息: {} },
      isShow: 0,
      seen: false,
      imgURL: `${server}/icon/commonIcon/noImg.png`,
      server,
      name: null,
      jyfw: null,
      data: null,
      showImg: false,
      imgShow: true,
      changeLeft: "30",
      isImg: true,
      rquota: false
    };
  },
  components: { bigImg },
  props: {
    fromCanvass: Boolean,
    company: {
      type: Array,
      default: function() {
        return [];
      }
    },
    Left: String
  },
  created() {
    this.rquota = this.$window.user.rquota;
  },
  mounted() {},
  computed: {},
  watch: {
    company: {
      handler(newVal, val) {
        if (!newVal) return;
        this.info = [
          {
            name: "企业全称：",
            value: newVal[0].name
          },
          {
            name: "信用代码：",
            value: newVal[0].uuid
          },
          {
            name: "企业法人：",
            value: newVal[0].fddbr
          },
          {
            name: "创立时间：",
            value: newVal[0].startdate.substring(0, 10)
          },
          {
            name: "所属行业：",
            value: newVal[0].hydm
          },
          {
            name: "企业地址：",
            value: newVal[0].address
          }
        ];
        this.name = newVal[0].name;
        this.jyfw = newVal[0].yjfw;
        const profit = newVal[2];
        const rent = newVal[3];
        this.test = {
          企业信用: {
            h: ["企业类别", "不良信息", "守信信息", "其他信息", "黑名单信息"],
            d: [
              [
                newVal[0].qylb,
                newVal[0].blxx,
                newVal[0].sxxx,
                newVal[0].qtxx,
                newVal[0].hmd
              ]
            ]
          },
          评价指标: {
            h: ["亩均税收（万元/亩）", "评价结果"],
            d: [[newVal[1].mjss || "-", newVal[1].dc || "-"]]
          },
          经济指标: {
            h: [
              "年报年度",
              "净利润",
              "负债总额",
              "利润总额",
              "纳税总额",
              "营业状况",
              "销售收入",
              "主营收入",
              "资产总额"
            ],
            d: profit.map(item => {
              return [
                item.nbnd || "-",
                item.jly ? parseFloat(item.jly).toFixed(2) : "-",
                item.fzze ? parseFloat(item.fzze).toFixed(2) : "-",
                item.lrze ? parseFloat(item.lrze).toFixed(2) : "-",
                item.nsre ? parseFloat(item.nsre).toFixed(2) : "-",
                item.yyzk || "-",
                item.xssr ? parseFloat(item.xssr).toFixed(2) : "-",
                item.zyywsr ? parseFloat(item.zyywsr).toFixed(2) : "-",
                item.zcze ? parseFloat(item.zcze).toFixed(2) : "-"
              ];
            })
          },
          用地信息: {
            h: ["企业", "面积"],
            d: rent.map(item => {
              return [
                item.czqy || "-",
                item.zydarear ? parseFloat(item.zydarear).toFixed(2) : "-"
              ];
            })
          }
        };
      }
    },
    Left: {
      handler(newVal, val) {
        this.changeLeft = newVal;
      }
    }
  },
  methods: {
    show(index) {
      this.isShow = index;
      this.seen = this.test[this.list[index]] ? true : false;
    },
    onMouleave: function() {
      this.seen = false;
    },
    close() {
      this.$emit("close");
    },
    errorImg() {
      this.isImg = false;
    },
    clickImg(e) {
      this.showImg = true; // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    },
    showisImg() {
      this.isImg = true;
    }
  }
};
</script>
 <style lang="less">
</style>



