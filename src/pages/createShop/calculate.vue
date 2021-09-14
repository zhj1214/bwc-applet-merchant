<!--
 * @Description: 费用说明
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:53:55
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-14 22:58:03
-->
<template>
  <view class="view">
    <!-- header -->
    <view class="headerTitle flex-center">
      <view class="headerTitleLeft">费用说明</view>
      <view class=""> 总计：{{ total }} </view>
    </view>
    <!-- 内容 -->
    <view class="item flex-center">
      <view class="title">美团费用：</view>
      <view class="desc"> {{ mtCharge || '--' }} </view>
    </view>
    <view class="item flex-center">
      <view class="title">饿了么费用：</view>
      <view class="desc"> {{ elmCharge || '--' }} </view>
    </view>
    <view class="item flex-center">
      <view class="title">服务费用：</view>
      <view class="desc"> {{ serveCharge || '--' }} (每单5元)</view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        total: 0,
        mtCharge: 0,
        elmCharge: 0,
        serveCharge: 0,
      }
    },
    created() {
      uni.$eventbus.$on('calculateCharge', (e) => {
        console.log(e, '11111111111111')
      })
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .view {
    .headerTitleLeft {
      background-color: blue;
      height: 38rpx;
      width: 3px;
      margin-right: 3px;
      border: 50%;
    }
    .headerTitle {
      @include text-style($size: 16px);
      border-bottom: 1px solid c8c8c8;
      padding: 20rpx 0;
    }
    .item {
      margin: 8px 6px;
      justify-content: space-between;
      .title {
        @include text-style($color: #393939);
      }
      .desc {
        @include text-style($color: #8b8b8b);
      }
    }
  }
</style>
