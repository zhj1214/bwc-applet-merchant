<!--
 * @Description: 创建店铺
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:22:17
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-18 16:42:10
-->
<template>
  <view class="view">
    <navBar title="创建店铺活动" background="#fff"></navBar>
    <!-- header -->
    <view class="header flex-center">
      <view class="headerText flex-center" @click="copyText">
        <img
          src="../../static/images/login/regionalPrivilege.png"
          style="width: 33px; height: 33px; margin-right: 16rpx"
        />
        高老板烤肉店
      </view>
      <view class="headerDesc"> 文艺路物美楼下 </view>
    </view>
    <!-- 美团配置 -->
    <seting title="美团配置" :disabled="disabled" @change="mtSetingChange"></seting>
    <!-- 饿了么配置 -->
    <seting title="饿了么配置" :disabled="disabled" @change="elmSetingChange"></seting>
    <!-- 通用配置 -->
    <universal :disabled="disabled" @change="dataTimeChange"></universal>
    <!-- 费用说明 -->
    <view class="calculate">
      <!-- header -->
      <view class="headerTitle flex-center">
        <view class="flex-center">
          <view class="headerTitleLeft"></view>
          <view> 费用说明 </view>
        </view>
        <view> 总计：{{ total }} </view>
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
      <view class="item flex-center">
        <view class="title" style="color: red">* 不满足返现最低金额时，返现实付金额*60%</view>
      </view>
    </view>
    <!-- 发布活动 -->
    <view class="oneRowBtn orbFixed" @click="submit"> 发布活动 </view>
  </view>
</template>

<script>
  import seting from './setingCell'
  import universal from './universalSeting.vue'
  import { SERVERPRICE } from '../../commonData'

  const Log = console.log
  export default {
    name: 'CreateShop',
    components: { seting, universal },
    data() {
      return {
        disabled: false, // true 详情页面 false 创建
        mtData: {},
        elmData: {},
        universalData: {},
      }
    },
    computed: {
      // 费用总计
      total() {
        return 0
      },
      //   美团费用
      mtCharge() {
        if (this.mtData.activityNumber > 0) {
          return this.mtData.activityNumber * this.mtData.fan
        } else {
          return 0
        }
      },
      //   饿了么费用
      elmCharge() {
        if (this.elmData.activityNumber > 0) {
          return this.elmData.activityNumber * this.elmData.fan
        } else {
          return 0
        }
      },
      //   服务费
      serveCharge() {
        Log('this.mtData.activityNumber', this.mtData.activityNumber)
        Log('this.elmData.activityNumber', this.elmData.activityNumber)
        return (
          (Number(this.mtData.activityNumber || 0) + Number(this.elmData.activityNumber || 0)) *
          SERVERPRICE
        )
      },
    },
    onLoad(options) {
      if (options.disabled) {
        this.disabled = true
      }
    },
    methods: {
      /**
       * @description: 复制内容到剪贴板
       * @param {*} data
       * @author: zhj1214
       */
      copyText(data) {
        wx.setClipboardData({
          data: data,
          success() {
            wx.getClipboardData({
              success(res) {
                console.log('剪贴板内容：', res.data) // data
              },
            })
          },
        })
      },
      /**
       * @description: 获取数据
       * @param {*} val
       * @author: zhj1214
       */
      mtSetingChange(val) {
        Log('美团：', val)
        this.mtData = val
      },
      elmSetingChange(val) {
        Log('饿了么：', val)
        this.elmData = val
      },
      dataTimeChange(val) {
        this.universalData = val
        Log('通用配置变化了', val)
      },
      /**
       * @description: 发布活动
       * @author: zhj1214
       */
      submit() {
        uni.$alert.showModal('提示', '可用余额小于活动费用，不支持本次活动创建请充值后重新发布。')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .view {
    padding: 32rpx;
    padding-bottom: 170rpx;
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
    .calculate {
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
        justify-content: space-between;
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
  }
</style>
