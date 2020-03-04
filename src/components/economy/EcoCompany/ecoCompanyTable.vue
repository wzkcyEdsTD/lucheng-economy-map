<template>
  <div class="ecoCompany_tableFrame">
    <div class="ecoCompany_table">
      <div class="thead">
        <span>序号</span>
        <span>企业名称</span>
        <!-- <span>产业类型</span> -->
      </div>
      <ul class="tbody">
        <li v-for="(item,index) in tableData" :key="index" @click="forceCompany(item)">
          <span>{{++index}}</span>
          <span>{{item.name}}</span>
          <!-- <span>{{item.hydm}}</span> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "ecoCompanyTableFrame",
  data() {
    return {};
  },
  components: {},
  props: {
    tableData: Array
  },
  created() {},
  mounted() {},
  methods: {
    forceCompany(item) {
      this.$parent.forceTableCompany = item;
    }
  }
};
</script>
 <style lang="less">
.ecoCompany_tableFrame {
  box-sizing: border-box;
  padding: 10px 0px;
  margin-top: 20px;
  flex: 1;
  overflow: hidden;
  background: linear-gradient(
    270deg,
    rgba(3, 15, 31, 0.6) 0%,
    rgba(27, 56, 101, 0.45) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4);
  .ecoCompany_table::-webkit-scrollbar{
    display: none;
  }
  .ecoCompany_table {
    width: 100%;
    height: 800px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    span {
      display: inline-block;
      width: 80%;
      vertical-align: middle;
      cursor: pointer;
      text-align: left;
      padding-right: 20px;
    }
    span:first-child {
      width: 20%;
      text-align: center;
      padding-right: 0px;
    }
    .thead {
      height: 42px;
      line-height: 42px;
      color: rgba(42, 255, 250, 1);
      span:nth-child(2) {
        text-align: center;
      }
    }
    // .tbody::-webkit-scrollbar {
    //   display: none;
    // }
    .tbody {
      flex: 1;
      overflow-y: scroll;
      li {
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        padding: 12px 0;
      }
    }
  }
}
</style>