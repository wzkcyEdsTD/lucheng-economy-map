<template>
  <div class="ecoCompanySix">
    <div class="ecoCompanySix_tableFrame" v-if="TableShow">
      <div class="ecoCompanySix_table">
        <div class="thead">
          <span>序号</span>
          <span>名称</span>
        </div>
        <ul class="tbody">
          <li v-for="(item,index) in list" :key="index" >
            <span>{{++index}}</span>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import indexApi from "@/api/beans/u_index";
export default {
  name: "ecoCompanySix",
  data() {
    return {
      list: []
    };
  },
  components: {},
  props: {},
  created() {
    this.createSix();
  },
  mounted() {},
  methods: {
    createSix() {
      indexApi.cypt().then(({ data }) => {
        if (!data.length) return;
        this.list = data;
        console.log(this.list);
      });
    }
  }
};
</script>
 <style lang="less">
.ecoCompanySix {
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: 846px;
  padding: 10px 10px;
  right: 0px;
  z-index: 4;
  .ecoCompanySix_tableFrame {
    box-sizing: border-box;
    padding: 10px 0px;
    margin-top: 20px;
    flex: 1;
    background: linear-gradient(
      270deg,
      rgba(3, 15, 31, 0.6) 0%,
      rgba(27, 56, 101, 0.45) 100%
    );
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4);
    .ecoCompanySix_table {
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
      .tbody::-webkit-scrollbar {
        display: none;
      }
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
}
</style>