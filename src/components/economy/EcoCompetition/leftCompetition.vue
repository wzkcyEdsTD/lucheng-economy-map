<template>
  <div class="leftCompetition">
    <div class="">
      <header>各街镇重点项目大比拼</header>
      <div class="icon_top" @click="cardup"><i class="iconfont icon-angle-double-up"></i></div>
      <ul class="card" :style="{ top }">
        <li v-for="(item,index) in items" :key="index" :class="`${item.isShow==true ?`show`:``}`">
          <div class="leftImg">
            <div class="card_content">
              <span>{{item.title}}</span>
              <div>
                <span class="cardtitle">{{item.name}}</span>
                <p>总投资<span class="number">{{item.money}}</span>万元</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="icon_down" @click="carddown"><i class="iconfont icon-angle-double-down"></i></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftCompetition",
  data() {
    return {
      show:true,
      activeIndex:0,
      ImgCard: require(`@/components/common/image/卡片.png`),
      items:[
        {title:'五马街道',name:'五马华盖里文旅项目1',money:'200000',isShow:false},
        {title:'五马街道',name:'五马华盖里文旅项目2',money:'200000',isShow:false},
        {title:'五马街道',name:'五马华盖里文旅项目3',money:'200000',isShow:false},
        {title:'五马街道',name:'五马华盖里文旅项目4',money:'200000',isShow:false},
        {title:'五马街道',name:'五马华盖里文旅项目5',money:'200000',isShow:false},
        {title:'五马街道',name:'五马华盖里文旅项目6',money:'200000',isShow:false}]
    };
  },
  components: {},
  props: {},
  created() {},
  mounted() {
    // this.items.splice(0,0,{isShow:true})
    // this.items.push("")
  },
  computed: {
    top() {
      return - this.activeIndex * 150 + 'px';
    }
  },
  methods: {
    cardup(){
      var v=Math.abs(this.activeIndex)
      this.items[v].isShow=true;
      if(this.activeIndex < this.items.length) {
        this.activeIndex += 1;
      } else {
        this.activeIndex = 0;
      }
      var k=this.items.length-1;
      this.items.push({title:'五马街道',name:'五马华盖里文旅项目1',money:'200000',isShow:false});
      // this.items.splice(0,1)
    },
    carddown(){
      if(this.activeIndex>0){
        var v=Math.abs(this.activeIndex)-1
        this.items[v].isShow=false;
        this.activeIndex -= 1;
        this.items.splice(this.items.length-1,1)
      }
      // else{
      //   this.items.splice(0,0,{title:'五马街道',name:'五马华盖里文旅项目1',money:'200000',isShow:true})
      //   this.activeIndex -= 1;
      //   this.items[0].isShow=false;
      // }
    }
  }
};
</script>
 <style lang="less">
.leftCompetition {
  height: 100%;
  width: 100%;
  padding: 10px 0px 0px 10px;
  > div {
    width: 100%;
    height: 100%;
    header{
      text-align: left;
      color: rgba(85, 167, 232, 1);
      padding: 5px 0px 5px 10px;
      font-size: 25px;
    }
    .icon_top{
      width: 25%;
      background-color: #55a7e8;
      padding: 3px 0 3px 0;
      border-radius: 7px;
      position: fixed;
      z-index: 1000
    }
    .card{
      width: 100%;
      height: 100%/6*8;
      position: relative;
      transition: all .5s;
      // top: -150px;
      >li{
        width: 100%;
        height: 10%;
        padding: 10px 0 5px 0;
        position:absolute;
        .leftImg{
          background-image: url(/img/卡片.b8db144f.png);
          width: 82%;
          height: 75%;
          border-radius: 25px;
          padding: 20px 30px;
          .card_content{
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            >span{
              width: 25%;
              height: 100%;
              display: flex;
              float: left;
              justify-content: center;
              line-height: 6;
            }
            >div{
              width: 75%;
              height: 100%;
              float: right;
              .cardtitle{
                display: block;
                color: rgb(240, 169, 16);
                padding: 20px 0 10px 0;
              }
              .number{
                color: rgb(18, 32, 233);
                font-size: 23px
              }
              p{
                font-size: 20px
              }
              span{
                font-size: 20px
              }
            }
          }
        }
      }
      li:first-child{
        top: 2%
      }
      li:nth-child(2){
        top: 13%
      }
      li:nth-child(3){
        top: 24%
      }
      li:nth-child(4){
        top: 35%
      }
      li:nth-child(5){
        top: 46%
      }
      li:nth-child(6){
        top: 57%
      }
      li:nth-child(7){
        top: 68%
      }
      li:nth-child(8){
        top: 79%
      }
    }
    .icon_down{
      width: 25%;
      background-color: #55a7e8;
      padding: 3px 0 3px 0;
      border-radius: 7px;
      position: fixed;
      bottom: 19px;
    }
  }
}
// .card li {
//   animation: fadeIn 2s 1s linear;
// }
// @keyframes fadeIn {
//     0% {
//       opacity: 1
//     }
//     50%{
//       opacity: 0;
//     }
//     100% {
//         opacity: 1
//     }
// }
.show{
  display: none;
  // transition: all .5s;
}
</style>



