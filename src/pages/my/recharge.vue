<!--
 * @Description: 充值
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-17 22:24:59
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-17 22:34:57
-->
<template>
  <view class="view">
    <navBar title="充值" background="#fff"></navBar>
    <!-- 充值金额 -->
    <view class="rechargeBg">
      <view class="title"> 充值金额 </view>
      <view class="flex-center">
        <view style="font-size: 26px"> ￥ </view>
        <u-input></u-input>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Recharge',
  }
</script>

<style lang="scss" scoped>
  .view {
    padding: 32rpx;
    .rechargeBg {
      background: #ffffff;
      box-shadow: 0px 0px 15px -2px rgba(0, 0, 0, 0.08);
      border-radius: 20rpx;
      padding: 32rpx 24rpx;
      .title {
        @include text-style($size: 18px, $weight: 400);
        margin-bottom: 20rpx;
      }
    }
  }
</style>
