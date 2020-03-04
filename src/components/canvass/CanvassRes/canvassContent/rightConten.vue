<template>
  <div :class="`proFrame ${icon_show_left ? `toLeft`:`Left`}`">
    <header v-if="infoList.length">
      {{infoList[0].xmmc}}
      <!-- <span data-v-772831ac class="stateTipHeaderBar"></span> -->
      <i class="iconfont iconRectangleCopy" @click="close()"></i>
    </header>
    <div class="gk">
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
    <div class="contant">
      <span>
        <img :src="`${server}/icon/canvassImg/lxr.png`" />
        联系人：{{this.ksfzr}}先生/女生
      </span>
      <br />
      <span>
        <img :src="`${server}/icon/canvassImg/phone.png`" />
        电话：{{this.lxdh}}&nbsp;&nbsp;/&nbsp;&nbsp;{{this.ksdh}}
      </span>
    </div>
    <!-- <div class="blueBorder">
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    </div>-->
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
      lxr: null,
      lxdh: null,
      ksfzr: null,
      ksdh: null
    };
  },
  components: {},
  props: {
    icon_show_left: Boolean,
    forceCanvass: Object
  },
  watch: {
    forceCanvass: {
      handler(obj) {
        this.fetchInfo(obj.pid);
      },
      immediate: true
    }
  },
  methods: {
    fetchInfo(pid) {
      const obj = {};
      zsscxqApi.ds({ where: `pid = '${pid}'` }).then(({ data }) => {
        length = data.length;
        const infoList = data.map(item => {
          this.lxr = item.fgld.substring(0, 1) || "-";
          this.lxdh = item.fgdh || "-";
          this.ksfzr = item.ksfzr.substring(0, 1) || "-";
          this.ksdh = item.ksdh || "-";
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
        infoList.splice(1, 0, {
          nr: `<img style="width:100%;border-radius:4px;" src="${server}/icon/canvassImg/canvass_${pid}.jpg" />`
        });
        this.infoList = infoList;
      });
    },
    close() {
      this.$parent.projectShow = false;
    }
  }
};
</script>
 

<style scoped lang="less">
.toLeft {
  left: 30px !important;
}
.Left {
  left: 410px !important;
}
.proFrame {
  position: absolute;
  z-index: 120;
  top: 100px;
  // left: 30px;
  height: 780px;
  width: 400px;
  transition: all 1s;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);
  border: 1px solid rgba(7, 73, 190, 0.4);
  box-sizing: border-box;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  transform: all 0.8s;
  header {
    width: 100%;
    min-height: 30px;
    font-size: 20px;
    text-align: left;
    font-weight: bold;
    box-sizing: border-box;
    padding-right: 30px;
    .iconRectangleCopy {
      cursor: pointer;
      font-size: 28px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    p {
      width: 88%;
      font-size: 20px;
      color: #2cf6ff;
      text-align: center;
      display: inline-block;
      margin: 0 auto;
    }
  }
  .gk::-webkit-scrollbar {
    display: none;
  }
  .gk {
    flex: 1;
    overflow: auto;
    ul {
      li {
        padding: 6px 0;
        .header {
          font-weight: bold;
          color: yellow;
          text-align: left;
        }
        .info {
          text-align: left;
          font-size: 14px;
        }
      }
    }
  }
  .contant {
    text-align: left;
    line-height: 30px;
    position: absolute;
    bottom: 0px;
    left: 0;
    background: #07346d;
    width: 400px;
    box-sizing: border-box;
    padding-left: 13px;
    height: 64px;
    color: #2afffa;
    font-size: 16px;
    img {
      position: relative;
      top: 4px;
      width: 22px;
      height: 22px;
      margin-right: 5px;
    }
  }
}
</style>