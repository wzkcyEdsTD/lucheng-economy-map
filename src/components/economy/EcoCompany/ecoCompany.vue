<template>
  <div class="Com_content ecoCompany">
    <div class="Com_map">
      <commonArcgis
        id="estCompanyMap"
        ref="ecoMap"
        company="company"
        :mapTool="mapTool"
        :forceTableCompany="forceTableCompany"
        :icon_show_left="icon_show_left"
        :treePoint="treePoint"
        :treeHeat="treeHeat"
        :leftOptions="leftOptions"
        :Plate="Plate"
        :tag="tag"
        :shallHeat="shallHeat"
        :fromCanvass="fromCanvass"
        :moveLeft="moveLeft"
        :CommonResult="CommonResult"
      />
    </div>
    <div class="Com_container">
      <div
        class="left"
        :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`} ${fromCanvass? `topLeft`:``}`"
      >
        <div class="stateTip">
          <div class="stateTree">
            <div class="stateTitle">
              <i>产业板块</i>
              <span>
                <input type="checkbox" v-model="leftOptions[0].children[0].check" />
              </span>
            </div>
            <div class="stateTitlePlate" v-for="(item,index) in Plate" :key="index">
              <span>
                <i>{{item.label}}</i>
                <span>
                  <input
                    type="checkbox"
                    v-model="item.check"
                    @change="changeBox(item.check,index)"
                    @click="stop($event)"
                  />
                </span>
              </span>
              <span class="child" v-for="(_item,_index) in item.children" :key="_index">
                <i>
                  <img :src="_item.img" v-if="_item.img" />
                  {{_item.name}}
                </i>
                <span>
                  <input type="checkbox" v-model="_item.check" @change="changeTree(item)" />
                </span>
              </span>
            </div>
            <div class="stateTitle">
              <i>产业分布</i>
              <span>
                <span :class="`${fromCanvass? `tbShow`:``}`">
                  <input type="checkbox" v-model="allSelected" @change="selectAll()" />图标
                </span>
                <span>
                  <input type="radio" value="全部" v-model="heatChecked" @change="optionHeatChange" />热力
                </span>
                <input type="checkbox" v-model="shallHeat" />
              </span>
            </div>
            <div class="stateTreeSelect">
              <div v-for="(item,index) in treeOption" :key="index">
                <span
                  style="background:rgba(120,171,246,0.2);box-shadow:0px 2px 4px 0px rgba(0,0,0,0.1);"
                >
                  <i style="color: #2AFFFA;">
                    <img :src="item.img" />
                    {{item.label}}
                  </i>
                  <span>
                    <span :class="`${fromCanvass? `tbShow`:``}`">
                      <input
                        type="checkbox"
                        v-model="item.point"
                        @change="optionTreeChange(true,index)"
                      />图标
                    </span>
                    <span>
                      <input
                        type="radio"
                        :value="item.label"
                        v-model="heatChecked"
                        @change="optionHeatChange"
                      />热力
                    </span>
                  </span>
                </span>
                <span class="child" v-for="(_item,_index) in item.children" :key="_index">
                  <i>{{_item.key}}</i>
                  <span>
                    <span :class="`${fromCanvass? `tbShow`:``}`">
                      <input
                        type="checkbox"
                        v-model="_item.point"
                        @change="optionTreeChange(false)"
                      />图标
                    </span>
                    <span>
                      <input
                        type="radio"
                        :value="_item.key"
                        v-model="heatChecked"
                        @change="optionHeatChange"
                      />热力
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="blueBorder">
          <p></p>
          <p></p>
          <p></p>
          <p></p>
        </div>
        <span @click="hidden2()" class="hidden_button"></span>
      </div>
      <commonSearch @JumpecoCompany="JumpecoCompany" :CommonfromCanvass="CommonfromCanvass" />
      <div class="intro" v-if="introShow">
        <ul>
          <li>
            <span>序号</span>
            <span>八区名称</span>
          </li>
          <li v-for="(item,index) in lq" :key="index" @click="lqListClick(item.name)">
            <span>{{++index}}</span>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
  </div>
</template>

