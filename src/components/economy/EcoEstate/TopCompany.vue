<template>
<div class="TopCompany">
  <div class="TopCompany_contain">
    <ul>
      <head>
        <img :src="`${server}/icon/topicsIcon/优质企业.png`" />
        2018年度鹿城区{{this.$props.Title}}
        <i class="iconfont iconRectangleCopy" @click="leftclose(false)"></i>
      </head>
      <li v-for="(item,index,key) in data" :key="key">
        <div class="TopCompany_list">
          <p v-if="item.label">{{++key}}.{{item.label}}</p>
          <ul>
            <li
              v-for="(_item,_index) in item.data"
              :key="_index"
              @click="showTopCompany(_item.uuid)"
            >
              <span>{{_item.qymc}}</span>
            </li>
          </ul>
        </div>
        <span class="_line" />
      </li>
    </ul>
  </div>
  <div class="blueBorder">
    <p></p>
    <p></p>
    <p style="position: absolute;bottom: -770px;"></p>
    <p style="position: absolute;bottom: -770px;"></p>
  </div>
</div>
</template>
<script>
import { WRT_config, OPTION, CYBJ } from "@/components/common/Tmap";
import { loadModules } from "esri-loader";
const { server } = WRT_config;
import jjtsApi from "@/api/beans/u_jjts";
export default {
  name: "ecoEstate",
  data() {
    return {
      server,
      data: [],
      yjTitle: null
    };
  },
  components: {},
  props: { Title: String },
  watch: {
    Title: {
      handler(newVal, val) {
        this.data = [];
        jjtsApi
          .TopCompany({ where: `yzlx like '%${newVal}'` })
          .then(({ data }) => {
            const obj = {};
            data.map(item => {
              const xxqk = item;
              if (!obj[xxqk.xxqk1]) {
                obj[xxqk.xxqk1] = { label: xxqk.xxqk1, data: [] };
              }
              obj[xxqk.xxqk1].data.push(xxqk);
              this.data = obj;
            });
          });
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    leftclose() {
      this.$parent.showTopCompany = false;
      this.$parent.searchShow = true;
    },
    showTopCompany(_uuid) {
      const that =this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: CYBJ + "/4"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `统一社会信 = '${_uuid}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (!response.features[0]) return;
          that.$parent.$refs.ecoEstateMap.fetchCompany(
            response.features[0].attributes,
            response.features[0].geometry
          );
        });
      });
    }
  }
};
</script>
 <style lang="less">
.TopCompany {
  border: 1px solid rgba(7, 73, 190, 0.4);
  background: linear-gradient(
    270deg,
    rgba(27, 56, 101, 0.45) 100%,
    rgba(3, 15, 31, 0.6) 0%
  ) !important;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4) !important;
  right: 10px;
  width: 380px;
  height: 768px;
  top: 197px;
  border-top: 1px solid;
  border-image: linear-gradient(
      270deg,
      rgba(7, 73, 190, 0.6) 0%,
      rgba(89, 199, 252, 1) 51%,
      rgba(7, 73, 190, 0.6) 100%
    )
    1 10;
  .TopCompany_contain {
    background: unset !important;
    box-shadow: unset !important;
    border: unset;
    z-index: 1;
    ul::-webkit-scrollbar {
      display: none;
    }
    ul {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      list-style: none;
      head {
        display: block;
        background: rgba(176, 203, 243, 0.1);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 18px;
        color: #12d6ff;
        width: 379px;
        height: 44px;
        line-height: 43px;
        img {
          width: 16px;
          height: 16px;
          margin-right: 9px;
          position: relative;
          top: 2px;
        }
        i {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 10px;
        }
      }
      li {
        width: 100%;
        // height: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        cursor: pointer;
        padding: 9px;
        margin-top: 8px;
        .TopCompany_list {
          width: 100%;
          // height: 100%;

          img {
            width: 40%;
          }
          p {
            height: 40px;
            font-size: 20px;
            line-height: 31px;
            color: #12d6ff;
            text-align: left;
          }
          ul::-webkit-scrollbar {
            display: none;
          }
          > ul {
            width: 100%;
            // height: 670px;
            overflow-y: auto;
            li {
              height: 33px;
              width: 100%;
              // padding: 5px;
              span {
                text-align: left;
              }
            }
          }
        }
      }
    }
  }
  .blueBorder {
    position: absolute !important;
    top: 0px;
    width: 100%;
    height: unset !important;
    right: 0;
    background: unset !important;
    box-shadow: unset !important;
    z-index: 0;
    p:nth-child(3) {
      position: absolute;
      bottom: -770px;
    }
    p:last-child {
      position: absolute;
      bottom: -771px;
    }
  }
}
</style>