<template>
  <div class="app">
    <header :class="`app_header ${isOutside || (!isOutside && current == 3) ?`noWidth`:``}`">
      <div class="app_icon">
        <img :src="icon" />
      </div>
      <div class="app_toptab_position app_toptab_normal" v-if="!isOutside && current != 3">
        <ul class="app_toptab">
          <li
            v-for="(item,index) in tabs"
            :key="index"
            :class="{active:index==current}"
            @click="$goRoute(item.route),selected(index),movecircle(index)"
          >{{item.label}}</li>
        </ul>
        <div class="line">
          <div class="circle" :style="{left:movecircle_style+'px'}"></div>
          <div class="spot" :style="{left:movecircle_style+'px'}">
            <div class="top-left"></div>
            <div class="top-right"></div>
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="app_icon2">
        <img :src="icon2" />
        <div class="chooseButton" @click="showStyle()">
          <i class="iconfont icon icongeren2" />
        </div>
      </div>
    </header>
    <div class="app_container">
      <!-- <keep-alive include="building"> -->
      <router-view ref="router" />
      <transition name="frame">
        <Style v-if="chooseStyle" />
      </transition>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { OPTION, GET_ARCGIS_TOKEN, WRT_config } from "./components/common/Tmap";
const { server } = WRT_config;
import { fixMenuList } from "./components/common/user/menuHash";
import router from "@/router";
import Style from "@/components/common/user/Style.vue";
export default {
  name: "app",
  data() {
    return {
      server,
      src: `${server}/icon/video/lcvideo.mp4`,
      movecircle_style: 0,
      icon: require(`./components/common/image/lc.png`),
      icon2: require(`./components/common/image/设计集团logo.png`),
      circle: require(`./components/common/image/椭圆3.png`),
      tabs: [],
      toptab: [
        { label: "经济总图", route: "economy" },
        { label: "楼宇地图", route: "build" },
        { label: "用地地图", route: "land" },
        { label: "招商地图", route: "canvass" }
      ],
      current: 0,
      isOutside: false,
      chooseStyle: false
    };
  },
  async created() {
    //  isOutside对外版本样式会有区别
    this.isOutside = this.$env == "outside";
    await this.shallLogin();
  },
  mounted() {
    this.setLoation();
    if (
      location.host.includes("lysb.lucheng.gov.cn") ||
      location.host.includes("localhost")
    ) {
      window.user.style.length
        ? window.user.style[0].chooseStyle
          ? (document.getElementsByTagName("div")[0].className = "app")
          : (document.getElementsByTagName("div")[0].className =
              window.user.style[0].chooseStyle)
        : (document.getElementsByTagName("div")[0].className = "app");
    } else {
      window.user.style.length
        ? (document.getElementsByTagName("div")[0].className =
            window.user.style[0].chooseStyle)
        : "";
    }
  },
  watch: {
    $route(to, from) {
      // if (this.$route.params.id == "1") {
      //   this.$router.push({
      //     name: "economy",
      //     params: {
      //       activeName: to.params.activeName,
      //       list: to.params.list,
      //       Jump: true
      //     }
      //   });
      // }
    }
  },
  components: {
    Style
  },
  methods: {
    shallLogin() {
      const that = this;
      return new Promise(async (resolve, reject) => {
        that.tabs = window.user.au_username ? fixMenuList(that.toptab) : [];
        resolve(true);
      });
    },
    doConfigProxy() {
      const promise = new Promise((resolve, reject) => {
        loadModules(["esri/config"], OPTION).then(([esriConfig]) => {
          //  弹框取消
          esriConfig.request.proxyUrl =
            "http://192.168.0.200/DotNet/proxy.ashx";
          resolve(true);
        });
      });
      return promise;
    },
    doDialogOpen(fn) {
      loadModules(
        ["esri/identity/IdentityManager", "esri/config"],
        OPTION
      ).then(([IdentityManager, esriConfig]) => {
        //  弹框取消
        IdentityManager.on("dialog-create", function() {
          IdentityManager.dialog.open = true;
        });
        fn && fn();
      });
    },
    /**
     * 注册token、关闭弹框
     * @param {String} token token
     */
    doRegisterToken(token) {
      const that = this;
      that.$arcgisToken = token;
      loadModules(["esri/identity/IdentityManager"], OPTION).then(
        ([IdentityManager]) => {
          //  token注册
          IdentityManager.registerToken({
            server: GET_ARCGIS_TOKEN,
            token
          });
        }
      );
    },
    selected(index) {
      this.current = index;
    },
    setLoation() {
      const { name } = this.$router.history.current;
      this.toptab.map((item, index) => {
        if (item.route === name) {
          this.current = index;
          this.movecircle(index);
        }
      });
    },
    movecircle(index) {
      this.movecircle_style = 155 * index;
    },
    showStyle() {
      // this.$refs.router.$refs.Economy.chooseStyle = true;
      this.chooseStyle = true;
    }
  }
};
</script>

<style lang="less">
@import url("components/common/css/common.less");
@import url("components/common/css/style.less");
@import url("components/common/css/animate.css");
@import url("components/common/css/frame.less");
@import url("components/common/css/arcgis.css");
</style>
