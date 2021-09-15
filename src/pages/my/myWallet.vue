<!--
 * @Description: 我的钱包
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-15 22:35:02
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-15 23:07:25
-->
<template>
  <view class="view">
    <navBar title="我的钱包" background="#fff"></navBar>
    <view style="margin-bottom: 18rpx">
      <u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="change"></u-tabs>
    </view>

    <view class="" v-if="currentTab === 0">
      <view class="item flex-center" v-for="item in billList" :key="item.id">
        <view class="">
          <view style="color: #444444; font-size: 16px">
            {{ item.name }}
          </view>
          <view class="time">
            {{ item.time }}
          </view>
        </view>
        <view class="">{{ item.price }}元 </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'MyWallet',
    data() {
      return {
        tabList: [
          {
            name: '账单记录',
          },
          {
            name: '充值记录',
          },
          {
            name: '提现记录',
            // count: 5,
          },
        ],
        currentTab: 0,
        billList: [
          { id: 0, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 0, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
        ], // 账单记录
        rechargeList: [], // 账单记录
        withdrawList: [], // 账单记录
      }
    },
    methods: {
      /**
       * @description: 切换tab
       * @param {*} index
       * @author: zhj1214
       */
      change(index) {
        this.current = index
      },
    },
  }
</script>

<style lang="scss" scoped>
  .view {
    padding: 32rpx;
    .item {
      background: #ffffff;
      box-shadow: 0px 0px 15px -2px rgba(0, 0, 0, 0.08);
      border-radius: 10rpx;
      width: 100%;
      padding: 24rpx;
      justify-content: space-between;
      margin-bottom: 16rpx;
      .time {
        @include text-style($size: 12, $color: #404040);
        margin-top: 16rpx;
      }
    }
  }
</style>
