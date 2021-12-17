<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-11-04 13:45:49
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:46:48
-->

<style scoped>

</style>
<template>
  <div>
    <Button type="primary" shape="circle" @click="goPage('/datam/detail')">详情</Button>
    <h1>数据</h1>
  </div>
</template>
<script>
export default {
  created() {
    console.log("我到了数据管理");
  },
  methods: {
    goPage( url ){
      this.$router.push({ path: url });
    }
  }
};
</script>