<script>
import commonArcgis from "@/components/economy/EcoArcgis/commonArcgis";
import ecoCompanyTable from "@/components/economy/EcoCompany/ecoCompanyTable";
import commonSearch from "@/components/common/commonSearch/commonSearch.vue";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import qyzcApi from "@/api/beans/u_qyzc";
import indexApi from "@/api/beans/u_index";
import { loadModules } from "esri-loader";
import { OPTION, CYBJ, WRT_config } from "@/components/common/Tmap";
import { JJTS } from "../../common/Tmap";
const { server } = WRT_config;
export default {
  name: "ecoCompany",
  data() {
    return {
      icon_show_left: false,
      icon_show_right: false,
      searchName: "",
      forceTableCompany: null,
      tableData: [],
      mapTool: this.$util.clone(hoverPanelConfig),
      treePoint: [],
      treeHeat: [],
      shallHeat: false,
      // 复选框全选
      allSelected: false,
      moveRight: "350",
      moveLeft: "30",
      introShow: true,
      tag: "产业布局",
      // 默认热力图选中
      heatChecked: "全部",
      leftOptions: [
        {
          label: "国土信息",
          check: false,
          show: true,
          children: [
            {
              name: "产业板块",
              id: "chanyePlate",
              fun: "addChanyePlate",
              check: true
            }
          ]
        }
      ],
      Plate: [
        {
          label: "一带一园七区",
          check: true,
          show: true,
          children: [
            {
              name: "一带",
              id: "yilang",
              fun: "addyilang",
              check: true,
              img: `${server}/icon/commonIcon/一廊横贯.png`
            },
            {
              name: "一园",
              id: "yiyuan",
              fun: "addyiyuan",
              check: true,
              img: `${server}/icon/commonIcon/八大平台.png`
            },
            {
              name: "七区",
              id: "liuqu",
              fun: "addChanye",
              check: true,
              img: `${server}/icon/commonIcon/八大平台.png`
            }
          ]
        }
      ],
      treeOption: [
        {
          heat: false,
          point: false,
          key: 1,
          label: "第一产业",
          img: `${server}/icon/commonIcon/一.png`,
          children: [{ heat: false, point: false, key: "农林牧渔业" }]
        },
        {
          heat: false,
          point: false,
          key: 2,
          label: "第二产业",
          img: `${server}/icon/commonIcon/二.png`,
          children: [
            { heat: false, point: false, key: "装备制造" },
            { heat: false, point: false, key: "鞋材、鞋业" },
            { heat: false, point: false, key: "其他" }
          ]
        },
        {
          heat: false,
          point: false,
          key: 3,
          label: "第三产业",
          img: `${server}/icon/commonIcon/三.png`,
          children: [
            { heat: false, point: false, key: "房地产业" },
            { heat: false, point: false, key: "交通运输、仓储和邮政业" },
            { heat: false, point: false, key: "金融业" },
            { heat: false, point: false, key: "批发和零售业" },
            { heat: false, point: false, key: "其他服务业" },
            {
              heat: false,
              point: false,
              key: "信息传输、软件和信息技术服务业"
            },
            { heat: false, point: false, key: "住宿和餐饮业" }
          ]
        }
      ],
      lq: [],
      CommonfromCanvass: false,
      CommonResult: {},
      StyleColor: "zqs"
    };
  },
  components: {
    commonArcgis,
    ecoCompanyTable,
    hoverPanel,
    commonSearch
  },
  props: {
    // 嵌入canvass模块左侧栏置顶
    fromCanvass: Boolean,
    indexsearch: Object,
    canvssSearch: Object
  },
  created() {
    //this.optionTreeChange(true);
    this.createSix();
  },
  mounted() {
    this.fetchCompany();
    this.setHeatList();
  },
  watch: {
    heatChecked() {
      this.setHeatList();
    },
    searchName(val) {
      if (!val) {
        this.icon_show_right = false;
        // this.moveRight = "350";
      }
    },
    fromCanvass: {
      handler(newVal, val) {
        this.CommonfromCanvass = newVal;
      },
      immediate: true
    },
    indexsearch: {
      handler(newVal, Val) {
        if (!newVal) return;
        this.CommonResult = newVal;
      },
      immediate: true
    },
    canvssSearch: {
      handler(newVal, Val) {
        if (!newVal) return;
        this.CommonResult = newVal;
      },
      immediate: true
    }
  },
  computed: {},
  methods: {
    //  选中热力图层，默认开启热力图开关
    optionHeatChange() {
      this.$nextTick(() => {
        this.shallHeat = true;
      });
    },
    // 复选框选择改变事件
    optionTreeChange(isFa, idx) {
      const _option = this.$util.clone(this.treeOption);
      const _point = [];
      if (isFa) {
        _option[idx].children = _option[idx].children.map(d => {
          return { ...d, point: this.treeOption[idx].point };
        });
        let j = 0;
        this.treeOption.map((item, index) => {
          let i = 0;
          _option[index].children = _option[index].children.map(d => {
            if (d.point) {
              _point.push(d.key);
              i++;
            }
            return { ...d };
          });
          if (i == _option[index].children.length) {
            _option[index].point = true;
            j++;
          } else {
            _option[index].point = false;
            this.allSelected = false;
          }
          _option[index].children.map(d => {
            d.point && _point.push(d.key);
          });
        });
        if (j == _option.length) {
          this.allSelected = true;
        }
        this.treeOption = _option;
        this.treePoint = [...new Set(_point)];
      } else {
        let j = 0;
        this.treeOption.map((item, index) => {
          let i = 0;
          _option[index].children = _option[index].children.map(d => {
            if (d.point) {
              _point.push(d.key);
              i++;
            }
            return { ...d };
          });
          if (i == _option[index].children.length) {
            _option[index].point = true;
            j++;
          } else {
            _option[index].point = false;
            this.allSelected = false;
          }
          _option[index].children.map(d => {
            d.point && _point.push(d.key);
          });
        });
        if (j == _option.length) {
          this.allSelected = true;
        }
        this.treeOption = _option;
        this.treePoint = [...new Set(_point)];
      }
    },
    // 全选事件
    selectAll() {
      const _option = this.$util.clone(this.treeOption);
      const _point = [];

      this.treeOption.map((item, index) => {
        _option[index].children = _option[index].children.map(d => {
          return { ...d, point: this.allSelected };
        });

        _option[index].point = this.allSelected;

        _option[index].children.map(d => {
          d.point && _point.push(d.key);
        });
      });

      this.treeOption = _option;
      this.treePoint = [...new Set(_point)];
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    //  search company
    fetchCompany() {
      const arr = [];
      this.searchName
        ? arr.push(
            `a.name like '%${this.searchName}%' or a.uuid like '%${this.searchName}%' or a.fddbr like '%${this.searchName}%' `
          )
        : null;
      const where = arr.join(" and ");
      const count = this.searchName ? 100 : 1000;
      qyzcApi.ds({ where, count }).then(({ data }) => {
        this.tableData = data;
        this.searchName && (this.icon_show_right = true);
        // this.icon_show_right
        //   ? (this.moveRight = "410")
        //   : (this.moveRight = "75");
      });
    },
    // 热力图选择
    setHeatList() {
      this.treeHeat = [];
      this.treeHeat.push(this.heatChecked);

      if (this.treeHeat[0] === "全部") {
        this.treeHeat = [
          "农林牧渔业",
          "装备制造",
          "鞋材、鞋业",
          "其他",
          "房地产业",
          "交通运输、仓储和邮政业",
          "金融业",
          "批发和零售业",
          "企业服务业",
          "信息传输、软件和信息技术服务业",
          "住宿和餐饮业"
        ];
      }

      if (this.treeHeat[0] === "第一产业") {
        this.treeHeat = ["农林牧渔业"];
      } else if (this.treeHeat[0] === "第二产业") {
        this.treeHeat = ["装备制造", "鞋材、鞋业", "其他"];
      } else if (this.treeHeat[0] === "第三产业") {
        this.treeHeat = [
          "房地产业",
          "交通运输、仓储和邮政业",
          "金融业",
          "批发和零售业",
          "企业服务业",
          "信息传输、软件和信息技术服务业",
          "住宿和餐饮业"
        ];
      }
    },
    changeTree(item) {
      this.intercept();
    },
    changeBox(item, index) {
      const c = this.Plate[index].check;
      for (let i in this.Plate[index].children) {
        this.Plate[index].children[i].check = c;
      }
    },
    stop(e) {
      e.stopPropagation();
    },
    intercept() {
      const _Plate = this.$util.clone(this.Plate);
      for (let i = 0; i < _Plate.length; i++) {
        const shall = true;
        _Plate[i].children.length
          ? _Plate[i].children.map(item => {
              if (!item.check) {
                shall = false;
              }
            })
          : (shall = false);
        _Plate[i].check = shall;
      }
      this.Plate = _Plate;
    },
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
      if (this.icon_show_left) {
        this.moveLeft = "30";
        // this.moveRight = "30";
      } else {
        this.moveLeft = "410";
        // this.moveRight = "350";
      }
    },
    JumpecoCompany(val) {
      this.$parent.activeName == val ? "" : (this.$parent.activeName = val);
    },
    //六区
    createSix() {
      indexApi.cypt().then(({ data }) => {
        if (!data.length) return;
        this.lq = data;
      });
    },
    lqListClick(_name) {
      this.$refs.ecoMap.indexPoint(_name);
      const that = this;
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query, Graphic, PictureMarkerSymbol]) => {
        const queryTask = new QueryTask({
          url: CYBJ + "/0"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = `name1009='${_name}'`;
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          if (response.features.length) {
            const obj = response.features[0].geometry;
            this.$refs.ecoMap.setLocationSymbol(response.features[0].geometry);
            this.$refs.ecoMap.view.goTo({
              center: [obj.POINT_X || obj.x, obj.POINT_Y || obj.y]
            });
          }
        });
      });
    }
  }
};
</script>
 <style scoped lang="less">
.tbShow {
  display: none;
}
@import url("./ecoCompany.less");
</style>