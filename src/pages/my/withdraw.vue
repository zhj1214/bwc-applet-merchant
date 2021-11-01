<!--
 * @Description: 提现
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-10-18 20:56:35
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-10-18 21:04:44
-->
<template>
  <view class="view">
    <navBar title="提现" background="#fff"></navBar>
    <!-- 充值金额 -->
    <view class="rechargeBg">
      <view class="title"> 提现金额 </view>
      <view class="flex-center">
        <view style="font-size: 26px"> ￥ </view>
        <u-input v-model="price" type="number"></u-input>
      </view>
      <view class=""> 可用余额：200,122.00元 手续费：提现金额*1% 到账金额：提现金额-手续费 </view>
    </view>
    <!-- 充值按钮 -->
    <view class="oneRowBtn" style="margin-top: 20px">提现 </view>
    <!-- 注意 -->
    <view class="alertBg">
      注意：
      <view class="">
        1. 当日20点前提现，次日到账：20点后提现，隔日到账，非工作日提现到账时间顺延。
      </view>
      <view class=""> 2. 每天只能提现一次，且提现金额大于2元。 </view>
      <view class=""> 3. 若逾期未到账，请查询支付宝账单、微信账单或咨询客服处理。 </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Withdraw',
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
    .alertBg {
      background: #ffff88;
      padding: 6px 10px;
      margin-top: 20px;
      border-radius: 4px;
    }
  }
</style>
