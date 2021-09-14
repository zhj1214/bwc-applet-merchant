<!--
 * @Description: 创建店铺
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:22:17
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-14 22:44:25
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
    <!-- 美团配置 -->
    <seting title="美团配置" @change="mtSetingChange"></seting>
    <!-- 饿了么配置 -->
    <seting title="饿了么配置" @change="elmSetingChange"></seting>
    <!-- 通用配置 -->
    <universal @change="dataTimeChange"></universal>
  </view>
</template>

<script>
  import seting from './setingCell'
  import universal from './universalSeting.vue'

  const Log = console.log
  export default {
    name: 'CreateShop',
    components: { seting, universal },
    data() {
      return {}
    },
    created() {},
    methods: {
      /**
       * @description: 获取数据
       * @param {*} val
       * @author: zhj1214
       */
      mtSetingChange(val) {
        Log('美团：', val)
      },
      elmSetingChange(val) {
        Log('饿了么：', val)
      },
      dataTimeChange(val) {
        Log('通用配置变化了', val)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .view {
    padding: 32rpx;
    .header {
      padding: 16rpx 0;
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
