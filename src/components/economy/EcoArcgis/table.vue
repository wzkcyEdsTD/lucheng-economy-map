<template>
<ul>
  <li  v-for="(item,index) in list" :key = index>
    <div class="xxcentent" >
    <div>{{item}}</div>
    </div>
  </li>
</ul>
</template>

<script>
export default {
  name: "frame",
  data() {
    return {
      list: ["企业简介", "评价指标", "经济指标", "用地信息"]
    };
  },
  components: {},
  props: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {}
};
</script>
 <style lang="less">

</style>



