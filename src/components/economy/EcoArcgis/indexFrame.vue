<template>
  <div class="indexFrame" :style="{left:changeLeft +'px'}">
    <span class="_line" />
    <div class="frame">
      <div>
      <div class="title">
        {{info['名称']}}
        <i class="iconfont iconRectangleCopy" @click="close()" style="float:right;color:#fff;cursor: pointer;"></i>
      </div>
      <div class="info">
        <div class="info_content">
          <div class="base_info">
            <div class="jc_title">基础信息</div>
            <div class="info_xq">
              <div class="xq_text">
                <ul>
                  <li v-for="(item,key,index) in info" :key="index">
                    <span>{{key}}:</span>
                    <span>{{item}}</span>
                  </li>
                </ul>
              </div>
              <img
                :src="`${server}/icon/tsjjImg/${this.info_name}.png`"
                @load="showisImg($event)"
                @error="errorImg()"
                @click="clickImg($event)" 
                v-show="isImg"
              />
            </div>
            <div class="jj" v-if="this.jj">
              <div class="jc_title">简介</div>
              <span class="jj_text">{{this.jj}}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <span class="_line" />
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="`${server}/icon/tsjjImg/${this.info_name}.png`"></bigimg>
  </div>
</template>

<script>
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
import bigImg from "./bigImg";
export default {
  name: "frame",
  data() {
    return {
      info: [],
      imgBName: null,
      isShow: null,
      jj: null,
      info_name: null,
      server,
      noneImg: `${server}/icon/commonIcon/noImg.png`,
      showImg:false,
      changeLeft:"30",
      isImg:true
    };
  },
  components: {bigImg},
  props: { indexForce: Object,Left:String },
  created() {},
  mounted() {},
  computed: {},
  watch: {
    indexForce: {
      handler(obj, val) {
        if (obj.type == 1) {
          let _info = {
            名称: obj.name || "-",
            "税收(万元)": obj.ss || "-",
            营业面积: obj.yymj || "-",
            占地面积: obj.zdmj || "-",
            入驻商户: obj.rzsh || "-",
            "年交易额(亿元)": obj.njye || "-",
            地址: obj.address || "-",
            市场运营负责单位: obj.dw || "-"
          };
          this.info = _info;
          this.jj = obj.jj || "-";
          this.info_name = `${this.info.名称}`;
        } else if (obj.type == 3) {
          let _info = {
            名称: obj.name || "-",
            属地街道: obj.ssjd || "-",
            入驻率: obj.rzrate || "-",
            员工数: obj.ygs || "-",
            总面积: obj.area || "-",
            产业定位: obj.cydw || "-",
            入驻企业数: obj.rzqys || "-",
            "租金(元/平方米/月)": obj.rent || "-",
            "物业费（元/平方米/月）": obj.wyrent || "-",
            地址: obj.address || "-",
            业主单位: obj.yzdw || "-",
            物业公司名称: obj.wygs || "-",
            备注: obj.bz || "-"
          };
          this.info = _info;
          this.jj = null;
          this.info_name = `${this.info.名称}`;
        } else if (obj.type === "4") {
          let _info = {
            名称: obj.name || "-",
            所属街道: obj.ssjd || "-",
            地址: obj.address || "-"
          };
          this.info = _info;
          this.jj = null;
          this.info_name = `${this.info.名称}`;
        } else if (obj.type == 2) {
          let _info = {
            名称: obj.name || "-",
            责任单位: obj.duty || "-",
            建设性质: obj.buildtype || "-",
            完成率: obj.rate || "-",
            总投资: obj.invest || "-",
            "2019年投资": obj.invest2019 || "-",
            "1-6月投资": obj.investhalf || "-",
            "2019年形象进度计划": obj.plan2019 || "-",
            "1-6月情况": obj.planhalf || "-",
            建设内容: obj.buildinfo || "-"
          };
          this.jj = null;
          this.info = _info;
          this.info_name = `${this.info.名称}`;
        }else if(obj.type == 0){
          let _info = {
            名称: obj.name || "-",
            类型: obj.param || "-",
            所属街道: obj.ssjd || "-"
          };
          this.jj = obj.jj;
          this.info = _info;
          this.info_name = `${this.info.名称}`;
        }
      },
      immediate: true
    },
    Left:{
      handler(newVal,val){
        this.changeLeft = newVal;
      }
    }
  },
  methods: {
    show(index) {
      this.isShow = index;
    },
    close() {
      this.$emit("close");
    },
    errorImg() {
      this.isImg =false;
    },
    clickImg(e) {
      this.showImg = true;
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg(){
      this.showImg = false;
    },
    showisImg(e){
       this.isImg =true;
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./indexFrame.less");
</style>



