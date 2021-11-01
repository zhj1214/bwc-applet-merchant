<!--
 * @Description: 首页
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-11-01 15:29:49
-->
<template>
  <view class="pageHome">
    <search class="search" v-if="isShowSearchView"> </search>
    <view v-else class="">
      <navBar title="吃啥" background="#fff"></navBar>
      <view class="contentView">
        <!-- 定位 -->
        <view class="flex-center">
          <img src="../../static/images/mapbz.png" style="width: 16px; height: 22px" />
          <view class="adressText">{{ adress }}</view>
          <img src="../../static/images/jtright.png" style="width: 20px; height: 18px" />
        </view>
        <!-- 搜索 -->
        <view class="" style="margin: 10px 0" @click="showSearchView">
          <u-search
            placeholder="请输入商家、商品名称"
            disabled
            border-color="#ffce5d"
            :show-action="false"
          ></u-search>
        </view>
        <!-- 标题 -->
        <view class="title"> 霸王餐 </view>
        <!--筛选 -->
        <view class="flex-between">
          <view class="flex-center">
            <view class=""> 距离排序 </view>
            <view class=""> 佣金排序 </view>
          </view>
          <view class=""> 平台 </view>
        </view>
      </view>
    </view>

    <!-- 提示信息弹框 -->
    <alertView
      v-if="alertShow && alertContent"
      :showHeader="false"
      :content="alertContent"
      :showCancel="true"
      @ok="okAlert(1)"
      @cancel="okAlert(0)"
    >
    </alertView>

    <alertView
      v-if="mallAlertShow"
      :showHeader="false"
      content="您当前还未选择商场，请选择商场后再进行浏览"
      @cancel="mallAlertShowOk"
    >
    </alertView>
  </view>
</template>

<script>
  import alertView from '../../pageComponents/alertView/alertView'
  import search from '../../pageComponents/search'
  export default {
    name: 'Home',
    components: {
      alertView,
      search,
    },
    data() {
      return {
        isShowSearchView: false,
        alertShow: false,
        mallAlertShow: false,
      }
    },
    computed: {
      adress() {
        return '杭州市西湖区'
      },
    },
    onShow: function () {
      // 请求获取验证码 示例
      uni.$api
        .loginPhoneCode({
          phone: '17521091214',
          orgId: '13476062',
        })
        .then((res) => {
          console.log(res)
        })
      console.log('uni.$api', uni.$api)
      // // 获取验证码
      // uni.$api.apiRequest('getSmsCode', {
      //   phone: this.phone,
      //   orgId: uni.$localStorage.getItem('userOrgId'),
      // })
    },
    onLoad(options) {
      uni.$eventbus.$on('testinitindexdata', (e) => {
        console.log(e, '11111111111111')
      })
      if (options) this.options = options

      this.getLocation() // 获取定位信息
    },
    mounted() {
      console.log(this.$options.name, 'name')
    },
    async onReachBottom() {
      // 如果还有数据
      if (this.total > this.list.length) {
        this.params.page = this.params.page + 1
        this.fetchList()
        return
      }
      // 已经是最后一页
      uni.showToast({
        title: '没有更多了',
        icon: 'none',
      })
    },
    async onPullDownRefresh() {
      this.params.page = 1 // current page = 1
      try {
        await this.fetchList()
      } catch (error) {
        console.error(error)
      } finally {
        uni.stopPullDownRefresh()
      }
    },

    onPageScroll(obj) {
      this.opacity = obj.scrollTop / 100
    },

    methods: {
      showSearchView() {
        this.isShowSearchView = true
      },
      /**
       * 获取经纬度
       * */
      getLocation() {
        var self = this
        uni.getLocation({
          type: 'gcj02',
          success(res) {
            console.log(res)
            self.getmallDatas({
              longitude: res.longitude,
              latitude: res.latitude,
            })
          },
          fail(err) {
            console.error(err)
            uni.$alert.showToast('位置信息获取失败')
          },
        })
      },
      /**
       * @description: 获取外卖列表数据
       * @author: zhj1214
       */
      getmallDatas(val) {
        console.log('开始获取活动数据', val)
      },
    },
    filters: {
      priceFormat(val) {
        if (!val) return '--'
        return `￥${uni.$util.decimalTwo(val, true, 2)}`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .pageHome {
    .contentView {
      padding: 32rpx;
      .adressText {
        @include text-style($size: 17px);
        margin: 0px 4px;
      }
      .title {
        @include text-style($size: 26px, $weight: 600);
      }
    }
  }
</style>
