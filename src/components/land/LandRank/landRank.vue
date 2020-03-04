<template>
  <div class="landRank">
    <div class="_rankFrame" v-for="(value,key,index) in data" :key="index">
      <div class="landRankFrame">
        <header>
          <div class="text">{{value.label}} (排名不分先后)</div>
          <span>
            <input placeholder="输入企业名称" v-model="value.searchVal" />
            <div class="iconfont iconRectangleCopy2" @click="searchLandCompany(key)"></div>
          </span>
        </header>
        <div class="landRankList">
          <header class="tlayout listHeader">
            <span>企业名称</span>
            <span>统一社会码</span>
            <span>评价结果</span>
          </header>
          <ul class="listBody">
            <li
              class="tlayout"
              v-for="(item,dindex) in value.list"
              :key="dindex"
              @click="goForce(item)"
            >
              <span>{{item.name}}</span>
              <span>{{item.uuid}}</span>
              <span>{{item.dc}}</span>
            </li>
            <div class="no_res" v-if="!value.list.length">未匹配到相关信息</div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qypjjgApi from "@/api/beans/u_qypjjg";
export default {
  name: "landrank",
  data() {
    return {
      data: {
        underRegulatio: {
          label: "规下企业英雄排行榜",
          searchVal: "",
          tag: 0,
          top3: [],
          list: []
        },
        regulatory: {
          label: "规上企业英雄排行榜",
          searchVal: "",
          tag: 1,
          top3: [],
          list: []
        }
      },
      test: [
        "linear-gradient(to right, #FF4500 , #FFA500)",
        "linear-gradient(to right, #FFA500 , #1E90FF)",
        "linear-gradient(to right, #1E90FF , #00BFFF)"
      ]
    };
  },
  created() {},
  mounted() {
    this.fetchCompany();
  },
  methods: {
    goForce(company) {
      this.$parent.company = company;
      this.$parent.activeName = "landHero";
    },
    searchLandCompany(key) {
      const { searchVal, tag } = this.data[key];
      qypjjgApi
        .ds({
          count: 30,
          where: `tag = '${tag}' and name like '%${searchVal}%'`,
          order: "dc asc"
        })
        .then(({ data }) => {
          this.data[key].list = [...data];
        });
    },
    fetchCompany() {
      qypjjgApi
        .ds({ count: 30, where: "tag = '1'", order: "dc asc" })
        .then(({ data }) => {
          this.data.regulatory.list = [...data];
        });
      qypjjgApi
        .ds({ count: 30, where: "tag = '0'", order: "dc asc" })
        .then(({ data }) => {
          this.data.underRegulatio.list = [...data];
        });
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./landRank.less");
</style>



