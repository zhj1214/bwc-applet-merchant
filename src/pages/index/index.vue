<!--
 * @Description: 
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-13 21:19:42
-->
<template>
  <view class="pageHome">
    <navBar title="首页" background="#fff"></navBar>
    你好，1111
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

  const SCENE_PARSE_KEY = '$_scene_parsed' // 场景析构
  export default {
    name: 'Home',
    components: {
      alertView,
    },
    /**
     * 首页逻辑处理
     * 1.是否需要选择商场
     * 2.不同商场的场景模式，弹框切换商场
     * 2.场景调用下一步
     * 3.进入首页就获取用户信息，更新积分值
     * */

    data() {
      return {
        alertShow: false,
        mallAlertShow: false,
      }
    },
    /**
     * 生命周期函数--监听页面显示
     * 没有options可以拿到
     */
    onShow: function () {},
    onLoad(options) {
      uni.$eventbus.$on('testinitindexdata', (e) => {
        console.log(e, '11111111111111')
      })
      if (options) this.options = options
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

    methods: {},
    filters: {
      priceFormat(val) {
        if (!val) return '--'
        return `￥${uni.$util.decimalTwo(val, true, 2)}`
      },
    },
  }
</script>

<style lang="less">
  .pageHome {
    background-color: red;
  }
</style>
