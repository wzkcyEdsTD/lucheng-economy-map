<template>
  <div class="lucheng pageCamvass">
    <header class="toptab_header">
      <!-- 对内版本 -->
      <!-- <div v-if="!isOutside">
        <ul>
          <li
            v-for="(item,index) in lists "
            :key="index"
            @click="selectT(item.value,index)"
            :class="{active:activeName==item.value,li_tab_active:activeName==item.value}"
          >{{item.title}}</li>
        </ul>
      </div>-->
      <!-- 对外版本 -->
      <div class="app_toptab_position app_toptab_normal">
        <ul class="app_toptab">
          <li
            v-for="(item, index) in lists "
            :key="index"
            @click="selectT(item,index)"
            :class="{active:activeName==item.value}"
          >{{item.title}}</li>
        </ul>
        <div :class="`line ${isOutside?`lineOutside`:``}`">
          <div class="circle" :style="{left:movecircle_style+'px'}"></div>
          <div class="spot" :style="{left:movecircle_style+'px'}">
            <div class="top-left"></div>
            <div class="top-right"></div>
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
          </div>
        </div>
      </div>
    </header>
    <div class="page_container">
      <transition enter-class="fade-in-enter" enter-active-class="fade-in-active">
        <components
          :is="activeName"
          @canJump="canJump"
          :point="point"
          :ProjectName="ProjectName"
          :search="search"
          ref="StyleTool"
        ></components>
      </transition>
    </div>
  </div>
</template>

<script>
// import canvassBusiness from "./CanvassBusiness/canvassOverview.vue";
import canvassSummary from "./CanvassSummary/canvassSummary.vue";
// import canvassRes from "./CanvassRes/canvassRes.vue";
import canvassResSummary from "./CanvassResSummary/CanvassResSummary.vue";
import canvassPolicy from "./CanvassPolicy/canvassPolicy.vue";
// import canvassBook from "./canvassBook/book.vue";
export default {
  name: "canvass",
  data() {
    return {
      activeName: "canvassSummary",
      lists: [
        { value: "canvassSummary", title: "招商总述" },
        { value: "canvassResSummary", title: "招商资源" },
        { value: "canvassPolicy", title: "招商政策" }
      ],
      point: [],
      ProjectName: {},
      isOutside: false,
      movecircle_style: 0,
      search: {}
    };
  },
  components: {
    canvassSummary,
    canvassResSummary,
    canvassPolicy
  },
  created() {
    this.isOutside = this.$env == "outside";
    this.lists = this.isOutside
      ? this.lists
      : [{ value: "/", isLink: "/", title: "经济总图" }, ...this.lists];
    this.movecircle_style = this.$env == "outside" ? 0 : 150;
  },
  beforeMount() {
    if (this.$route.params.id == "1") {
      this.$router.push({
        name: "economy",
        params: {
          activeName: this.$route.params.activeName,
          list: this.$route.params.list,
          Jump: true
        }
      });
    } else {
      if (this.$route.params.Jump) {
        this.activeName = this.$route.params.activeName;
        this.search = this.$route.params.list;
      } else {
        this.activeName = "canvassSummary";
      }
    }
  },
  activated() {
    if (this.$route.params.id == "1") {
      this.$router.push({
        name: "economy",
        params: {
          activeName: this.$route.params.activeName,
          list: this.$route.params.list,
          Jump: true
        }
      });
    }
  },
  methods: {
    //高亮标签
    selectT(item, index) {
      this.search = {};
      if (item.isLink) {
        this.$parent.selected(0);
        return this.$router.push({
          path: item.value
        });
      }
      this.activeName = item.value;
      this.movecircle_style =
        (this.$env == "outside" ? 0 : 150) +
        150 * (this.$env == "outside" ? index : index - 1);
    },
    canJump(point) {
      this.activeName = "canvassRes";
      this.point = point;
    }
  }
};
</script>
<style lang="less">
@import url("./Canvass.less");
</style>
