<!--
 * @Description: 配置项
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-13 21:53:55
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-14 22:57:18
-->
<template>
  <view class="view">
    <!-- header -->
    <view class="headerTitle flex-center">
      <view class="headerTitleLeft"></view> {{ title || '配置项' }}
    </view>
    <!-- 内容 -->
    <view class="item flex-center">
      <view class="title">是否开启 </view>
      <u-switch v-model="switchChecked" :disabled="disabled" @change="switchChange"></u-switch>
    </view>
    <view class="item flex-center">
      <view class="title">返现设置（15-100）</view>
      <view class="flex-center">
        满
        <u-input
          style="margin: 0 3px"
          :custom-style="inputStyle"
          v-model="man"
          type="number"
          :border="true"
          @blur="textChange(man, 'man')"
          placeholder="最低15元"
        />
        返
        <u-input
          style="margin: 0 3px"
          :custom-style="inputStyle"
          v-model="fan"
          placeholder="10元起"
          type="number"
          :border="true"
          @blur="textChange(fan, 'fan')"
        />
      </view>
    </view>
    <view class="item flex-center">
      <view class="title">美团活动数量（10个起）</view>
      <u-input
        :custom-style="inputStyle"
        type="number"
        border="true"
        placeholder="10个起"
        v-model="activityNumber"
        @input="textChange(activityNumber, 'activityNumber')"
      ></u-input>
    </view>
    <view class="item flex-center">
      <view class="title">好评单量：</view>
    </view>
    <view class="item flex-center">
      <view class="title">无需评价</view>
      <u-input
        :custom-style="inputStyle"
        type="number"
        border="true"
        v-model="noAssesNumber"
        @input="textChange(noAssesNumber, 'noAssesNumber')"
      ></u-input>
    </view>
    <view class="item flex-center">
      <view class="title">5星好评，无需评价</view>
      <u-input
        :custom-style="inputStyle"
        type="number"
        border="true"
        v-model="assesNumber"
        @input="textChange(assesNumber, 'assesNumber')"
      ></u-input>
    </view>
    <view class="item flex-center">
      <view class="title">5星好评+2图+20字</view>
      <u-input
        :custom-style="inputStyle"
        type="number"
        border="true"
        v-model="allAssesNumber"
        @input="textChange(allAssesNumber, 'allAssesNumber')"
      ></u-input>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      title: String,
    },
    data() {
      return {
        switchChecked: false,
        disabled: false,
        inputStyle: { width: '55px' },
        man: '',
        fan: '',
        activityNumber: 0, // 活动数量
        noAssesNumber: 0, // 无需评价
        assesNumber: 0, // 5星好评，无需评价
        allAssesNumber: 0, // 5星好评+2图+20字
      }
    },
    computed: {
      /**
       * @description: 活动总数量
       * @author: zhj1214
       */
      totalActivity() {
        const total =
          Number(this.noAssesNumber) + Number(this.assesNumber) + Number(this.allAssesNumber)
        return Number(this.activityNumber) === total
      },
    },
    methods: {
      switchChange() {
        console.log('满减金额不正确')
        if (this.man > 14 && this.man < 101) {
          console.log('返现金额不正确')
          if (this.fan > 9 && this.fan <= this.man) {
            console.log('活动数量最少10个')
            if (this.activityNumber > 9) {
              console.log(
                this.activityNumber,
                '好评量不足',
                this.noAssesNumber,
                '--',
                this.assesNumber,
                '--',
                this.allAssesNumber
              )
              if (this.totalActivity) {
                console.log('完全正确:', this.$data)
                this.$emit('change', this.$data)
                const calculateType = this.title
                uni.$eventbus.$emit('calculateCharge', { ...this.$data, calculateType })
                return
              }
            }
          }
        }
        uni.$alert.showToast('请检查您的配置项是否正确')
        this.$nextTick(() => {
          this.switchChecked = false
        })
      },
      textChange(val, type) {
        console.log(val, '--', type)

        const isOk = /^\d{1,}$/.test(val)
        if (!isOk) {
          this.$nextTick(() => {
            this[type] = 0
          })
          return uni.$alert.showToast('请输入正整数')
        }
        if (type === 'man' && (this.man < 15 || this.man > 100)) {
          this.man = ''
          return uni.$alert.showToast('满减金额需在15~100之间')
        } else if (type === 'fan' && (this.fan < 10 || this.fan > this.man)) {
          this.fan = ''
          return uni.$alert.showToast('返现金额最少为10，且小于满减金额')
        } else if (type === 'activityNumber' && this.activityNumber < 10) {
          this.activityNumber = 0
          return uni.$alert.showToast('活动数量最低10个')
        }
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
      .title {
        @include text-style($color: #393939);
      }
      justify-content: space-between;
    }
  }
</style>
