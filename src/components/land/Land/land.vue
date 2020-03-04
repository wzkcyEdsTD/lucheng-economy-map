<template>
  <div class="landForm_container">
    <div class="container_left">
      <div class="container_border">
        <div class="acreages">
          <span>>>用地总体情况</span>
          <div id="acreages">
            <span>总用地：3000亩</span>
            <div class="ages_table">
              <ul>
                <li v-for="(item,index) in ydlist" :key="index">
                  <span>{{item.name}}</span>
                  <span>{{item.value}}</span>
                  <span>{{item.ms}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="acr_spance">
          <span>>>拓空间强保障整治提升</span>
          <div id="acr_spance">
            <ul>
              <li v-for="(item,tindex) in tkjlist" :key="tindex">
                <span>{{item.title}}</span>
                <div class="jdt">
                  <div
                    class="skills html"
                    :style="{width:`${(item.value>100?100:item.value)}%`}"
                  >{{item.value}}%</div>
                </div>
                <span>{{item.text}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="acr_general">
          <span>>>亩均效益分析</span>
          <div id="acr_general">
            <landEcharts id="company" :option="companyOption"></landEcharts>
          </div>
        </div>
        <div class="arc_company">
          <span>>>用地整治达标情况</span>
          <div id="arc_company">
            <landEcharts id="loan" :option="loanOption"></landEcharts>
            <div>
              <span>全区本年度整治要求</span>
              <span>
                低效工业项目整治面积
                <span class="color_1">500亩</span>
              </span>
              <span>
                现已完成
                <span class="color_2">58%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container_middle">
      <div class="container_middle_top">
        <div class="land_map">
          <landGeo />
        </div>
        <div class="land_map_legend">
          <i></i> 用地面积(亩)
        </div>
      </div>
      <div class="container_middle_bottom">
        <div class="land_loan">
          <span>>>五未用地总述</span>
          <div id="land_loan">
            <landEcharts id="general" :option="generalOption"></landEcharts>
          </div>
        </div>
        <div class="land_type">
          <span>>>用地性质分布</span>
          <div id="land_type">
            <landEcharts id="type" :option="typeOption"></landEcharts>
          </div>
        </div>
      </div>
    </div>
    <div class="container_right">
      <div class="container_border">
        <div class="land_street">
          <span>>>各街镇用地情况</span>
          <div id="land_street">
            <landEcharts id="street" :option="streetOption"></landEcharts>
          </div>
        </div>
        <div class="land_income">
          <span>>>行业分布类型</span>
          <div id="land_income">
            <landEcharts id="income" :option="incomeOption"></landEcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import landEcharts from "@/components/common/echarts";
import echarts from "echarts";
import landGeo from "./landGeo3DChart";
import {
  acrgeneralOption,
  arccompanyOption,
  loanOption,
  typeOption,
  streetOption,
  incomeOption
} from "./landEchart";

export default {
  name: "land",
  data() {
    return {
      ydlist: [
        {
          name: "低效用地",
          value: "90处",
          ms: "111亩"
        },
        {
          name: "工业用地",
          value: "",
          ms: "2000亩"
        },
        {
          name: "司法拍卖",
          value: "10处",
          ms: "200亩"
        },
        {
          name: "低效企业",
          value: "",
          ms: "100家"
        }
      ],
      tkjlist: [
        {
          title: "工业用地",
          value: 43.8,
          text: "219/500亩"
        },
        {
          title: "低效项目",
          value: 70.3,
          text: "422/600亩"
        },
        {
          title: "厂房盘活",
          value: 177.6,
          text: "127857㎡"
        }
      ],
      generalOption: acrgeneralOption,
      companyOption: arccompanyOption,
      loanOption: loanOption,
      typeOption: typeOption,
      streetOption: streetOption,
      incomeOption: incomeOption,
    };
  },
  components: {
    landGeo,
    landEcharts
  },
  props: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {}
};
</script>
 <style scoped lang="less">
@import url("./land.less");
</style>



