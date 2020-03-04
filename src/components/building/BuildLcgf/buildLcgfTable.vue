<template>
  <div class="buildLcgfTable">
    <div class="buildLcgfForm">
      <header>公房匹配</header>
      <span>
        <div>
          <i class="iconfont iconRectangleCopy2"></i>
          <input type="text" v-model="search.dz" placeholder="输入公房地址" />
        </div>
        <button @click="fetchLcgf">搜索</button>
      </span>
      <span class="lcgfResTableSearch">
        <div>
          <label>房屋面积</label>
          <input type="text" v-model="search.mj[0]" class="mu1" />&nbsp;~
          <input type="text" v-model="search.mj[1]" class="mu1" />&nbsp;㎡
        </div>
        <div>
          <label>房屋状态</label>
          <select v-model="search.fwzt">
            <option value>全部</option>
            <option value="空置">空置</option>
            <option value="在租">在租</option>
            <option value="自用">自用</option>
            <option value="调配">调配</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </span>
      <div class="match" @click="fetchLcgf">匹配</div>
    </div>
    <div class="buildLcgf_Table">
      <header>
        <span>公房地址</span>
        <span>面积(㎡)</span>
        <span>状态</span>
      </header>
      <ul>
        <li
          v-for="(_item,index) in list"
          :key="index"
          @click.stop="()=>{$parent.$refs.arcgis.forceLcgf(_item)}"
        >
          <span>{{_item.dz }}</span>
          <span>{{_item.mj}}</span>
          <span>{{_item.fwzt}}</span>
        </li>
        <li class="no_result" v-if="!list.length">没有匹配的结果</li>
      </ul>
    </div>
    <div class="blueBorder">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>
<script>
import { loadModules } from "esri-loader";
import lcgfApi from "@/api/beans/u_lcgf";
import { OPTION } from "@/components/common/Tmap";
export default {
  name: "buildLcgfTableFrame",
  data() {
    return {
      list: [],
      search: {
        mj: ["", ""],
        dz: "",
        fwzt: ""
      }
    };
  },
  components: {},
  props: {},
  watch: {},
  created() {},
  mounted() {
    this.fetchLcgf();
  },
  methods: {
    fetchLcgf() {
      const { mj, dz, fwzt } = this.search;
      const mj1 = parseFloat(mj[0]).toFixed(2);
      const mj2 = parseFloat(mj[1]).toFixed(2);
      const _mj =
        !isNaN(mj1) && !isNaN(mj2)
          ? ` and convert(float,mj) >= ${mj1} and convert(float,mj) <= ${mj2}`
          : ``;
      lcgfApi
        .ds({
          where: `dz like '%${dz}%' and fwzt like '%${fwzt}%' ${_mj} `
        })
        .then(({ data }) => {
          this.list = data;
        });
    }
  }
};
</script>
 <style lang="less">
@import url("./buildLcgfTable.less");
</style>