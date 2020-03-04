<template>
  <div class="canvass_summary">
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
          <components :is="activeName" :fromCanvass="true" :canvssSearch="canvssSearch" ref="Summary"></components>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import canvassBusiness from "@/components/canvass/CanvassBusiness/canvassOverview.vue";
import ecoChar from "@/components/economy/EcoChar/ecoChar.vue";
import ecoCompany from "@/components/economy/EcoCompany/ecoCompany.vue";
import ecoEstate from "@/components/economy/EcoEstate/ecoEstate.vue";
import ecoForm from "@/components/economy/EcoForm/ecoForm.vue";
export default {
  name: "canvass_summary",
  data() {
    return {
      activeName: "canvassBusiness",
      lists: [
        { value: "canvassBusiness", title: "区位优势" },
        { value: "ecoCompany", title: "产业布局" },
        { value: "ecoEstate", title: "经济特色" },
        { value: "ecoChar", title: "街镇特色" },
        { value: "ecoForm", title: "经济指标" }
      ],
      canvssSearch:{}
    };
  },
  components: { canvassBusiness, ecoChar, ecoCompany, ecoEstate, ecoForm },
  props:{
    search:Object
  },
  watch:{
    search:{
      handler(newVal,val){
        if(!newVal) return
        this.canvssSearch = newVal;
      },
      immediate:true
    }
  }
};
</script>

<style scoped lang="less">
@import url("./canvassSummary.less");
</style>