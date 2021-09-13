<!--
 * @Description: 创建店铺
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:22:17
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-13 21:57:19
-->
<template>
  <view class="view">
    <navBar title="创建店铺活动" background="#fff"></navBar>
    <!-- header -->
    <view class="header flex-center">
      <view class="headerText flex-center">
        <img
          src="../../static/images/login/regionalPrivilege.png"
          style="width: 33px; height: 33px; margin-right: 16rpx"
        />
        高老板烤肉店
      </view>
      <view class="headerDesc"> 文艺路物美楼下 </view>
    </view>
    <!-- 配置 -->
    <seting></seting>
  </view>
</template>

<script>
  import seting from './setingCell'
  export default {
    name: 'CreateShop',
    components: { seting },
    data() {
      return {}
    },
    created() {},
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .view {
    padding: 32rpx;
    .header {
      padding: 26rpx 0;
      border-bottom: 1px solid #c8c8c8;
      justify-content: space-between;
      .headerText {
        @include text-style($size: 16);
      }
      .headerDesc {
        @include text-style($size: 12, $color: #9a9a9a);
      }
    }
  }
</style>
