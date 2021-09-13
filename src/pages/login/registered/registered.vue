<template>
  <view class="viewBg">
    <navBar :title="pageTitle" background="#fff"></navBar>
    <view class="view">
      <!-- 提示框 -->
      <view
        class="alertView"
        v-if="showAlertView && pageTitle == '完善个人资料'"
      >
        <image
          style="width: 14px;height: 14px;"
          src="../../../static/images/login/warring.png"
          mode=""
        ></image>
        <view class="alertViewText">
          以下信息（除手机号外）保存后不可修改，请谨慎填写
        </view>
        <image
          style="width: 12px;height: 12px;"
          src="../../../static/images/close.png"
          mode=""
          @click="closePop"
        ></image>
      </view>
      <!-- 头像 -->
      <view class="item">
        <view class="itemText flex-row"> <view class="xh">*</view>头像 </view>
        <view class="flex-row" v-if="!userInfo.headImg">
          <button
            class="getUserInfoBtn"
            open-type="getUserInfo"
            @getuserinfo="getUserInfo"
          ></button>
          <view class="itemRightText">点击授权获取头像信息</view>
          <image
            style="width: 9px;height: 9px;margin-left: 4px;"
            src="../../../static/images/car/left1.png"
            mode=""
          ></image>
        </view>
        <view v-else>
          <image
            style="width: 40px;height: 40px;border-radius: 50%;"
            :src="userInfo.headImg"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <!-- 姓名 -->
      <view class="item">
        <view class="itemText flex-row">
          <view class="xh" v-if="isRequiredName">*</view>姓名
        </view>
        <view class="flex-row" v-if="isUpdateMemberName">
          <input
            class="itemRightText"
            style="text-align: right;"
            type="text"
            v-model="inputName"
            placeholder="请输入"
          />
          <image
            style="width: 9px;height: 9px;margin-left: 4px;"
            src="../../../static/images/car/left1.png"
            mode=""
          ></image>
        </view>
        <view class="itemRightText" v-else>
          {{ inputName }}
        </view>
      </view>
      <!-- 手机号 -->
      <view class="item">
        <view class="itemText flex-row"> <view class="xh">*</view>手机号 </view>
        <view class="flex-row" @click="jumpUpdatePhone">
          <view class="itemRightText">{{ userInfo.phone }}</view>
          <image
            style="width: 9px;height: 9px;margin-left: 4px;"
            src="../../../static/images/car/left1.png"
            mode=""
          ></image>
        </view>
      </view>
      <!-- 性别 -->
      <view class="item" @click="showPop(1)">
        <view class="itemText flex-row">
          <view class="xh" v-if="isRequiredSex">*</view>性别
        </view>
        <view class="flex-row">
          <view class="itemRightText" v-if="!userSex">请设置</view>
          <image
            v-if="!userSex"
            style="width: 9px;height: 9px;margin-left: 4px;"
            src="../../../static/images/car/left1.png"
            mode=""
          ></image>
          <view class="itemRightText" style="color: #404040;" v-else>
            {{ userSex }}
          </view>
        </view>
      </view>
      <!-- 生日 -->
      <view class="item" @click="showPop(2)">
        <view class="itemText flex-row">
          <view class="xh" v-if="isRequiredBirthDay">*</view>生日
        </view>
        <view class="flex-row">
          <view class="itemRightText" v-if="!userBirthday">请设置</view>
          <image
            v-if="!userBirthday"
            style="width: 9px;height: 9px;margin-left: 4px;"
            src="../../../static/images/car/left1.png"
            mode=""
          ></image>
          <view class="itemRightText" style="color: #404040;" v-else>
            {{ userBirthday }}
          </view>
        </view>
      </view>
      <!-- 弹框显示 -->
      <u-picker
        v-model="showPopView"
        mode="time"
        :start-year="1920"
        :params="params"
        @confirm="confirmBirthday"
        @cancel="closePop"
      ></u-picker>
      <u-select
        v-model="showSex"
        :list="sexList"
        @confirm="confirmSex"
        @cancel="closePop"
      ></u-select>
      <!-- 提交按钮 -->
      <view class="commitViewbg" v-if="pageTitle == '完善个人资料'">
        <view class="commitView" @click="registuser">提交</view>
      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
  data() {
    return {
      //
      pageTitle: "个人信息",
      showAlertView: true,
      inputName: "", // 姓名
      userSex: "", // 性别
      userBirthday: "", // 生日
      showPopView: false,
      params: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false,
      },
      showSex: false,
      sexList: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ],
      isRequiredName: false, // 姓名必填
      isRequiredSex: false, // 性别必填
      isRequiredBirthDay: false, // 生日必填
      //
      // 会员字段展示
      infons: [],
      currentInfo: {},
      // 最大选择时间
      maxTimeDate: new Date().getTime(),
      // 用户信息
      userInfo: {
        headImg: "",
      },
      isExchangeCoupon: false,
    };
  },
  computed: {
    isUpdateMemberName() {
      return this.isUpdateKey("memberName");
    },
  },

  /**
   * 生命周期函数--监听页面加载
   * 1.完善资料进来，会有一个提交按钮，必填字段未完善不能提交（头像、手机号永久必填）
   * 2.个人信息页面  如果已完善的字段不能再修改
   */
  onLoad: function(options) {
    console.log(options);
    this.options = options;
    if (options.pageType == 2) {
      this.pageTitle = "个人信息";
      // 获取本地用户信息
      this.userInfo = uni.$localStorage.getCurrentUser();
    } else {
      this.pageTitle = "完善个人资料";
    }

    // 是否是兑换券逻辑，兑换券完善完成后，不跳转首页返回上一页
    if (options.isExchangeCoupon)
      this.setData({
        isExchangeCoupon: true,
      });
    this.getUserKeys();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.getSSQData()
  },
  watch: {
    inputName(newVal, blodVal) {
      if (!this.ismemberName) {
        // 调用接口 向后台更新用户信息
        uni.$api.apiRequest("saveUserInfo", {
          memberName: newVal,
          orgId: uni.$localStorage.getItem("orgId"),
          memberId: uni.$localStorage.getItem("memberId"),
          fieldsName: "修改姓名",
        });
      }
    },
  },
  methods: {
    /**
     * 跳转到修改手机号
     * */
    jumpUpdatePhone() {
      uni.navigateTo({
        url: "/pages/login/updatePhone/updatePhone",
      });
    },

    /**
     * 获取当前要完善的字段
     */
    getUserKeys() {
      var self = this;
      uni.$api.apiRequest("userRegistKey").then((res) => {
        if (res.code == 10000 && res.data.length > 0) {
          let arr = res.data.map((item) => {
            let obj = {
              title: item.fieldName,
              type: item.fieldType,
              isRequired: item.requiredFields == 1 ? true : false,
              value: item.fieldType ? item.value : "",
            };

            if (item.fieldType == "memberName") {
              if (obj.isRequired) self.isRequiredName = true;
              if (item.value && item.value != "未知") {
                self.ismemberName = true;
                self.inputName = item.value;
              }
            } else if (item.fieldType == "phone") {
              if (item.value && item.value != "未知")
                self.userInfo.phone = item.value;
            } else if (item.fieldType == "sex") {
              if (obj.isRequired) self.isRequiredSex = true;
              if (item.value && item.value != "未知") self.userSex = item.value;
            } else if (item.fieldType == "birthday") {
              if (obj.isRequired) self.isRequiredBirthDay = true;
              if (item.value && item.value != "未知")
                self.userBirthday = new Date(item.value).Format("YYYY-MM-DD");
            }
            return obj;
          });
          self.infons = arr;
        }
      });
    },

    /**
     * 展示弹框
     */
    showPop(e) {
      if (e == 1 && (this.updateUserSex || !this.userSex)) {
        this.showSex = true;
      } else if (this.updateBirthday || !this.userBirthday) {
        this.showPopView = true;
      }
    },
    /**
     * 关闭弹框
     */
    closePop() {
      this.showSex = false;
      this.showPopView = false;
      this.showAlertView = false;
    },
    /**
     * 生日选择
     * */
    confirmBirthday(e) {
      console.log(e);
      this.updateBirthday = true;
      this.userBirthday = `${e.year}-${e.month}-${e.day}`;
      if (this.options.pageType == 2) {
        // 调用接口 向后台更新用户信息
        uni.$api.apiRequest("saveUserInfo", {
          birthday: this.userBirthday,
          orgId: uni.$localStorage.getItem("orgId"),
          memberId: uni.$localStorage.getItem("memberId"),
          fieldsName: "修改生日",
        });
      }
    },
    /**
     * 性别选择
     * */
    confirmSex(e) {
      console.log(e);
      this.updateUserSex = true;
      this.userSex = e[0].label;
      if (this.options.pageType == 2) {
        // 调用接口 向后台更新用户信息
        uni.$api.apiRequest("saveUserInfo", {
          sex: this.userSex == "男" ? "M" : "F", // 性别(男=M, 女=F)
          orgId: uni.$localStorage.getItem("orgId"),
          memberId: uni.$localStorage.getItem("memberId"),
          fieldsName: "修改性别",
        });
      }
    },
    /**
     * 校验是否完善过相应字段
     * */
    isUpdateKey(key) {
      var isok = true;
      this.infons.forEach((item) => {
        if (item.type == key) {
          if (item.value) isok = false;
        }
      });
      return isok;
    },
    /**
     * 授权 头像
     */
    getUserInfo: function(e) {
      console.log(e);
      let self = this;
      if (e.detail.userInfo) {
        uni.$localStorage.setCurrentUser(e.detail.userInfo);
        if (e.detail.userInfo.gender > 0) {
          self.confirmSex([
            {
              value: e.detail.userInfo.gender,
              label: e.detail.userInfo.gender == 1 ? "男" : "女",
            },
          ]);
        }

        self.setData(
          {
            userInfo: {
              ...e.detail.userInfo,
              ...self.userInfo,
              headImg: e.detail.userInfo.avatarUrl,
              nickName: e.detail.userInfo.nickName,
            },
          },
          () => {
            // 调用接口 向后台更新用户信息
            uni.$api.apiRequest("saveUserInfo", {
              nickName: e.detail.userInfo.nickName,
              phone: self.userInfo.phone,
              orgId: uni.$localStorage.getItem("userOrgId"),
              headImg: e.detail.userInfo.avatarUrl,
              memberId: uni.$localStorage.getItem("memberId"),
              fieldsName: "昵称,头像url",
            });
            app.globalData.userInfo = self.userInfo;
          }
        );
      } else {
        uni.showToast({
          title: "授权失败 请先授权",
          icon: "none",
          duration: 2000,
        });
      }
    },

    /**
     * 注册事件  headImg nickName
     * @parameter   isPerfect 代表书否完善过信息  1 已完善 -1 未完善
     */
    registuser() {
      var isOk = "";
      var pram = {
        memberId: uni.$localStorage.getItem("memberId") || this.userInfo.memberId,
        phone: this.userInfo.phone,
        isPerfect: 1,
      };
      pram.fieldsName = "";

      if (this.isRequiredName && !this.inputName) {
        isOk = "姓名";
      } else if (this.inputName) {
        pram.memberName = this.inputName;
        pram.fieldsName += "姓名";
      }

      if (this.isRequiredSex && !this.userSex) {
        isOk += "性别";
      } else if (this.userSex) {
        pram.sex = this.userSex == "男" ? "M" : "F"; // 性别(男=M, 女=F)
        pram.fieldsName += "性别";
      }

      if (this.isRequiredBirthDay && !this.userBirthday) {
        isOk += "生日";
      } else if (this.userBirthday) {
        pram.birthday = this.userBirthday;
        pram.fieldsName += "生日";
      }

      if (!this.userInfo.headImg) {
        isOk += "头像";
      }

      if (!isOk) {
        uni.$api.apiRequest("saveUserInfo", pram).then((res) => {
          if (res.code == 10000) {
            // 修改注册来源
            uni.$api.apiRequest("channelUpdate", {
              organizationId: uni.$localStorage.getItem("orgId"),
              id: uni.$localStorage.getItem("memberId"),
              registrationSource: app.globalData.registrationSource || uni.$localStorage.getItem("currentMall")
                .marketName,
                registrationOrg: uni.$localStorage.getItem("orgId"),
                channelId:app.globalData.registrationSourceChannelId
            });
            if (this.isExchangeCoupon) {
              uni.navigateBack({});
            } else {
               uni.switchTab({
                  url: "/pages/index/index",
                });
            }
          }
        });
      } else {
        uni.$alert.showToast("请完善" + isOk + "信息");
      }
    },
  },
};
</script>
<style lang="less" scoped>
button::after {
  border: none;
}

