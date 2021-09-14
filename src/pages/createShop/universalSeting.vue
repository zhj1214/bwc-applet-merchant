<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-14 22:06:24
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-14 22:43:38
-->
<!--
 * @Description: 通用配置项
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:53:55
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-14 22:05:07
-->
<template>
  <view class="view">
    <!-- header -->
    <view class="headerTitle flex-center"> <view class="headerTitleLeft"></view> 通用配置 </view>
    <!-- 内容 -->
    <view
      class="item flex-center"
      @click="
        () => {
          showClendar = !showClendar
        }
      "
    >
      <view class="title">选择日期</view>
      <view class="desc"> {{ dateCalendar || '--' }} </view>
    </view>
    <view
      class="item flex-center"
      @click="
        () => {
          showTime = !showTime
          timeType = 'start'
        }
      "
    >
      <view class="title">每天开始时间</view>
      <view class="desc"> {{ startTime || '--' }} </view>
    </view>
    <view
      class="item flex-center"
      @click="
        () => {
          showTime = !showTime
          timeType = 'end'
        }
      "
    >
      <view class="title">每天结束时间</view>
      <view class="desc"> {{ endTime || '--' }} </view>
    </view>
    <u-picker mode="time" v-model="showTime" :params="timeParams" @confirm="timeConfirm"></u-picker>

    <u-calendar v-model="showClendar" mode="range" @change="clendarChange"></u-calendar>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        disabled: false,
        showClendar: false,
        dateCalendar: '',
        showTime: false,
        timeType: '',
        startTime: '',
        endTime: '',
        timeParams: {
          year: false,
          month: false,
          day: false,
          hour: true,
          minute: true,
          second: true,
        },
      }
    },

    methods: {
      /**
       * @description: 时间选择器
       * @param {*} e
       * @author: zhj1214
       */
      timeConfirm(e) {
        console.log(e)
        if (this.timeType === 'start') {
          this.startTime = `${e.hour}:${e.minute}:${e.second}`
        } else if (this.timeType === 'end') {
          this.endTime = `${e.hour}:${e.minute}:${e.second}`
        }
        this.$emit('change', this.$data)
      },
      /**
       * @description: 选择日期对象
       * @param {*} e
       * @author: zhj1214
       */
      clendarChange(e) {
        console.log(e)
        this.dateCalendar = `${e.startDate} ~ ${e.endDate}`
        // endDate: "2020-06-04", // 选择的结束日期
        // endDay: 4, // 结束日期是哪一天
        // endMonth: 6, // 结束日期的月份
        // endWeek: "星期四", // 结束日期的星期数
        // endYear: 2020, // 结束日期的年份
        // startDate: "2020-06-01", // 选择的起始日期
        // startDay: 1, // 起始日期是哪一天
        // startMonth: 6, // 起始日期的月份
        // startWeek: "星期一", // 起始日期的星期数
        // startYear: 2020 // 起始日期的年份
        this.$emit('change', this.$data)
      },
    },
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
