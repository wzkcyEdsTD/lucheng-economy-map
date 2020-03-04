<template>
  <div class="book_box" style="z-index: 0">
    <div class="book_content flipbook"></div>
    <div  class="cover">
      <div
        style="width: 426px;height:100px;position: absolute;top:50px;;left: 114px;flex-direction:column; color:#eda97c;"
      >
        <p style="font-size: 28px;text-align: left;">培育农业农村新动能</p>
        <p style="font-size: 28px;text-align: left;">实施乡村振兴战略的若干政策意见</p>
      </div>
      <div
        class="zc1"
        style="width:530px;;height:500px;position: absolute;top:18%;;left: 9%;flex-direction:row; display:flex;box-sizing: border-box;"
      >
        <div style="width: 100%;padding: 15px;line-height: 30px;text-align: left;font-size: 18px;">
          <p>为了加快实施乡村振兴战略，全面深化农业供给侧结构性改革，培育农业农村转型发展新动能，巩固提升农业产业化水平。根据中共温州市委 温州市人民政府印发《关于培育农业农村新动能 实施乡村振兴战略的若干政策意见》的通知（温委发（2018）46号）精神，结合鹿城实际，在历年涉农有关政策整合优化的基础上，制定如下政策意见。</p>
          <p>一、高标准推进乡村振兴和美丽乡村建设</p>
          <p>1.大力建设乡村振兴示范带。在乡村振兴示范带范围外，被认定为省级新时代美丽乡村达标村的，每个村奖励10万元。被认定为市级美丽乡村样板村的，每个村奖励30万元。对创建成为农村生活垃圾分类处理村的，按每个村5万元的标准给予街镇奖励。</p>
          <p>2.深入实施精准脱贫。每年安排财政专项扶贫资金，主要用于全区农村扶贫开发基础性、引领性和战略性的领域，重点保障区委、区政府确定的农村扶贫开发重点工作。区领导挂钩帮扶的低收入农户相对集中且集体经济相对薄弱的重点帮扶村，按照每个村5万元补助。种养大户、农业龙头企业、农业专业合作</p>
        </div>
        <div style="position: absolute;bottom: -70px;left: 50%;">1</div>
      </div>
    </div>
    <div class="Shadowe">
      <div class="book_text"></div>
    </div>
    <ul class="bookmark">
      <!-- <li class="mark_02" data-id="1">惠企政策</li> -->
      <li class="mark_03" data-id="1">农业农村新动能</li>
      <li class="mark_04" data-id="11">促进开放型经济</li>
      <li class="mark_05" data-id="17">工业经济高质量发展</li>
      <li class="mark_06" data-id="35">现代服务业高质量发展</li>
       <li class="mark_06" data-id="45">深化人才制度改革的30条意见</li>
      <li class="mark_07" data-id="61">政策兑现官网</li>
    </ul>
  </div>
</template>

<script>
import $ from "jquery";
import initDom from "./js/bookbase.js";
export default {
  name: "zsbook",
  data() {
    return {
    };
  },
  components: {},
  props: {},
  created() {},
  mounted() {
    initDom();
  },
  computed: {},
  methods: {}
};
</script>
<style scoped lang="less">
@import url("./zsbase.less");
</style>
