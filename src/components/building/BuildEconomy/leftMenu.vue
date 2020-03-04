<template>
  <div class="leftMenu">
    <div class="topic">
      <header>
        专题展示
        <!-- <span class="stateTipHeaderBar"></span> -->
      </header>
      <div class="selectFrame">
        <div v-for="(item,index) in this.tree" :key="index">
          <span>
            {{item.label}}
            <input
              type="checkbox"
              v-model="item.check"
              @change="changeBox(item, index)"
            />
            <i
              :class="`iconfont ${item.show?`icon-angle-double-up`:`icon-angle-double-down`}`"
              @click="toggleTree(item.label,index)"
            ></i>
          </span>
          <ul v-show="item.show">
            <li v-for="(oitem,oindex) in item.children" :key="oindex">
              <p :style="{'padding-left':oitem.pad +'px'}">
                <img :src="`${server}/icon/${URL}/${oitem.name}.png`" />
                {{oitem.name}}
                <span v-if="oitem.img">({{oitem.num}})</span>
              </p>
              <input type="checkbox" v-model="oitem.check" @change="changeTree(oitem)" />
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
    <div class="mapOption"></div>
  </div>
</template>

<script>
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  name: "leftMultiSelect",
  data() {
    return {
      icon_show: true,
      tree: [],
      items: {},
      server,
      URL: null
    };
  },
  components: {},
  props: { leftOptions: Array, leftformdata: Object, imgUrl: String },
  created() {
    this.tree = this.leftOptions;
    this.items = this.leftformdata;
  },
  mounted() {},
  computed: {},
  methods: {
    hidden() {
      this.icon_show = !this.icon_show;
    },
    //下拉菜单
    toggleTree(label, index) {
      for (let v in this.tree) {
        if (this.tree[v].label == label) {
          this.tree[v].show = !this.tree[v].show;
        }
      }
    },

    changeTree(item, event) {
      this.intercept(item);
    },
    stop(e) {
      e.stopPropagation();
    },
    changeBox(item, index) {
      const c = this.tree[index].check;
      for (let i in this.tree[index].children) {
        if (i < 5) {
          this.tree[index].children[i].check = c;
        }
      }
    },
    intercept(_item) {
      const _tree = this.$util.clone(this.tree);
      for (let i = 0; i < _tree.length; i++) {
        const shall = true;
        if (
          _item.name == "亿元以上" ||
          _item.name == "8千万-亿元" ||
          _item.name == "5千万-8千万" ||
          _item.name == "2千万-5千万"
        ) {
          for (let j in _tree[i].children) {
            if (j < 5) {
              _tree[i].children[j].check = false;
            }
          }
          shall = false;
        } else if (
          _item.name == "规划一批" ||
          _item.name == "建设一批" ||
          _item.name == "招商一批" ||
          _item.name == "集聚一批"
        ) {
          for (let v in _tree[i].children) {
            if (v < 5) {
              _tree[i].children.map(item => {
                if (!item.check) {
                  shall = false;
                }
              });
            }
          }
        } else {
          shall = true;
        }
        if (
          _item.check &&
          (_item.name == "规划一批" ||
            _item.name == "建设一批" ||
            _item.name == "招商一批" ||
            _item.name == "集聚一批")
        ) {
          for (let j in _tree[i].children) {
            if (j > 4) {
              _tree[i].children[j].check = false;
            }
          }
        }
        _tree[i].check = shall;
      }
      this.tree = _tree;
      this.$parent.changeLeftOption(this.tree);
    }
  },
  watch: {
    imgUrl: {
      handler(newVal, val) {
        this.URL = newVal;
      },
      immediate: true
    },
    leftOptions(newV, oldV) {
      this.tree = newV;
    }
  }
};
</script>
<style lang="less">
.leftMenu {
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 63, 189, 0.6) 0%,
    rgba(5, 53, 129, 0.6) 100%
  );
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.4),
    0px 0px 44px 0px rgba(16, 146, 236, 0.3);
  .topic {
    header {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-size: 20px;
      color: #4cd7ec;
      text-shadow: 0px 0px 4px rgba(76, 215, 236, 0.3);
      padding-left: 20px;
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
        background: rgba(216, 216, 216, 0.2);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding-left: 20px;
        font-size: 20px;
        margin-bottom: 10px;
        i {
          cursor: pointer;
          color: #fff;
          float: right;
          padding-right: 15px;
        }
      }
      ul {
        width: 100%;
        box-sizing: border-box;
        li {
          height: 44px;
          line-height: 28px;
          list-style: none;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          p {
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
              margin-right: 10px;
              position: relative;
              top: 4px;
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
          input {
            float: right;
            top: 3px;
          }
        }
      }
    }
    .map_content {
      height: 3%;
      display: flex;
    }
    .map_content div {
      width: 33%;
      padding: 2%;
    }
    .map_content span {
      color: #fff;
      font-size: 13px;
      margin-left: 5px;
    }
  }
}
</style>