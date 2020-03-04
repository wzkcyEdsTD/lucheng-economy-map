<template>
  <div class="buildPictureMap">
    <div class="buildPictureScene" v-if="mapsceneShow === '_3d' || mapsceneShow === '_3sd'">
      <!-- <sceneArcgis
        ref="scene"
        :mapsceneShow="mapsceneShow"
        :isAside="isAside"
        :lyItem="lyItem"
        :fcClick="fcClick"
        :commonSearch="commonSearch"
        :searchbox_display="searchbox_display"
      />-->

      <mapbox
        ref="scene"
        :isAside="isAside"
        :lyItem="lyItem"
        :fcClick="fcClick"
        :commonSearch="commonSearch"
        :searchbox_display="searchbox_display"
      ></mapbox>
    </div>
    <div class="PictureMap2" v-if="mapsceneShow === '2d' || mapsceneShow === '_25d'">
      <mapArcgis
        id="PictureMap2"
        ref="buildMap"
        :mapsceneShow="mapsceneShow"
        :forceBuildingId="forceBuilding.gdid"
      />
    </div>
    <div class="panelSwitch" v-if="searchbox_display">
      <ul>
        <li
          v-for="(item,index) in panel"
          :key="index"
          :class="{panelSwitchAside:index == current}"
          @click="setAside(index,item)"
        >{{item}}</li>
      </ul>
      <!-- <span :class="isAside?'panelSwitchAside':''" @click="setAside(true)">闲置分析</span>
      <span :class="!isAside?'panelSwitchAside':''" @click="setAside(false)">三维沙盘</span>-->
    </div>
    <transition name="frame">
      <searchBox v-show="searchbox_display" ref="searchBox" @changeForceBuild="changeForceBuild" />
    </transition>
    <transition name="frame">
      <buidInform
        ref="buidInform"
        @showAround="showAround"
        @closeAround="closeAround"
        v-if="buidinform_dispaly"
        :forceBuilding="forceBuilding"
        :showAsideList="showAsideList"
        :_asideList="asideList"
        :isAroundBtn="true"
        :checklistShow="checklistShow"
        key="buidInform"
      />
    </transition>
    <div id="Est_moving">
      <hoverPanel @changeMapTool="changeMapTool" :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import mapbox from "../mapbox/mapbox/mapbox";

// import sceneArcgis from "./buildPictureScene";
import mapArcgis from "../BuildCommon/buildMap";
import searchBox from "./searchBox";
import buidInform from "@/components/common/buildFrame/buidInform";
import hoverPanel from "@/components/building/BuildCommon/hoverPanel";
import hoverPanelConfig from "@/components/building/BuildCommon/hoverPanelConfig";
export default {
  name: "buildpic",
  data() {
    return {
      buidinform_dispaly: false,
      searchbox_display: true,
      // isAside: true,
      isAside: "闲置分析",
      showAsideList: false,
      asideList: {},
      forceBuilding: {},
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      mapsceneShow: "_3sd",
      lyItem: null,
      fcClick: false,
      checklistShow: true,
      commonSearch: {},
      build_gdid: null,
      panel: ["闲置分析", "三维沙盘", "控制性规划"],
      current: 0
    };
  },
  components: {
    searchBox,
    buidInform,
    hoverPanel,
    /* sceneArcgis, */ mapArcgis,
    mapbox
  },
  props: {
    building: String,
    title: String,
    item: Object,
    search: Object
  },
  watch: {
    item: {
      handler(newVal, val) {
        this.lyItem = newVal.固定id;
        this.forceBuilding = { gdid: newVal.固定id };
      }
    },
    build_gdid(newVal, val) {
      this.$refs.searchBox.fetchBuild(newVal);
    }
    // search: {
    //   handler(newVal, val) {
    //     this.commonSearch = newVal.features[0].attributes.固定id;
    //     this.forceBuilding = { gdid: newVal.features[0].attributes.固定id };
    //   },
    //   immediate: true
    // }
  },
  created() {
    if (this.$route.params.list) {
      this.commonSearch = this.$route.params.list.features[0].attributes.固定id;
      this.forceBuilding = {
        gdid: this.$route.params.list.features[0].attributes.固定id
      };
    }
  },
  activated() {
    if (this.$route.params.list) {
      this.commonSearch = this.$route.params.list.features[0].attributes.固定id;
      this.forceBuilding = {
        gdid: this.$route.params.list.features[0].attributes.固定id
      };
    }
  },
  mounted() {},
  computed: {},
  methods: {
    showAround(params) {
      this.$refs.scene.showAround(params);
    },
    closeAround() {
      console.log("close-around");
      this.$refs.scene.closeAround();
    },
    setAside(index, tag) {
      this.current = index;
      this.isAside = tag;
    },
    changeForceBuild(item, shallAside) {
      this.showAsideList = shallAside;
      this.asideList = item;
      this.forceBuilding = { gdid: item.gdid };
      this.$refs.scene.fetchBuild({ name: "buildid", val: item.gdid });
    },
    changeMapTool(_option) {
      for (let d in _option) {
        const item = _option[d];
        if (item.check) {
          this.mapsceneShow = item.id;
        }
        for (let _d in item.children) {
          const _item = item.children[_d];
          _item.id == "_3d_model" && _item.check && (this.isAside = false);
          _item.id == "_3d_analyze" && _item.check && (this.isAside = true);
        }
      }
    },
    fetchCompany(uuid) {
      this.$refs.scene.fetchCompany(uuid);
    },
    changeMapLoc(isOffset) {
      this.$refs.scene.changeMapLoc(isOffset);
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./_buildPicture.less");
</style>