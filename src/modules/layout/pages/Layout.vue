<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: martin
 * @Date: 2021-11-05 11:54:21
 * @LastEditors: martin
 * @LastEditTime: 2021-12-17 10:47:35
-->

<style scoped>
.layout {
  background: #f5f7f9;
  position: relative;
}
.layout-breadcrumb {
  padding: 10px 15px 0;
}
.layout-content {
  min-height: 500px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}
.layout-content-main {
  padding: 10px;
}
.layout-copy {
  text-align: center;
  padding: 10px 0 20px;
  color: #9ea7b4;
}
.layout-menu-left {
  background: #464c5b;
}
.layout-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 100%;
  height: 60px;
  line-height: 30px;
  font-color: #fff;
  background: #5b6270;
}
.menu-btn {
  width: 100%;
  height: 50px;
  background: red;
}
</style>
<template>
  <div class="layout">
    <Row type="flex">
      <i-col span="4" class="layout-menu-left">
        <Menu active-name="1" theme="dark" width="auto">
          <div class="layout-logo-left"></div>
          <Menu-item name="1" @click.native="goPage('Dashboard')">
            <Icon type="ios-navigate"></Icon>
            <span class="layout-text">首页</span>
          </Menu-item>
          <Menu-item name="2" @click.native="goPage('Datam')">
            <Icon type="ios-keypad"></Icon>
            <span class="layout-text">数据</span>
          </Menu-item>
          <Menu-item name="3" @click.native="goPage('Statistics')">
            <Icon type="ios-analytics"></Icon>
            <span class="layout-text">统计</span>
          </Menu-item>
        </Menu>
      </i-col>
      <i-col span="20">
        <div class="layout-header"></div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view />
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  methods: {
    goPage(name) {
      this.$router.push({ name:name,params:{type:1}});
    }
  }
};
</script>
