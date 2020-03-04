<template>
  <div class="canvassRes_summary" >
    <div class="top">
      <ul>
        <li
          v-for="(item,index) in lists"
          :key="index"
          :class="activeName == item.value ? 'li_tab_active':''"
        >
          <input type="radio" name="leftMenu" v-model="activeName" :value="item.value" />
          <span class="b-radio"></span>
          {{item.title}}
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="rightContainer">
        <transition enter-class="fade-in-enter" enter-active-class="fade-in-active">
          <components :is="activeName" :fromCanvass="true" :canvassResSearch="canvassResSearch" ref="Summary"></components>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import canvassRes from "@/components/canvass/CanvassRes/canvassRes.vue";
import canvassQJ from "@/components/canvass/CanvassQJ/canvassQJ.vue";
export default {
  name: "canvassRes_summary",
  data() {
    return {
      activeName: "canvassRes",
      lists: [
        { value: "canvassRes", title: "招商资源" },
        { value: "canvassQJ", title: "VR视角" }
      ],
      canvassResSearch: {}
    };
  },
  components: { canvassRes, canvassQJ },
  props: {
    search: Object
  },
  watch: {
    search: {
      handler(newVal, val) {
        this.canvassResSearch = newVal;
      },
      immediate: true
    }
  }
};
</script>

<style scoped lang="less">
@import url("./canvassResSummary.less");
</style>