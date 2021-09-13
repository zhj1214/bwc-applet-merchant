<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      color="white"
      background="inherit"
      backgroundColorTop="inherit"
      title="我的"
    ></navBar>
    <view class="header">
      <image
        style="width: 100vw; height: 160px"
        src="https://eos-wuxi-1.cmecloud.cn/crmoss/e59e1fc2-2067-425a-a743-5209123b8e84.png"
        mode=""
      ></image>
      <view class="card">
        <!-- 用户信息 -->
        <view class="top flex-between">
          <view class="left flex-row" v-if="userInfo.headImg">
            <view class="usertx" @click="jumpUpdateInfo">
              <image
                class="usertximg"
                :src="userInfo.headImg"
                mode="aspectFill"
              ></image>
              <view class="usertxedit flex-center-row">
                <image
                  style="width: 8px; height: 8px"
                  src="../../static/images/my/edit.png"
                  mode=""
                ></image>
              </view>
            </view>
            <view class="info" style="flex: 1">
              <view class="name oneLine">{{
                userInfo.memberName || userInfo.nickName
              }}</view>
              <view
                class="flex-row"
                style="
                  height: 16px;
                  background: #ffefed;
                  border-radius: 8px;
                  max-width: 220rpx;
                "
                @click="jumpLevel"
              >
                <view class="levelName">{{ userInfo.levelName }}</view>
                <view class="levelCardName">{{ levelCardName }}</view>
                <image
                  style="width: 20rpx; height: 20rpx"
                  src="../../static/images/jtright.png"
                  mode=""
                ></image>
              </view>
            </view>
          </view>
          <!-- 未登录 -->
          <view v-else class="left flex-row" @click="jumpLogin">
            <image
              style="width: 65px; height: 65px; border-radius: 50%"
              src="../../static/images/my/wdl.png"
              mode=""
            ></image>
            <view
              style="
                font-size: 16px;
                font-weight: 500;
                color: #000000;
                margin-left: 11px;
              "
              >未登录</view
            >
          </view>
          <view
            class="right flex-center-row"
            style="flex-direction: column; min-width: 64rpx"
          >
            <image
              style="width: 27px; height: 27px"
              src="../../static/images/my/userQrcode.png"
              @click="jumpQrcode"
            ></image>
            <view style="font-size: 10px; color: #444444">会员码</view>
          </view>
        </view>
        <!-- 积分成长值 -->
        <view class="bottom flex-row" style="justify-content: space-between">
          <view class="item flex-center-column" @click="jumpPage(1)">
            <view class="value">{{ userInfo.integral || 0 }}</view>
            <view class="title">{{ ponitName }}</view>
          </view>
          <view class="item flex-center-column" @click="jumpPage(2)">
            <view class="value">{{ userInfo.growthValue || 0 }}</view>
            <view class="title">成长值</view>
          </view>
          <view class="item flex-center-column" @click="jumpPage(3)">
            <view class="value">{{ couponNums || 0 }}</view>
            <view class="title">优惠券</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 我的订单 -->
    <view class="myOrder">
      <view
        class="myOrder-header flex-between"
        @click="jumpOrder"
        data-type="全部订单"
      >
        <view class="title">我的订单</view>
        <view class="flex-center-row">
          <view style="font-size: 10px; font-weight: 400; color: #9a9a9a"
            >全部订单</view
          >
          <image
            style="width: 5px; height: 7.5px; margin-left: 3px"
            src="../../static/images/car/left.png"
            mode=""
          ></image>
        </view>
      </view>
      <!-- 订单状态 -->
      <view
        class="flex-row"
        style="
          justify-content: space-between;
          padding: 18px 0px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        "
      >
        <view
          v-for="(item, index) in orderStatus"
          :key="index"
          class="order-status-item"
          @click="jumpOrder"
          :data-type="item.title"
        >
          <u-badge
            type="error"
            :count="item.num || '0'"
            :offset="[-10, -10]"
          ></u-badge>
          <u-icon size="48" :name="item.img"></u-icon>
          <view class="order-status-title">{{ item.title }}</view>
        </view>
      </view>
    </view>
    <!-- 更多服务 -->
    <view class="content">
      <view class="myOrder-header">
        <view class="title">更多服务</view>
      </view>
      <view
        class="funtionsItem flex-between"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)"
        @click="jumpOrder"
        data-type="退款售后"
      >
        <view class="flex-row">
          <image
            style="width: 17px; height: 17px"
            src="../../static/images/my/tksh.png"
            mode=""
          ></image>
          <view
            style="
              font-size: 14px;
              font-weight: 400;
              color: #444444;
              margin-left: 11px;
            "
            >退款/售后</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/car/left1.png"
          mode=""
        ></image>
      </view>
      <view
        class="funtionsItem flex-between"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)"
        @click="jumpMoudle(2)"
      >
        <view class="flex-row">
          <image
            style="width: 17px; height: 17px"
            src="../../static/images/my/dzgl.png"
            mode=""
          ></image>
          <view
            style="
              font-size: 14px;
              font-weight: 400;
              color: #444444;
              margin-left: 11px;
            "
            >地址管理</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/car/left1.png"
          mode=""
        ></image>
      </view>
      <view
        class="funtionsItem flex-between"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)"
        @click="jumpMoudle('myReceipt')"
      >
        <view class="flex-row">
          <image
            style="width: 17px; height: 17px"
            src="../../static/images/my/dzxp.png"
            mode=""
          ></image>
          <view
            style="
              font-size: 14px;
              font-weight: 400;
              color: #444444;
              margin-left: 11px;
            "
            >电子小票</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/car/left1.png"
          mode=""
        ></image>
      </view>
      <view
        class="funtionsItem flex-between"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)"
        @click="jumpActivity"
      >
        <view class="flex-row">
          <image
            style="width: 17px; height: 17px"
            src="../../static/images/my/wdhd.png"
            mode=""
          ></image>
          <view
            style="
              font-size: 14px;
              font-weight: 400;
              color: #444444;
              margin-left: 11px;
            "
            >我的活动</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/car/left1.png"
          mode=""
        ></image>
      </view>
      <view class="funtionsItem flex-between" @click="jumpProblem">
        <view class="flex-row">
          <image
            style="width: 17px; height: 17px"
            src="../../static/images/my/wtfk.png"
            mode=""
          ></image>
          <view
            style="
              font-size: 14px;
              font-weight: 400;
              color: #444444;
              margin-left: 11px;
            "
            >问题反馈</view
          >
        </view>
        <image
          style="width: 9px; height: 9px"
          src="../../static/images/car/left1.png"
          mode=""
        ></image>
      </view>

    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      orderStatus: [
        {
          img: "/static/images/my/dzf.png",
          title: "待支付",
        },
        {
          img: "/static/images/my/dfx.png",
          title: "待分享",
        },
        {
          img: "/static/images/my/dfh.png",
          title: "待发货",
        },
        {
          img: "/static/images/my/dsh.png",
          title: "待收货",
        }
      ],
      ponitName: '',
      userInfo: {},
      couponNums: 0,
      levelCardName: "", // 当前等级卡名称
    };
  },
  /**
   * 生命周期函数--监听页面显示
   * 随时更新用户积分和成长值
   */

  onShow: function(options) {
    if (!this.userInfo.headImg) {
      this.userInfo = uni.$localStorage.getCurrentUser() || {};
    }
    this.getHomeMemberInfo();
    this.getCouponNumsRequest();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.userInfo = uni.$localStorage.getCurrentUser();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 私有方法
   */
  methods: {
    /**
     * @description 获取用户信息
     */
    getHomeMemberInfo() {
      if (uni.$localStorage.getItem("Token")) {
        var self = this;
        // 更新用户信息
        uni.$api
          .apiRequest("getUserInfo", {
            orgId: uni.$localStorage.getItem("orgId"),
          })
          .then((res) => {
            if (res.code == 10000 && res.data) {
              uni.$localStorage.setCurrentUser(res.data);
              let u = { ...self.userInfo, ...res.data };
              self.$nextTick(() => {
                self.userInfo = u;
              });
              self.getLeveName();
            }
          });
      }
    },
    getCouponNumsRequest() {
      if (uni.$localStorage.getItem("memberId")) {
        uni.$api
          .apiRequest("getCouponNums", {
            orgId: uni.$localStorage.getItem("orgId"),
            memberId: uni.$localStorage.getItem("memberId"),
          })
          .then((res) => {
            if (res.code == 10000) {
              this.couponNums = res.data || 0;
            }
          });
      }
    },
    /**
     * 获取等级卡名称
     * */
    getLeveName() {
      uni.$api
        .apiRequest("getLeveName", {
          orgId: uni.$localStorage.getItem("orgId"),
          levelId: this.userInfo.levelName,
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            this.levelCardName = res.data.levelName;
            uni.$localStorage.setItem("userLeveId",res.data.id)
          }
        });
    },
    /**
     * 跳转积分、成长值、优惠券
     * */
    jumpPage(val) {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      let url = "/pages/my/growthList/growthList?value=" + this.userInfo.growthValue;
      if (val == 1) {
        url =
          "/pages/my/integral/integral?value=" +
          this.userInfo.orgTotalScore +
          `&allValue=${this.userInfo.integral || 0}`;
      } else if (val == 3) {
        url = "/pages/myCardCoupon/myCoupon/myCoupon";
      }
      uni.navigateTo({
        url: url,
      });
    },
    jumpActivity() {
      if (uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pagesA/activity/activityList",
        });
      } else {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    },
    // 停车管理
    goParking() {
      if (uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pagesParking/home/index",
        });
      } else {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    },
    // 跳转到会员二维码
    jumpQrcode() {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/my/userQrcode/userQrcode",
      });
    },
    jumpLogin() {
      uni.navigateTo({
        url: "/pages/login/login",
      });
    },
    jumpUpdateInfo() {
      
      uni.navigateTo({
        url: "/pages/login/registered/registerednew?pageType=2",
      });
      // uni.navigateTo({
      //   url: "/pages/login/registered/registered?pageType=2",
      // });
    },
    jumpMoudle(val) {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      if (val == 2) {
        uni.navigateTo({
          url: "/pages/my/receiptAdress/receiptAdress",
        });
      }
      if(val === 'myReceipt') {
	      uni.navigateTo({
		      url: "/pagesA/myCenter/myReceipt/index",
	      });
      }
    },

    jumpLevel() {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages/my/memberLevel/personnalInfo",
      });
    },
    /**
     * @description: 跳转问题反馈
     */
    jumpProblem(){
      uni.$api
        .apiRequest("getProblemId", {
          mallId: uni.$localStorage.getItem("orgId"),
        })
        .then((res) => {
          if (res.code == 10000 && res.data) {
            uni.navigateTo({
              url: "/pages/landingPage/index?landId=" + res.data,
            });
          }
        });
    },
    /**
     * 跳转 订单页面
     */
    jumpOrder(e) {
      if (!uni.$localStorage.getItem("Token")) {
        uni.navigateTo({
          url: "/pages/login/login",
        });
        return;
      }
      // console.log(e.currentTarget.dataset.type);
      if (!uni.$localStorage.getItem("Token")) {
        // this.gotoLogin();
      } else {
        uni.navigateTo({
          url: "/pagesA/order/order?type=" + e.currentTarget.dataset.type,
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.view {
  background-color: #f9f9f9;
  min-height: 100vh;

  .header {
    position: relative;
    height: 275px;
    background-color: ;

    .card {
      padding: 18px;
      position: absolute;
      bottom: 10px;
      background: #ffffff;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
      border-radius: 5px;
      margin-left: 40rpx;
      width: 670rpx;
      height: 167px;

      .top {
        .left {
          .usertx {
            position: relative;

            .usertximg {
              height: 65px;
              width: 65px;
            }

            .usertxedit {
              bottom: 0px;
              position: absolute;
              width: 65px;
              height: 15px;
              background: rgba(0, 0, 0, 0.63);
            }

            width: 65px;
            height: 65px;
            border-radius: 50%;
            overflow: hidden;
          }

          .info {
            margin-left: 16px;

            .levelName {
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              text-align: center;
              line-height: 12px;
              height: 16px;
              background: #fe5d4d;
              border-radius: 8px;
              padding: 4rpx 8rpx;
            }

            .levelCardName {
              padding: 4rpx 8rpx;
              font-size: 11px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #fe5d4d;
            }

            .name {
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #000000;
              margin-bottom: 8px;
            }
          }
        }
      }

      .bottom {
        margin-top: 20px;

        .item {
          .title {
            font-size: 10px;
            font-family: PingFang-SC-Light, PingFang-SC;
            font-weight: 300;
            color: #8e8e8e;
          }

          .value {
            font-size: 20px;
            font-family: DINPro-Bold, DINPro;
            font-weight: bold;
            color: #444444;
          }
        }
      }
    }
  }

  .myOrder {
    padding: 20px;
  }

  .content {
    padding: 0px 20px 20px;

    .funtionsItem {
      height: 54px;
      align-items: center;
    }
  }

  .myOrder-header {
    .title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
  }

  .order-status-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .order-status-title {
    margin-top: 8rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(59, 56, 59, 1);
  }
}
</style>
