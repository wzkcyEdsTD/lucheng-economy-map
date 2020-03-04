<template>
  <div class="lucheng">
    <header>
      <div>
        <ul>
          <li
            v-for="(item, key, index) in lists "
            :key="index"
            @click="selectT(item.value)"
            :class="{active:activeName==item.value,li_tab_active:activeName==item.value}"
          >{{item.title}}</li>
        </ul>
      </div>
    </header>
    <div class="page_container" >
      <transition enter-class="fade-in-enter" enter-active-class="fade-in-active">
        <!-- <keep-alive include="ecoestate,ecoCompany"> -->
        <components :is="activeName" :indexsearch="indexsearch" ref="StyleTool" ></components>
        <!-- </keep-alive> -->
      </transition>
      <!--<ecoChar v-if="show" @backParent="backParent()" />-->
    </div>
    <!-- <router-view :key="key" /> -->
  </div>
</template>

<script>
import ecoChar from "./EcoChar/ecoChar.vue";
import ecoCompany from "./EcoCompany/ecoCompany.vue";
//import ecoCompetition from "./EcoCompetition/ecoCompetition.vue";
import ecoEstate from "./EcoEstate/ecoEstate.vue";
import ecoForm from "./EcoForm/ecoForm.vue";
export default {
  name: "econnomt",
  data() {
    return {
      activeName: "ecoCompany",
      lists: [
        { value: "ecoCompany", title: "产业布局" },
        /*{ value: "ecoCompetition", title: "街镇比拼" },*/
        { value: "ecoEstate", title: "经济特色" },
        { value: "ecoChar", title: "街镇特色" },
        { value: "ecoForm", title: "经济指标" }
      ],
      show: false,
      indexsearch: {}
    };
  },
  components: { ecoChar, ecoCompany, ecoEstate, ecoForm },
  props: {},
  created() {
    if (this.$route.params.Jump) {
      this.activeName = this.$route.params.activeName;
      this.indexsearch = this.$route.params.list;
    } else {
      this.activeName = "ecoCompany";
    }
  },
  activated() {
    if (this.$route.params.Jump) {
      this.activeName = this.$route.params.activeName;
      this.indexsearch = this.$route.params.list;
    } else {
      this.activeName = "ecoCompany";
    }
  },
  // beforeDestroy(){
  //   this.indexsearch = "";
  // },
  mounted() {},
  computed: {},
  methods: {
    //高亮标签
    selectT(value) {
      this.indexsearch = {};
      this.$parent.chooseStyle = false;
      this.$nextTick(() => {
        this.activeName = value;
      });
    },
    //经济一张图跳转到街镇特色
    jump(x, y) {
      this.activeName = "ecoChar";
      //console.log(x,y)
      //this.$refs.ecoChar.charJump(x,y);
      //console.log(x,y)
    },
    //经济形态跳转到街镇特色
    FormJump() {
      this.activeName = "ecoChar";
    }
  }
};
</script>
<style scoped lang="less"></style>
