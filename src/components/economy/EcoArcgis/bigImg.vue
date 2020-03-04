 <template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="img-view" @click="bigImg">
      <!-- 遮罩层 -->
      <img :src="imgSrc" @error="errorImg()" />
    </div>
  </transition>
</template>

<script>
import { WRT_config } from "@/components/common/Tmap";
const { server } = WRT_config;
export default {
  data() {
    return {
      noneImg: `${server}/icon/commonIcon/noImg.png`
    };
  },
  props: ["imgSrc"], //接受图片地址

  methods: {
    bigImg() {
      // 发送事件

      this.$emit("clickit");
    },
    errorImg() {
      let img = event.srcElement;
      img.src = this.noneImg;
      img.onerror = null;
    }
  }
};
</script>

<style>
/*动画*/

/* .fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;

  transform: translate3D(0, 0, 0);
}

.fade-enter,
.fade-leave-active {
  transform: translate3D(100%, 0, 0);
} */

/* bigimg */

.img-view {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  
}
.img-view img {
  transform: translate(-300px, -50%);
  width: 600px;
  position: fixed;
  left: 50%;
  top: 50%;
}
/*不限制图片大小，实现居中*/


</style>