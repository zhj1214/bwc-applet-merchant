<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-10-18 21:52:00
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-10-18 21:55:00
-->
<template>
  <view class="view">
    <navBar title="搜索" background="#fff"></navBar>
    <view class="searchStyle">
      <u-search
        placeholder="请输入商家、商品名称"
        border-color="#ffce5d"
        :show-action="false"
      ></u-search>
    </view>
  </view>
</template>

<script>
  export default {}
</script>

<style lang="scss" scoped>
  .view {
    .searchStyle {
      padding: 32rpx;
    }
  }
</style>
