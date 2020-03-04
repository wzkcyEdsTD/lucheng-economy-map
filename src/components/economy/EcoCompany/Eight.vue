<template>
  <div class="EightFrame" :style="{left:changeLeft +'px'}">
    <span class="_line" />
    <div class="frame">
      <div>
        <div class="title">
          {{this.infoList[0].xmmc}}
          <i
            class="iconfont iconRectangleCopy"
            @click="close()"
            style="float:right;color:#fff;cursor: pointer;"
          ></i>
        </div>
        <ul>
          <li v-for="(item,index) in infoList" :key="index">
            <div class="header" v-if="item.ml">
              {{item.ml}}
              <br />
              {{item.mlyw}}
            </div>
            <div class="info" v-html="item.nr"></div>
          </li>
        </ul>
      </div>
    </div>
    <span class="_line" />
  </div>
</template>

<script>
/* eslint-disable */
import zsscxqApi from "@/api/beans/u_zsscxq";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  data() {
    return {
      infoList: [],
      server,
      changeLeft:"30"
    };
  },
  components: {},
  props: {
    Left:String,
    forceEight: Array
  },
  watch: {
     Left:{
      handler(newVal,val){
        this.changeLeft = newVal;
      }
    },
    forceEight: {
      handler(obj) {
        this.fetchInfo(obj);
      },
      immediate: true
    }
  },
  methods: {
    fetchInfo(_obj) {
      const obj = {};
      const infoList = _obj.map(item => {
        return {
          ...item,
          nr: item.nr
            .split("@@")
            .map((o, index) => {
              return `<p>${
                o[0] != "—"
                  ? `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
                  : ``
              }${o}</p>`;
            })
            .join("<br />")
        };
      });
      this.infoList = infoList;
    },
    close() {
      this.$parent.eightShow = false;
    }
  }
};
</script>
 

<style scoped lang="less">
.EightFrame {
  width: 400px;
  position: absolute;
  top: 100px;
  z-index: 2;
  box-sizing: border-box;
  background-color: rgba(37, 37, 37, 0.4);
  z-index: 4;
  transition: all 1s;
  .frame {
    width: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 63, 189, 0.6) 0%,
      rgba(5, 53, 129, 0.6) 100%
    ) !important;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
      0px 0px 44px 0px rgba(16, 146, 236, 0.3) !important;
    padding: 10px;
    flex: 1;
    height: 780px;

    > div {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      .title {
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        font-weight: 700;
        text-align: left;
        text-align: center;
        color: rgba(0, 189, 255, 1);
        padding-right: 10px;
      }
      ul::-webkit-scrollbar {
        display: none;
      }
      ul {
        overflow: auto;
        height: 720px;
        li {
          padding: 6px 0;
          .header {
            font-weight: bold;
            color: rgba(0, 189, 255, 1);
            text-align: left;
            font-size: 18px;
          }
          .info {
            text-align: left;
            font-size: 16px;
            padding: 5px;
          }
        }
      }
    }
  }
}
</style>