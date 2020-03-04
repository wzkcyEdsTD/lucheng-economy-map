<template>
  <div class="Com_content canvR_container">
    <div class="Com_map">
      <commonArcgis id="QjMap" ref="QjMap" v-show="show2dMap" :mapTool="mapTool" :type="type" />
    </div>
    <div class="Com_container" id="can_container">
      <div
        class="left"
        :class="`animated ${icon_show_left?`slideOutLeft`:`slideInLeft`} topLeft  `"
      >
        <div class="leftSelect">
          <div class="topic">
            <header>
              专题展示
              <span class="stateTipHeaderBar"></span>
            </header>
            <div class="selectFrame no_select">
              <div v-for="(item,index) in this.leftOptions" :key="index">
                <span>{{item.label}}</span>
                <ul v-show="item.show">
                  <li
                    v-for="(oitem,oindex) in item.children"
                    :key="oindex"
                    :class="oitem.isSub ? 'sub':''"
                  >
                    <p :class="`${oitem.class}`" @click="showVr(oitem)">{{oitem.name}}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="blueBorder">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
        <span @click="hidden2()" class="hidden_button"></span>
      </div>
    </div>
    <div id="Est_moving">
      <hoverPanel :mapTool="mapTool" />
    </div>
    <transition name="frame">
      <QjFrame v-show="QjShow" ref="searchBox" :iframName="iframName" :iframeAddr="iframeAddr" />
    </transition>
  </div>
</template>

<script>
import commonArcgis from "@/components/canvass/CanvassArcgis/commonArcgis";
import leftMultiSelect from "@/components/common/selectRadioFrame/leftMultiSelect";
import hoverPanel from "@/components/common/selectRadioFrame/hoverPanel";
import hoverPanelConfig from "@/components/common/selectRadioFrame/hoverPanelConfig";
import framePDF from "../CanvassArcgis/framePDF";
import { WRT_config, ZSZY, OPTION } from "@/components/common/Tmap";
import { loadModules } from "esri-loader";
import QjFrame from "./QjFrame";
const { server } = WRT_config;
import $ from "jquery";
export default {
  name: "canvassRes",
  data() {
    return {
      icon_show_left: false,
      icon_show_right: false,
      show2dMap: true,
      buidinform_dispaly: false,
      server,
      mapTool: JSON.parse(JSON.stringify(hoverPanelConfig)),
      leftformdata: {
        list: [],
        value: "plot"
      },
      leftOptions: [
        {
          label: "鹿城全景",
          check: false,
          show: true,
          children: []
        }
      ],
      type: "lcqj",
      iframName: null,
      iframeAddr: null,
      QjShow: false,
      vrLink: []
    };
  },
  components: {
    commonArcgis,
    leftMultiSelect,
    hoverPanel,
    QjFrame
  },
  props: {},
  watch: {},
  created() {
    // this.mapTool["simpleStyle"]["children"]["largeDataStyle"].check = true;
    this.VrName();
  },
  mounted() {},
  methods: {
    /**
     * 关闭侧边拦
     */
    hidden2() {
      this.icon_show_left = !this.icon_show_left;
    },
    hidden3() {
      this.icon_show_right = !this.icon_show_right;
    },
    VrName() {
      const that = this;
      const _leftOptions = this.$util.clone(this.leftOptions);
      loadModules(
        ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
        OPTION
      ).then(([QueryTask, Query]) => {
        const queryTask = new QueryTask({
          url: ZSZY + "/1"
        });
        const query = new Query();
        query.outFields = ["*"];
        query.where = "1=1";
        query.returnGeometry = true;
        queryTask.execute(query).then(response => {
          const vrname = response.features.map(item => {
            return { item };
          });
          for (let v = 0; v < vrname.length; v++) {
            if (
              vrname[v].item.attributes.SHORTNAME == "印象南塘" ||
              vrname[v].item.attributes.SHORTNAME == "人民路漫游" ||
              vrname[v].item.attributes.SHORTNAME == "市中心漫游"
            ) {
              _leftOptions[0]["children"].push({
                name: vrname[v].item.attributes.SHORTNAME,
                class: "vedio"
              });
            } else {
              _leftOptions[0]["children"].push({
                name: vrname[v].item.attributes.SHORTNAME
              });
            }
            if (
              vrname[v].item.attributes.SHORTNAME == "印象南塘" ||
              vrname[v].item.attributes.SHORTNAME == "人民路漫游" ||
              vrname[v].item.attributes.SHORTNAME == "市中心漫游"
            ) {
              that.vrLink.push({
                name: vrname[v].item.attributes.SHORTNAME,
                addr: `${server}/${vrname[v].item.attributes.VR}`
              });
            } else {
              that.vrLink.push({
                name: vrname[v].item.attributes.SHORTNAME,
                addr: vrname[v].item.attributes.VR
              });
            }
          }
          that.leftOptions = _leftOptions;
        });
      });
    },
    /**
     * 左模块checkbox双向绑定更新后触发
     */
    changeLeftOption(options) {
      this.leftOptions = options;
    },
    /**
     * 左模块顶部checkbox点击触发
     */
    changeleftcheckBox(item) {
      // console.log(item)
    },
    //  图层工具状态改变
    changeMapTool(_mapTool) {
      this.mapTool = _mapTool;
    },
    changeForceBuild(item, shallAside) {
      this.showAsideList = shallAside;
      this.asideList = item;
      this.forceBuilding = { gdid: item.gdid };
      this.$refs.canMap.fetchBuild({ name: "buildid", val: item.gdid });
    },
    showVr(item) {
      const name = item.name || item;
      for (let i = 0; i < this.vrLink.length; i++) {
        this.vrLink.map(_item => {
          if (name == _item.name) {
            this.iframName = _item.name;
            this.iframeAddr = _item.addr;
          }
        });
      }
      this.QjShow = true;
    }
  }
};
</script>
 <style scoped lang="less">
