<template>
  <div class="ecoCharSingle">
    <header>
      {{forceChar.name}}
      <i @click="closeShowDetail" class="iconfont iconRectangleCopy"></i>
    </header>
    <div class="detailBody">
      <div>
        <img class="detailImg" :src="forceChar.url" />
        <div>{{forceChar.intro}}</div>
      </div>
      <div>
        <table border="2" class="detailTable">
          <thead>
            <tr>
              <th rowspan="2">项目</th>
              <th colspan="2">2016年</th>
              <th colspan="2">2017年</th>
              <th colspan="2">2018年</th>
              <th colspan="2">2019年一季度</th>
              <th colspan="2">2019年上半年</th>
            </tr>
            <tr>
              <th>合计</th>
              <th>同比增长</th>
              <th>合计</th>
              <th>同比增长</th>
              <th>合计</th>
              <th>同比增长</th>
              <th>合计</th>
              <th>同比增长</th>
              <th>合计</th>
              <th>同比增长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in detailBody" :key="index">
              <td v-for="(_item,_index) in item" :key="_index">{{_item}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { detailBody } from "./ecoCharSingleData";
export default {
  name: "ecoCharSingle",
  data() {
    return {
      detailBody
    };
  },
  components: {},
  props: { forceChar: Object },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    closeShowDetail() {
      this.$parent.showDetail = false;
    }
  }
};
</script>
 <style scope lang="less">
.ecoCharSingle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-700px, -400px);
  width: 1400px;
  height: 800px;
  border-radius: 10px;
  background-color: rgba(7, 30, 73, 1);
  box-shadow: 0px 10px 25px #305cbc inset;
  box-sizing: border-box;
  padding: 0 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  > header {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #00ffff;
    i {
      float: right;
      font-size: 30px;
      cursor: pointer;
    }
  }
  .detailBody {
    flex: 1;
    display: flex;
    flex-direction: row;
    > div:first-child {
      width: 400px;
      text-align: left;
      .detailImg {
        width: 400px;
        height: 180px;
      }
      > div {
        width: 100%;
      }
    }
    > div:last-child {
      flex: 1;
      box-sizing: border-box;
      padding: 10px;
      .detailTable {
        width: 100%;
        height: 100%;
        thead {
          th {
            height: 30px;
          }
        }
      }
    }
  }
}
</style>