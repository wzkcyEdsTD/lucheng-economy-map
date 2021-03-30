<template>
  <div class="AEO-view">
    <div :class="`aeo ${fromCanvass?`Top`:``} `" @click="closeAEO">
      <div class="aeo_container" @click.stop="()=>{}">
        <header>
          <img :src="`${server}/icon/topicsIcon/TopHeadTitle.png`" />
          <i class="iconfont iconRectangleCopy" @click="closeAEO"></i>
        </header>
        <div class="aeoList">
          <ul>
            <li v-for="(item,key,index) in AeoObj" :key="index" class="aeoInfo">
              <header>
                <img :src="`${server}/icon/topicsIcon/优质企业.png`" />
                {{titleHash[item.title]}}
              </header>
              <div class="marquee_box">
                <ul :class="{marquee_top:animate}">
                  <li
                    v-for="(_item,_index) in item.data"
                    :key="_index"
                    @click="forceCompany(_item)"
                  >
                    <span></span>
                    <span>{{_item.qymc}}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { OPTION, YZQY } from "@/components/common/Tmap";
import { WRT_config } from "@/components/common/Tmap";
import jjtsApi from "@/api/beans/u_jjts";
const { server } = WRT_config;
export default {
  name: "aeo",
  data() {
    return {
      AeoObj: [],
      server,
      titleHash: {
        "2020年度鹿城区功勋企业": "2020年度鹿城区功勋企业34强",
        "2020年度工业30强企业": "2020年度工业30强企业",
        "2020年度商贸业30强企业": "2020年度商贸业30强企业",
        "2020年度服务业30强企业": "2020年度服务业30强企业"
      },
      colorFlag: 0,
      colorIndex: 0,
      animate: false,
      activeIndex: 0
    };
  },
  props: {
    fromCanvass: Boolean
  },
  mounted() {
    this.fetchAEOs(() => {
      setInterval(this.showMarquee, 2000);
    });
    // this.fetchAEOs();
  },
  methods: {
    closeAEO() {
      this.$parent.aeoSearch = false;
      clearInterval(this.showMarquee);
    },
    /**
     * 调用arcgis组件 定位、弹出框
     */
    forceCompany({ tyshm, x, y }) {
      const that = this;
      const uuid = tyshm;
      loadModules(["esri/geometry/Point"], OPTION).then(([Point]) => {
        const mapPoint = new Point({ x, y });
        that.$parent.$refs.ecoEstateMap.fetchCompany({ uuid }, mapPoint, () => {
          that.$parent.aeoSearch = false;
        });
      });
    },
    /**
     * arcgis服务获取优质企业
     */
    fetchAEOs(fn) {
      jjtsApi
        .TopCompany({
          where: `yzlx in ('2020年度鹿城区功勋企业','2020年度工业30强企业','2020年度商贸业30强企业','2020年度服务业30强企业')`
        })
        .then(({ data }) => {
          const obj = {};
          data.map(item => {
            const attributes = item;
            if (!obj[attributes.yzlx]) {
              obj[attributes.yzlx] = { title: attributes.yzlx, data: [] };
            }
            obj[attributes.yzlx].data.push(attributes);
            this.AeoObj = obj;
            fn && fn();
          });
        });
    },
    showMarquee() {
      this.animate = true;
      const aeoData = this.$util.clone(this.AeoObj);
      setTimeout(() => {
        const obj = {};
        for (let v in this.titleHash) {
          aeoData[v].data.push(aeoData[v].data[0]);
          aeoData[v].data.shift();
        }
        this.AeoObj = aeoData;
        this.animate = false;
      }, 800);
    }
  }
};
</script>

<style scoped lang="less">
.Top {
  top: 108px;
}
.AEO-view {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  z-index: 4;
  .aeo {
    background-image: url("../../common/image/TopCompanyBG.png");
    width: 1440px;
    height: 785px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transform: translate(0, 108px);
    margin: 0 auto;
    .aeo_container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 800px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      background: unset !important;
      box-shadow: unset !important;
      header {
        height: 40px;
        line-height: 40px;
        font-size: 22px;
        font-weight: bold;
        position: relative;
        margin-top: 10px;
        img {
          height: 76px;
          width: 587px;
        }
        > .iconRectangleCopy {
          position: absolute;
          right: 24px;
          font-size: 30px;
          cursor: pointer;
        }
      }

      .aeoList {
        box-sizing: border-box;
        padding: 34px 6px;
        flex: 1;
        overflow: hidden;
        color: #12d6ff;
        > ul {
          height: 100%;
          .aeoInfo {
            height: 100%;
            display: inline-flex;
            vertical-align: top;
            width: 335px;
            padding: 0 6px;
            flex-direction: column;
            header {
              height: 40px;
              line-height: 40px;
              font-size: 18px;
              background: rgba(176, 203, 243, 0.1);
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              text-align: left;
              img {
                width: 16px;
                height: 20px;
                margin-left: 15px;
                position: relative;
                top: 4px;
              }
            }
            .marquee_box {
              width: 100%;
              height: 100%;
              overflow: hidden;
              .marquee_top {
                transition: all 0.5s;
                margin-top: -40px;
              }
              ul::-webkit-scrollbar {
                display: none;
              }
              > ul {
                flex: 1;
                overflow: auto;
                box-sizing: border-box;
                padding-top: 5px;
                padding-left: 10px;
                li {
                  line-height: 40px;
                  text-align: left;
                  cursor: pointer;
                  // border-bottom: 1px rgba(255, 255, 255, 0.5) solid;
                  box-sizing: border-box;
                  padding: 0 4px;
                  color: #fff;
                  font-weight: lighter;
                  span:first-child {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #fff;
                    margin-right: 10px;
                  }
                }
                li:nth-child(2n) {
                  background: rgba(27, 68, 117, 1);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>