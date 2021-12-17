<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-12-02 17:39:04
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:50:43
-->

<style scoped>

</style>
<template>
  <div>
    <Button type="primary" shape="circle" @click="goPage('/datam')">返回</Button>
    <Button type="primary" shape="circle" @click="goPage('/datam/detail/subdetail')">全局三级路由</Button>
    <Button type="primary" shape="circle" @click="goPage('/datam/detail/nestdetail')">内嵌三级路由</Button>
    <h1>详情</h1>
    <router-view/>
  </div>
</template>
<script>
export default {
  created() {
    console.log("我到了详情页");
  },
  methods: {
    goPage( url ){
      this.$router.push({ path: url });
    }
  },
};
</script>