.xh {
  width: 12rpx;
  height: 22rpx;
  font-size: 24rpx;
  font-family: SFUIDisplay-Regular, SFUIDisplay;
  font-weight: 400;
  color: rgba(255, 76, 76, 1);
  line-height: 22rpx;
  margin: 0rpx 6rpx;
}

.viewBg {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.view {
  background-color: white;
  padding: 16px 20px;

  .alertView {
    width: 89.4vw;
    height: 62px;
    background: #fffbe6;
    border-radius: 2px;
    border: 1px solid #ffe58f;
    display: flex;
    justify-content: space-between;
    padding: 12px;

    .alertViewText {
      flex: 1;
      padding: 0px 4px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .item {
    display: flex;
    padding: 16px 0px;
    align-items: center;
    justify-content: space-between;

    .itemText {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #404040;
    }

    .itemRightText {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #bfbfbf;
    }
  }

  .getUserInfoBtn {
    position: absolute;
    width: 70vw;
    height: 50px;
    right: 0px;
    background: transparent;
  }
}

/* 提交 */
.commitViewbg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 168rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 20rpx 60rpx 0rpx rgba(0, 0, 0, 0.15);

  .commitView {
    margin: 20rpx 32rpx 0rpx 32rpx;
    height: 80rpx;
    /* background: rgba(191, 191, 191, 1); */
    background-color: #dbb678;
    border-radius: 8rpx;
    font-size: 28rpx;
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 80rpx;
    text-align: center;
  }
}
</style>
