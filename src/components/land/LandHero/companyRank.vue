<template>
<div class="companyRank">
  <div class="Frame">
    <head>
      企业分类详情
      <i class="iconfont iconRectangleCopy" @click="close()" style="color:#fff"></i>
    </head>
    <div class="searchbox">
      <input type="text" placeholder="请输入企业名称" @blur="allSearch" />
      <div class="iconfont iconRectangleCopy2" @click="rightSearch()"></div>
    </div>
    <div class="_rankFrame">
      <header class="tlayout">
        <!-- <span>序号</span> -->
        <span>企业类型</span>
        <span>企业名称</span>
        <span>评价结果</span>
      </header>
      <div class="landRankList" v-for="(value,key,index) in data" :key="index">
        <ul class="listBody">
          <li v-for="(item,dindex) in value.list" :key="dindex" @click="goForce(item)">
            <!-- <span>{{++dindex}}</span> -->
            <span>{{item._type}}</span>
            <span>{{item.name}}</span>
            <span :class="changeColor(item.dc)">{{item.dc}}</span>
          </li>
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
        regulatory: {
          searchVal: "",
          tag: 1,
          top3: [],
          list: []
        }
      },
      inputSearch: null,
      btnSearch: null
    };
  },
  created() {},
  mounted() {
    this.fetchCompany();
  },
  methods: {
    goForce(company) {
      this.$parent.rankCompany = company;
    },
    searchLandCompany(key) {
      qypjjgApi
        .ds({
          count: 30,
          where: ` name like '%${key}%'`,
          order: "dc asc"
        })
        .then(({ data }) => {
          this.data.regulatory.list = data.map(item => {
            return { ...item, _type: item.tag == 1 ? "规下企业" : "规上企业" };
          });
        });
    },
    fetchCompany() {
      qypjjgApi.ds({ order: "tag,dc asc" }).then(({ data }) => {
        this.data.regulatory.list = data.map(item => {
          return { ...item, _type: item.tag == 1 ? "规下企业" : "规上企业" };
        });
      });
    },
    close() {
      this.$parent.companyShow = false;
    },
    allSearch(evt) {
      this.inputSearch = evt.target.value;
    },
    rightSearch() {
      this.btnSearch = this.inputSearch;
      this.searchLandCompany(this.btnSearch);
    },
    changeColor(dc) {
      if (dc == "A") {
        return "A";
      } else if (dc == "B") {
        return "B";
      } else if (dc == "C") {
        return "C";
      } else {
        return "D";
      }
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./companyRank.less");
</style>



