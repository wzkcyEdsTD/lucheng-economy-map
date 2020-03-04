<template>
  <div class="Com_content buildLcgf">
    <div class="Com_map middle">
      <mapArcgis id="buildLcgf_map" :mapTool="mapTool" ref="arcgis" :leftOptions="leftOptions" />
    </div>
    <div class="Com_container">
      <div class="left">
        <div :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`}  `">
          <leftMultiSelect :leftOptions="leftOptions" />
          <span @click="()=>{icon_show_left=!icon_show_left}" class="hidden_button"></span>
        </div>
      </div>
      <div class="right" :class="`animated ${icon_show_right?`slideInRight`:`slideOutRight`}  `">
        <!--  表格特殊化 不做可配置  -->
        <buildLcgfTable ref="buildLcgfTables" />
        <span @click="()=>{icon_show_right=!icon_show_right}" class="hidden_right_button"></span>
      </div>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import mapArcgis from "../BuildLcgf/Arcgis";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
import buildLcgfTable from "@/components/building/BuildLcgf/buildLcgfTable";

export default {
  name: "buildLcgf",
  data() {
    return {
      view: null,
      map: null,
      icon_show_left: false,
      icon_show_right: true,
      mapTool: this.$util.clone(hoverPanelConfig),
      leftOptions: [
        {
          label: "鹿城公房",
          check: true,
          show: true,
          children: [
            // {
            //   name: "公房房屋面",
            //   id: "lcgf_polygon",
            //   fun: "addLcgfPolygon",
            //   check: false
            // },
            {
              name: "公房点",
              id: "lcgf_point",
              fun: "addLcgfPoint",
              check: true
            }
          ]
        }
      ]
    };
  },
  components: { hoverPanel, mapArcgis, leftMultiSelect, buildLcgfTable },
  methods: {
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    changeLeftOption(options) {
      this.leftOptions = options;
    }
  }
};
</script>

<style scoped lang="less">
@import url("buildLcgf.less");
</style>