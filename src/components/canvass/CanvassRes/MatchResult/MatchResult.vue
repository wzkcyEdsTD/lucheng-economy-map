<template>
<div class="MatchView" @click="bigImg">
  <div class="match">
    <head>
      <!-- <img :src="`${server}/s/icon/commonIcon/Loading.png`" /> -->
      <p></p>
      <span>正在匹配</span>
      <!-- <img :src="`${server}/s/icon/commonIcon/Loading.png`" /> -->
      <p></p>
    </head>
    <div class="matchBody">
      <ul>
        <li class="matchCompany" v-for="(mitem,mindex) in matchData" :key="mindex">
          <div class="img" :class="liList.includes(mindex)?'':'None'">
            <img :src="`${mitem.imgSrc}`" />
          </div>
          <div class="gif" :class="liList.includes(mindex)?'':'Opacity'">
            <div class="text">
              <p>{{mitem.name}}</p>
            </div>
          </div>
        </li>
        <li v-if="!matchData.length">没有匹配的结果</li>
      </ul>
    </div>
    <div class="matchText" v-if="textShow">匹配成功！</div>
  </div>
</div>
</template>
<script>
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  name: "MatchResult",
  data() {
    return {
      server,
      matchData: [],
      show: false,
      index: -1,
      matchList: null,
      l: 0,
      liList: [],
      num: [],
      textShow: false
    };
  },
  watch: {
    matchTable: {
      handler(newVal, val) {
        if (!newVal) return;
        const _matchData = newVal.slice(0, 10).map((item, v) => {
          this.num.push(v);
          return {
            name: item.name.substring(0, 4),
            index: v,
            imgSrc: `${server}/icon/commonIcon/Loading.png`
          };
        });
        this.l = _matchData.length + 1;
        this.num.sort(() => Math.random() - 0.5);
        this.$emit("matchListDispaly", false);
        this.liList = this.num;
        this.matchData = _matchData;
        this.matchList = setInterval(() => {
          this.index = this.num[0];
          if (!this.l) {
            clearInterval(this.matchList);
            this.$parent.matchShow = false;
            this.$emit("matchListDispaly", true);
          } else if (this.l == 1) {
            _matchData.length
              ? (this.textShow = true)
              : (this.textShow = false);
          }
          this.num.shift();
          this.l--;
        }, 500);
      },
      // deep:true,
      immediate:true
    }
    
  },
  components: {},
  props: { matchTable: Array },
  created() {},
  mounted() {},
  methods: {
    bigImg(){
      this.$emit("clickit");
    }
  }
};
</script>
 <style lang="less">
.MatchView {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  z-index: 4;
  .match {
    width: 1400px;
    height: 500px;
    box-sizing: border-box;
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translate(-700px, 10px);
    head {
      width: 100%;
      height: 140px;
      padding: 71px 236px;
      text-align: center;
      display: inline-block;
      transform: translate(00px, 10px);
      p:first-child {
        width: 320px;
        height: 2px;
        background: linear-gradient(
          90deg,
          rgba(54, 137, 254, 0) 0%,
          rgba(149, 246, 252, 1) 100%
        );
        display: inline-block;
        vertical-align: middle;
      }
      span {
        width: 204px;
        height: 41px;
        font-size: 36px;
        color: rgba(84, 243, 255, 1);
        line-height: 41px;
        display: inline-block;
        vertical-align: middle;
      }
      p:last-child {
        width: 320px;
        height: 2px;
        background: linear-gradient(
          90deg,
          rgba(149, 246, 252, 1) 0%,
          rgba(54, 137, 254, 0) 100%
        );
        display: inline-block;
        vertical-align: middle;
      }
    }
    .matchBody {
      width: 1400px;
      height: 500px;
      background-image: url(image/bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      ul {
        height: 96px;
        text-align: center;
        position: relative;
        top: 28%;
        .matchCompany {
          width: 96px;
          height: 96px;
          margin-right: 16px;
          display: inline-block;
          vertical-align: middle;
          .img {
            width: 100%;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .gif {
            width: 100%;
            height: 100%;
            background-image: url("./image/complete.gif");
            position: relative;
            top: -95px;
            opacity: 0;

            .text {
              background-color: #127be9;
              border: 2px solid #0051a5;
              width: 88px !important;
              height: 88px !important;
              background-image: unset !important;
              position: relative;
              top: 4px;
              left: 4px;
              p {
                width: 80px;
                height: 80px;
                font-size: 27px;
                line-height: 42px;
              }
            }
          }
          .Opacity {
            opacity: 1;
            transition: all 3s;
          }
          .None {
            opacity: 0;
            transition: all 3s;
          }
        }
      }
    }
    .matchText {
      vertical-align: middle;
      display: inline-block;
      position: absolute;
      font-size: 36px;
      color: rgba(84, 243, 255, 1);
      bottom: 55px;
      transform: translate(-77px, 10px);
    }
  }
}
</style>