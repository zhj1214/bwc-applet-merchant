<!--
 * @Description: 我的钱包
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-15 22:35:02
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-17 22:23:52
-->
<template>
  <view class="view">
    <navBar title="我的钱包" background="#fff"></navBar>
    <!-- <u-sticky offset-top="200"> -->
    <view class="sticky" style="margin-bottom: 18rpx">
      <u-tabs :list="tabList" :is-scroll="false" :current="currentTab" @change="change"></u-tabs>
    </view>
    <!-- </u-sticky> -->

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
          { id: 1, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 2, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 3, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 4, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 5, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 6, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 7, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 8, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
          { id: 9, name: '开启活动', time: '2021-09-09 22:12', price: '100' },
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
        console.log(index)
        this.currentTab = index
      },
    },
    async onReachBottom() {
      console.log('上啦')
      // 如果还有数据
      //   if (this.total > this.list.length) {
      //     this.params.page = this.params.page + 1
      //     this.fetchList()
      //     return
      //   }
      //   // 已经是最后一页
      //   uni.showToast({
      //     title: '没有更多了',
      //     icon: 'none',
      //   })
    },
    async onPullDownRefresh() {
      console.log('下啦刷新')
      //   this.params.page = 1 // current page = 1
      //   try {
      //     await this.fetchList()
      //   } catch (error) {
      //     console.error(error)
      //   } finally {
      //     uni.stopPullDownRefresh()
      //   }
    },

    onPageScroll(obj) {
      console.log(obj)
      //   this.opacity = obj.scrollTop / 100
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
    .sticky {
      position: fixed;
      top: 64px;
      width: calc(100% - 64rpx);
    }
    .scrollView {
      overflow: scroll;
      height: calc(100vh - 124px);
    }
  }
</style>
