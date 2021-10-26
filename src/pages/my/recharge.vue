<!--
 * @Description: 充值
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-17 22:24:59
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-10-18 20:54:16
-->
<template>
  <view class="view">
    <navBar title="充值" background="#fff"></navBar>
    <!-- 充值金额 -->
    <view class="rechargeBg">
      <view class="title"> 充值金额 </view>
      <view class="flex-center">
        <view style="font-size: 26px"> ￥ </view>
        <u-input v-model="price" type="number"></u-input>
      </view>
    </view>
    <!-- 充值选项 -->
    <view class="flex-center" style="justify-content: space-around; margin-top: 20px">
      <view
        class="pricebtn"
        v-for="(item, index) in priceList"
        :key="index"
        @click="rechargePrice(item)"
        >{{ item }}</view
      >
    </view>
    <!-- 充值按钮 -->
    <view class="oneRowBtn" style="margin-top: 20px">充值 </view>
  </view>
</template>

<script>
  export default {
    name: 'Recharge',
    data() {
      return {
        price: 500,
        priceList: [500, 1000, 1500, 2000],
      }
    },
    methods: {
      rechargePrice(val) {
        this.price = val
        console.log('老板充钱：', val)
      },
    },
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
    .pricebtn {
      border: 1px solid #8b8b8b;
      @include text-style($size: 16px);
      padding: 6px 12px;
      border-radius: 4px;
    }
  }
</style>
