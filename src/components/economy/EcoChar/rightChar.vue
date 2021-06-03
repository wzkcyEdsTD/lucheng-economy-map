<!-- rightCompetition -->
<template>
  <div class="rightCompetition">
    <span class="_line" />
    <div class="rightline">
      <!-- <div class="rightHeader">
        <span
          style="font-size:24px;color:rgba(226,255,255,1);text-shadow:0px 0px 4px rgba(76,215,236,0.5);line-height: 48px;"
        >{{forceChar.name}}</span>
      </div>-->
      <div class="rightBody">
        <div class="rightCard">
          <div class="rightCardTitle">
            街道概况
            <!-- <i class="more" @click="showDetail">查看更多</i> -->
          </div>
          <div class="rightCardBody">
            <div class="rightCanvas">
              <span class="rightCardWord">
                <i class="i_gold">总面积:</i>
                <span class="text">{{forceChar.area}}km²</span>
              </span>
              <span class="rightCardWord">
                <i class="i_gold">户籍人口数:</i>
                <span class="text">{{forceChar.census || "-"}} 人</span>
              </span>
              <span class="rightCardWord">
                <i class="i_gold">户籍数:</i>
                <span class="text">{{forceChar.hjs}}户</span>
              </span>
              <span class="rightCardWord">
                <i class="i_gold">社区/村:</i>
                <span class="text">{{forceChar.communities}}个</span>
              </span>
              <span class="rightCardWord">
                <i class="i_gold">企业:</i>
                <span class="text">{{forceChar.companies}}个</span>
              </span>
              <span class="rightCardWord">
                <i class="i_gold">规上企业:</i>
                <span class="text">{{forceChar.gsqys}}个</span>
              </span>
            </div>
          </div>
          <span class="_line" />
        </div>
        <div class="rightImgCard">
          <div class="rightImgTitle">{{forceChar.project}}</div>
          <div class="rightImgBody">
            <div class="rightImg">
              <img :src="forceChar.image1" @click="clickImg(forceChar.image1)" />
            </div>
            <div class="rightTxt">
              <img :src="forceChar.image2" @click="clickImg(forceChar.image2)" />
            </div>
          </div>
          <span class="_line" />
        </div>
        <div class="rightCard">
          <div class="rightCardTitle">项目投资及进度</div>
          <div class="rightCardBody">
            <div class="rightCanvas">
              <span class="rightCardWord i_gold">
                总投资:
                <span class="text">{{forceChar.ztz || '-'}}</span>
              </span>
              <span class="rightCardWord i_gold">
                用地面积:
                <span class="text">{{forceChar.zydmj || '-'}}</span>
              </span>
              <span class="rightCardWord i_gold">
                年税收:
                <span class="text">{{forceChar.nss || '-'}}</span>
              </span>
              <span class="rightCardWord i_gold">
                竣工时间:
                <span class="text">{{forceChar.jgsj || '-'}}</span>
              </span>
            </div>
          </div>
          <span class="_line" />
        </div>
        <div class="rightCard rightProjectDetail">
          <div class="rightCardTitle">项目概况</div>
          <div class="rightCardBody">
            <div class="rightCanvas">
              <span class="rightCardWord" style="width:100%">{{forceChar._jj}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="_line" />
    <div class="blueBorder">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import ecoecharts from "@/components/common/echarts";
import echarts from "echarts";
export default {
  //import引入的组件需要注入到对象中才能使用
  name: "rightCompetition",
  data() {
    //这里存放数据
    return {};
  },
  props: {
    forceChar: Object
  },
  components: {
    ecoecharts
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    showDetail() {
      this.$parent.showDetail = true;
    },
    clickImg(e) {
      this.$parent.ImgUrl = e;
      this.$parent.showImg = true;
    }
  }
};
</script>
<style lang='less' scoped>
@borderStyle: 1px solid #dddddd6e;
.rightCompetition {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);
  border-left: 1px solid;
  border-image: linear-gradient(
      360deg,
      rgba(7, 73, 190, 0) 0%,
      rgba(0, 172, 255, 0.4) 32%,
      rgba(0, 255, 255, 0.8) 51%,
      rgba(0, 172, 255, 0.4) 73%,
      rgba(7, 73, 190, 0) 100%
    )
    1 10;
  .rightline {
    width: 100%;
    height: 100%;

    .rightHeader {
      width: 100%;
      height: 5%;
      text-align: left;
      font-size: 24px;
      color: #f4fbff;
      font-weight: 600;
      margin: 15px 0;
    }
    .rightBody {
      height: 95%;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      .rightImgCard {
        .rightImgBody {
          display: flex;
          .rightImg,
          .rightTxt {
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            padding: 10px 2px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .rightCard {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-basis: 1em;
        .rightCardBody {
          display: flex;
        }
      }
      .rightCardChart {
        flex: 1;
        display: flex;
        flex-direction: column;
        .rightChartBody {
          flex: 1;
        }
      }
      .rightProjectDetail {
        flex: 1;
      }
      .rightImgTitle,
      .rightCardTitle,
      .rightChartTitle {
        text-align: left;
        font-size: 18px;
        height: 30px;
        line-height: 44px;
        color: rgba(42, 255, 250, 1);
        .more {
          cursor: pointer;
          font-style: normal;
          font-size: 14px;
          line-height: 39px;
          float: right;
          color: #6495ed;
        }
      }
      .rightCanvas {
        width: 100%;
        height: 100%;
        text-align: left;
        padding: 8px;
        font-size: 16px;
      }
      .rightCardWord {
        width: 50%;
        padding: 5px 0;
        display: inline-block;
        font-size: 16px;
        vertical-align: top;
        color: rgba(205, 223, 252, 1);
        .i_gold {
          color: rgba(205, 223, 252, 1);
        }
        .text {
          color: rgba(61, 244, 255, 1);
        }
        .porgress {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          .jdt {
            width: 50%;
            height: 100%;
            border-radius: 50px;
            background-color: #ddd;
            position: relative;
            top: 5px;
          }
          .skills {
            text-align: right;
            padding-right: 20px;
            line-height: 14px;
            font-size: 14px;
            color: white;
          }
          .html {
            width: 50%;
            border-radius: 50px;
            background-color: #f3a548;
          }
        }
      }
    }
  }
}
</style>