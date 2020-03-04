<template>
  <div class="lucheng Land">
    <header>
      <ul>
        <li
          v-for="(item, key, index) in lists "
          :key="index"
          :title="item.value == 'landHero' && !rland?'无权限':''"
          @click="selectT(item.value)"
          :class="{active:activeName==item.value,li_tab_active:activeName==item.value,unable:item.value == 'landHero' && !rland}"
        >{{item.title}}</li>
      </ul>
    </header>
    <div class="page_container">
      <transition enter-class="fade-in-enter" enter-active-class="fade-in-active">
        <!-- <keep-alive include="landNone"> -->
        <components :company="company" :is="activeName" :search="search" ref="StyleTool"></components>
        <!-- </keep-alive> -->
      </transition>
    </div>
  </div>
</template>

<script>
// import land from "./Land/land.vue";
import landNone from "./LandNone/landNone.vue";
import landHero from "./LandHero/landHero.vue";
// import landRank from "./LandRank/landRank.vue";
export default {
  name: "land",
  data() {
    return {
      activeName: "landNone",
      company: null,
      lists: [
        // { value: "land", title: "用地总述" },
        { value: "landNone", title: "地块画像" },
        { value: "landHero", title: "亩均论英雄" }
        // { value: "landRank", title: "英雄排行版" }
      ],
      search: {},
      rland: false
    };
  },
  components: { landNone, landHero },
  props: {},
  created() {
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
        this.activeName = "landNone";
      }
      this.rland = this.$window.user.rland;
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
  mounted() {},
  computed: {},
  methods: {
    //高亮标签
    selectT(value) {
      if (value == "landHero" && !this.rland) {
        return;
      }
      this.activeName = value;
    },
    Search() {}
  }
};
</script>
<style lang="less" scoped>
.Land {
  .unable {
    cursor: not-allowed !important;
    text-shadow: unset !important;
    color: #ddd !important;
  }
}
</style>