.leftSelect {
  height: 100%;
  border-right: 1px solid;
  border-image: linear-gradient(
      360deg,
      rgba(7, 73, 190, 0) 0%,
      rgba(0, 172, 255, 0.4) 32%,
      rgba(0, 255, 255, 0.8) 51%,
      rgba(0, 172, 255, 0.4) 73%,
      rgba(7, 73, 190, 0) 100%
    )
    1 10;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);
  border: 1px solid rgba(7, 73, 190, 0.4);
  .vedio {
    color: #1748ab;
    font-weight: 600;
  }
  .topic {
    height: 100%;
    border-top: 1px solid;
    border-image: linear-gradient(
        270deg,
        rgba(7, 73, 190, 0.6) 0%,
        rgba(89, 199, 252, 1) 51%,
        rgba(7, 73, 190, 0.6) 100%
      )
      1 10;
    header {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 22px;
      font-weight: 700;
      color: rgba(227, 254, 254, 1);
      text-shadow: 0px 0px 4px rgba(76, 215, 236, 0.5);
      padding-left: 20px;
      .stateTipHeaderBar:before {
        content: "";
        width: 4px;
        height: 24px;
        background: #15f9fd;
        display: inline-block;
        float: left;
        margin-top: -7px;
      }

      .stateTipHeaderBar {
        width: 120px;
        height: 12px;
        background: linear-gradient(
          90deg,
          rgba(47, 253, 255, 0.5) 0%,
          rgba(21, 249, 253, 0) 100%
        );
        display: inline-block;
      }
    }
    .selectFrame {
      box-sizing: border-box;
      padding: 10px;
      text-align: left;
      span {
        display: block;
        height: 52px;
        line-height: 54px;
        width: 100%;
        height: 52px;
        background: rgba(176, 203, 243, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding-left: 12px;
        font-size: 18px;
        margin-bottom: 10px;
        i {
          cursor: pointer;
          color: #fff;
          float: right;
          padding-right: 15px;
        }
      }

      > div {
        > ul:first-child {
          // p {
          color: rgba(42, 255, 250, 1);
          // }
        }
      }
      ul::-webkit-scrollbar {
        display: none;
      }
      ul {
        width: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        height: 710px;
        .sub {
          height: 30px;
          line-height: 10px;
          margin-left: 40px;
          width: 70%;
          float: right;
          padding-left: 10px;
          position: relative;
          p {
            font-size: 16px;
            line-height: 22px;
          }
        }
        .sub:before {
          content: "|_";
          position: absolute;
          left: -20px;
          top: 4px;
        }
        li {
          height: 44px;
          line-height: 28px;
          list-style: none;
          width: 100%;
          background: rgba(176, 203, 243, 0.1);
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px;
          padding-left: 22px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          p {
            font-size: 18px;
            cursor: pointer;
            img {
              width: 24px;
              height: 24px;
              margin-right: 10px;
              position: relative;
              top: 6px;
            }
            span {
              background: unset;
              background-color: unset;
              width: unset;
              height: unset;
              padding: unset;
              margin-bottom: unset;
              display: unset;
              font-size: unset;
              line-height: unset;
              box-shadow: none;
              border: unset;
            }
          }
        }
      }
    }
  }
}
</style>
