<template>
  <div class="Rsearch">
    <ul>
      <li
        v-for="(item,index) in data"
        :key="index"
        @click="searchClick(item)"
      >
        <span class="_line" />
        <div class="rsearch_content">
          <img
            :src="`${server}/icon/${rSearchTravel?`travel`:`tsjjImg`}/${item.name}.${rSearchTravel?`jpg`:`png`}`"
            @error="errorImg()"
          />
          <div class="textcontent">
            <p>{{item.name}}</p>
            <span
              :style="{color:rSearchTravel?Color[travelArr.indexOf(item.type)]:Color[item.type-1]}"
            >{{rSearchTravel?item.type:item.param}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import jjtsApi from "@/api/beans/u_jjts";
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  name: "ecoEstate",
  data() {
    return {
      data: [],
      indexShow: false,
      server,
      travelArr: [
        "AAA级景区村庄",
        "A级风景区",
        "其他景点",
        "星级旅行社",
        "星级酒店",
        "民宿客栈"
      ],
      Color: ["#83C73B", "#0277FC", "#FDB900", "#763BFF", "#FF58AD", "#FFD700"],
      defaultImg: `${server}/icon/commonIcon/noImg.png`
    };
  },
  components: {},
  props: {
    search: Array,
    rSearchTravel: Boolean
  },
  watch: {
    search(newVal, val) {
      this.data = newVal;
    }
  },
  created() {},
  mounted() {
    this.allclick();
  },
  methods: {
    allclick() {
      jjtsApi.ds().then(({ data }) => {
        this.data = data;
      });
    },
    searchClick(item) {
      if (this.rSearchTravel) {
        this.$parent.$refs.ecoEstateMap.goTravel(item);
      } else {
        if (item.param === "市百强企业") {
          this.$parent.Bquuid = item.uuid;
          this.$parent.BqShow = true;
        } else {
          this.$parent.FrameName = item.name;
          this.$parent.FrameShow = true;
        }
        this.$parent.type = [item.fw, item.name];
      }
    },
    errorImg() {
      let img = event.srcElement;
      img.src = this.defaultImg;
      img.onerror = null;
    }
  }
};
</script>
 <style lang="less">
.Rsearch {
  // background-image: url("../../common/image/repeatBg.png");
  // background-repeat: repeat;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  ) !important;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3) !important;
  ul::-webkit-scrollbar {
    display: none;
  }
  ul {
    width: 100%;
    height: 785px;
    list-style: none;
    overflow: hidden;
    overflow-y: auto;
    padding: 11px;
    li {
      width: 100%;
      height: 17%;
      display: flex;
      flex-direction: column;
      text-align: left;
      cursor: pointer;
      .rsearch_content {
        height: 95%;
        width: 100%;
        display: flex;
        padding: 10px;
        img {
          width: 40%;
        }
        .textcontent {
          width: 60%;
          padding-left: 14px;
          span {
            font-size: 16px;
          }
          p {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>