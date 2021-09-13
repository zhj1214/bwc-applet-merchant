<template>
  <view class="view">
    <navBar
      style="position: absolute; top: 0px"
      background="inherit"
      backgroundColorTop="inherit"
      title="登录"
    ></navBar>
    <!-- v-if="isCompatibility" -->
    <image
      style="width: 100vw; height: 100vh"
      src="https://eos-wuxi-1.cmecloud.cn/crmoss/5457a386-d596-4d96-9b3e-06fa61286177.png"
    ></image>
    <image class="logo" src="../../static/images/login/login.png"></image>
    <!-- <image
            class="qy"
            src="https://eos-wuxi-1.cmecloud.cn/crmoss/f30fd031-5fe8-46e8-a426-50fcdac1b391.png"
            mode=""
        ></image> -->
    <view class="discount">
      <view class="discount-title">
        <image
          class="discount-img mr8"
          src="../../static/images/login/loginLeftArrow.png"
          mode=""
        />
        <text> 恒太会员专属特权 </text>
        <image
          class="discount-img ml8"
          src="../../static/images/login/loginRightArrow.png"
          mode=""
        />
      </view>
      <view class="discount-content" v-for="item in discountList" :key="item.text">
        <view class="discount-content-main" v-for="items in item" :key="items.img">
          <image :src="items.img" />
          <text>
            {{ items.text }}
          </text>
        </view>
      </view>
    </view>
    <view class="loginView">
      <view class="login-btn-container">
        <button
          class="login-button-fill"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          微信绑定手机号一键登录
        </button>
        <button v-if="!agreeStatus" class="cover-one" @click="showAgreeToast"></button>
        <button class="login-button-outline block-narrow" @click="jumpPhoneLogin">
          手机短信验证码登录
        </button>
        <button v-if="!agreeStatus" class="cover-phone" @click="showAgreeToast"></button>
        <view class="service-block" @click.stop="toggleCheckBox">
          <image
            v-if="agreeStatus"
            class="checkbox-normal"
            @click.stop="toggleCheckBox"
            src="../../static/images/login/select.png"
          ></image>
          <view
            v-else
            class="checkbox-normal"
            style="border: 2rpx solid #9b9b9b"
            @click.stop="toggleCheckBox"
          ></view>
          <view class="read-text">已阅读并同意</view>
          <view class="color-text" @tap.stop="goProtocol">《服务协议》</view>
        </view>
      </view>
    </view>
    <!-- 未选择组织  @ok="mallAlertShowOk" -->
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
  const app = getApp()

  export default {
    components: {
      alertView,
    },
    data() {
      return {
        mallAlertShow: false,
        isCompatibility: true,
        agreeStatus: false,
        discountList: [
          [
            {
              img: require('../../static/images/login/memberDiscountImg.png'),
              text: '会员折扣',
            },
            {
              img: require('../../static/images/login/parkingDiscount.png'),
              text: '停车优惠',
            },
            {
              img: require('../../static/images/login/pointsDeduction.png'),
              text: '积分抵扣',
            },
            {
              img: require('../../static/images/login/birthdayPackage.png'),
              text: '生日礼包',
            },
          ],
          [
            {
              img: require('../../static/images/login/membershipDay.png'),
              text: '会员日',
            },
            {
              img: require('../../static/images/login/memberActivities.png'),
              text: '会员活动',
            },
            {
              img: require('../../static/images/login/membershipService.png'),
              text: '会员服务',
            },
            {
              img: require('../../static/images/login/regionalPrivilege.png'),
              text: '区域特权',
            },
          ],
        ],
      }
    },
    onLoad() {
      const arr = app.globalData.iphoneInfo.system.split('OS ')
      console.log(
        app.globalData.iphoneInfo.system,
        'app.globalData.iphoneInfo.systemapp.globalData.iphoneInfo.system____',
        arr
      )
      // if(app.globalData.iphoneInfo.brand == 'iPhone'){
      if (arr[1] < '11') {
        // console.log('该升级了 宋斌')
        this.isCompatibility = false
      } else {
        // console.log('不存在的')
        this.isCompatibility = true
      }
      // }
    },
    onShow() {
      if (!uni.$localStorage.getItem('orgId')) this.mallAlertShow = true
      this.init()
    },
    methods: {
      init() {
        uni.login({
          success: (res) => {
            console.log(res, '微信login成功')
            uni.$api
              .apiRequest('getOpenId', {
                code: res.code,
              })
              .then((response) => {
                if (response.code == 10000 && response.data && response.data.openid) {
                  app.globalData.userOpenId = response.data.openid
                  uni.$localStorage.setItem('userOpenId', response.data.openid)
                } else {
                  response.data && uni.$alert.showToast(response.data.message)
                }
              })
          },
        })
      },
      /**
       * 获取用户 手机号 注册
       */
      getPhoneNumber: function (e) {
        console.log('getPhoneNumber:', e)
        console.log(e)
        if (e.detail.encryptedData && e.detail.iv) {
          const playload = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionKey: app.globalData.session_key,
            openId: uni.$localStorage.getItem('userOpenId'),
          }
          var self = this
          uni.$api.apiRequest('getUserPhone', playload).then((res) => {
            console.log(res)
            if (res.code === 10000) {
              app.globalData.phone = res.data
              self.loginOrRegister(res.data)
            } else if (res.code == 91000 || res.code == '91000') {
              self.userLogin('getPhone')
            }
          })
        }
      },
      /**
       * 登录 请求
       */
      loginOrRegister(phone) {
        const inviteSceneObj = app.inviteSceneObj || {} // getApp里定义分销、邀请相关信息
        const self = this
        const playload = {
          phone: phone,
          openId: uni.$localStorage.getItem('userOpenId'),
          orgId: app.globalData.orgId || uni.$localStorage.getItem('orgId'),
        }
        // 通过邀请、分销跳转到登录页时设置orgId
        if (inviteSceneObj.sceneValue === '12') {
          playload.orgId = inviteSceneObj.orgId // 设置请求的orgId
        }
        uni.$api.apiRequest('userPhoneLoginCode', playload).then(
          (res) => {
            if (res.code == 10000) {
              uni.$localStorage.setItem('Token', res.data.tokenKey)

              setTimeout(() => {
                // 更新用户信息
                uni.$api
                  .apiRequest('getUserInfo', {
                    orgId: uni.$localStorage.getItem('orgId'),
                  })
                  .then((response) => {
                    if (response.code == 10000 && response.data) {
                      uni.$localStorage.setCurrentUser(response.data)
                      uni.$localStorage.setItem('memberId', response.data.memberId)

                      // 设置注册来源请求参数
                      let requestArg = {
                        organizationId: uni.$localStorage.getItem('orgId'),
                        id: response.data.memberId,
                        registrationSource:
                          app.globalData.registrationSource ||
                          uni.$localStorage.getItem('currentMall').marketName,
                        registrationOrg: uni.$localStorage.getItem('orgId'),
                        channelId: app.globalData.registrationSourceChannelId,
                      }

                      // 通过邀请、分销跳转到登录页时根据场景值设置商场点亮参数
                      if (inviteSceneObj.sceneValue === '12') {
                        // 修改注册来源请求参数
                        requestArg = {
                          organizationId: inviteSceneObj.orgId || null,
                          id: response.data.memberId,
                          registrationOrg: inviteSceneObj.orgId || null,
                          inviteMemberId: inviteSceneObj.memberId || null,
                        }
                      }
                      // 修改注册来源
                      uni.$api.apiRequest('channelUpdate', requestArg)
                      // 这里要判断一下 是否完善了信息，如没有完善信息则要跳转到完善信息页面
                      if (res.data.isPerfect == -1) {
                        uni.navigateTo({
                          url: '/pages/login/registered/registerednew',
                        })
                      } else {
                        uni.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
              }, 200)
            } else if (res.code == 3003) {
              self.setData({
                isShowLoginInfo: true,
              })
            }
          },
          (err) => {
            if (err.indexOf('公众号注册') != -1) {
              this.setData({
                isShowLoginInfo: true,
              })
            }
          }
        )
      },
      // 跳转到手机号登录页面
      jumpPhoneLogin() {
        uni.navigateTo({
          url: './phone/phone',
        })
      },
      toggleCheckBox() {
        this.agreeStatus = !this.agreeStatus
      },
      showAgreeToast() {
        uni.$alert.showToast('请阅读并勾选服务协议')
      },
      /**
       * @deprecated 跳转协议页面
       */
      goProtocol() {
        console.log(222)
        uni.navigateTo({
          url: '/pages/login/protocol/index',
        })
      },
      /**
       * @description 选择商场
       * */

      mallAlertShowOk() {
        this.mallAlertShow = false
        // uni.navigateTo({
        //   url: '/pages/index/switchMall/switchMall',
        // })
      },
    },
  }
</script>

<style lang="less" scoped>
  button::after {
    border: none;
  }

  .view {
    position: relative;
    // display: flex;
    // justify-content: center;

    .logo {
      position: absolute;
      top: 124px;
      width: 113px;
      height: 33px;
    }

    .qy {
      position: absolute;
      top: 220px;
      padding-bottom: 40px;
      width: 665rpx;
    }

    .loginView {
      width: 100vw;
      position: absolute;
      top: 470px;

      .login-btn-container {
        position: relative;
      }

      .login-button-fill {
        width: 670rpx;
        height: 92rpx;
        line-height: 92rpx;
        background: #fe5d4d;
        border-radius: 4px;
        color: rgba(255, 255, 255, 1);
        font-weight: 500;
        font-size: 14px;
      }

      .cover-one {
        z-index: 1;
        position: absolute;
        top: 0;
        width: 670rpx;
        height: 92rpx;
        background: rgba(255, 255, 255, 0);
        border-radius: 8rpx;
        color: rgba(255, 255, 255, 1);
      }

      .login-button-outline {
        width: 670rpx;
        height: 92rpx;
        line-height: 92rpx;
        font-weight: 600;
        font-size: 14px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8rpx;
        color: #000000;
        border: 1px solid #bfbfbf;
      }

      .block-narrow {
        margin-top: 50rpx;
      }

      .cover-phone {
        z-index: 1;
        position: absolute;
        top: 150rpx;
        width: 670rpx;
        height: 92rpx;
        background: rgba(255, 255, 0, 0);
        border-radius: 8rpx;
      }

      .service-block {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;

        .checkbox-normal {
          width: 24rpx;
          height: 24rpx;
          border-radius: 50%;
        }

        .read-text {
          margin-left: 12rpx;
          color: #9b9b9b;
          font-size: 12px;
        }

        .color-text {
          color: #fe5d4d;
          font-size: 12px;
        }
      }
    }
    /* 特权 begin */
    .discount {
      position: absolute;
      top: 190px;
      width: 100%;
      .discount-title {
        font-size: 32rpx;
        font-weight: 500;
        color: #444444;
        line-height: 44rpx;
        margin-bottom: 76rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        text-align: center;
        .mr8 {
          margin-right: 16rpx;
        }
        .ml8 {
          margin-left: 16rpx;
        }
        image {
          width: 22rpx;
          height: 22rpx;
        }
      }
      .discount-content {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #848484;
        line-height: 34rpx;
        display: flex;
        width: 100%;
        justify-content: space-around;
        .discount-content-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          margin-bottom: 54rpx;
        }
        image {
          width: 60rpx;
          height: 60rpx;
          margin-bottom: 16rpx;
        }
      }
    }
    /* 特权 end */
  }
</style>
