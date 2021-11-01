<template>
  <view>
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
          @click="onClosePop"
        ></image>
      </view>
      <!-- 信息内容 -->
      <view class="contentList">
        <!-- 头像 -->
        <view class="item" style="border-bottom: 1rpx solid #e2e2e2;">
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
        <view
          v-for="(item, index) in infons"
          :key="item.type"
          class="contentList-item"
          @click="showPopView(index)"
        >
          <!-- 副标题 -->
          <view class="contentList-item-title">
            <view class="xh" v-if="item.isRequired">*</view> {{ item.title }}
          </view>
          <!-- 内容展示 -->
          <view class="contentList-item-Valuebg">
            <span class="contentList-item-Value" v-if="item.value">{{
              item.value
            }}</span>
            <span
              class="contentList-item-Value"
              style="color:#9AA8B8;"
              v-else
              >{{ item.placeHolder }}</span
            >
            <image
              class="jt"
              v-if="item.showJT && !item.isEdit"
              src="/static/images/more-icon.png"
            ></image>
          </view>
        </view>
      </view>
      <!-- 提交按钮 -->
      <view class="commitViewbg" v-if="pageTitle == '完善个人资料'">
        <view class="commitView" :style="theme.btn" @tap.stop="registuser"
          >提交</view
        >
      </view>
      <!-- 弹出层 -->
      <u-popup v-model="isShow" mode="bottom" @close="onClosePop">
        <!-- toolBar -->
        <view class="pop-toolBar">
          <view
            class="pop-toolBar-title"
            style="color:#9C9C9C;"
            @tap.stop="onClosePop"
            >取消</view
          >
          <view
            class="pop-toolBar-title"
            style="color:#BD8F46;"
            @tap.stop="surePop"
            >确定</view
          >
        </view>
        <!-- 输入框 -->
        <view
          v-if="
            currentInfo.type == 'memberName' ||
              currentInfo.type == 'papersNo' ||
              currentInfo.type == 'detail' ||
              currentInfo.type == 'age' ||
              currentInfo.type == 'plateNo'
          "
        >
          <input
            class="pop-field"
            v-model="inputText"
            placeholder="请设置"
            @input="inputChange"
          />
          <!-- 描述 -->
          <view class="pop-input-placeholder">{{
            currentInfo.type == "memberName"
              ? "2-20个字符，可由中英文、数字、符号组成"
              : ""
          }}</view>
        </view>
      </u-popup>
      <!-- 选择框 -->
      <u-select
        v-model="selectViewShowValue"
        mode="single-column"
        :list="currentInfo.columns"
        @cancel="
          () => {
            this.selectViewShowValue = false;
          }
        "
        @confirm="pickerOnChange"
      ></u-select>
      <!-- 出生日期 -->
      <u-picker
        v-model="birthdayShow"
        mode="time"
        start-year="1920"
        :end-year="maxDate"
        :params="birthdayParams"
        @confirm="onInput"
      ></u-picker>
      <u-select
        v-model="adressShow"
        mode="mutil-column-auto"
        :list="areaList"
        :confirm-color="theme.borderColorValue"
        @confirm="areaOnChange"
      ></u-select>
    </view>
  </view>
</template>

<script>
// pages/login/registered/registered.js
const app = getApp();

export default {
  data() {
    return {
      theme: uni.$theme,
      pageTitle: "个人信息",
      showAlertView: true,
      // 会员字段展示
      infons: [],
      currentInfo: {},
      isShow: false,
      // 输入框的值
      inputText: "",
      // 出生日期
      birthdayParams: {
        year: true,
        month: true,
        day: true,
        hour: false,
        minute: false,
        second: false,
      },
      currentDate: new Date(958799640000).getTime(),
      maxDate: new Date().Format("YYYY"),
      minDate: new Date(1970, 1, 1).getTime(),
      // 省市区
      areaList: {},
      // 用户信息
      userInfo: {},
      isExchangeCoupon: false,
      columnsIdx: "",
      selectViewShowValue: false,
      birthdayShow: false,
    };
  },
  computed: {
    isUpdateMemberName() {
      return this.isUpdateKey("memberName");
    },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let response = uni.$localStorage.getItem("areaData");
    if (!response) {
      // 预加载 省市区数据源
      var self = this;
      uni.$util.getAreaData((response) => {
        let res = uni.$util.serveToCityData(response);
        uni.$localStorage.setItem("areaData", res);
        self.initData(res);
      });
    } else {
      this.initData(response);
    }
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
  methods: {
    /**
     * 跳转到修改手机号
     * */
    jumpUpdatePhone() {
      uni.navigateTo({
        url: "/pages/login/updatePhone/updatePhone",
      });
    },
    initData(response) {
      this.areaList = response;
      this.userInfo = uni.$localStorage.getCurrentUser();
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
            if (item.value && item.value != "未知") {
              obj.isEdit = true;
            }
            if (item.fieldType == "papersNo") {
              obj.placeHolder = "请填写证件号码";

              obj.showJT = false;
            } else if (item.fieldType == "memberName") {
              obj.placeHolder = "请填写真实姓名";

              obj.showJT = false;
            } else if (item.fieldType == "sex") {
              obj.placeHolder = "请选择性别";
              obj.columns = [
                {
                  value: "1",
                  label: "男",
                },
                {
                  value: "2",
                  label: "女",
                },
              ];
              obj.value = item.value;
              obj.showJT = true;
            } else if (item.fieldType == "maritalStatus") {
              obj.placeHolder = "请选择婚姻状况";
              obj.columns = [
                {
                  value: "1",
                  label: "未婚",
                },
                {
                  value: "2",
                  label: "已婚",
                },
              ];
              obj.value = item.value == 1 ? "已婚" : "未婚";
              obj.showJT = true;
            } else if (item.fieldType == "birthday") {
              obj.placeHolder = "请选择出生日期";
              if (item.value) {
                obj.value = new Date(item.value).Format("YYYY-MM-DD");
              }
              obj.showJT = true;
            } else if (item.fieldType == "papersType") {
              obj.placeHolder = "请选择证件类型";
              obj.columns = [
                {
                  value: "1",
                  label: "身份证",
                },
                {
                  value: "2",
                  label: "护照",
                },
                {
                  value: "3",
                  label: "港澳台胞证",
                },
              ];
              if (item.value) {
                obj.value =
                  item.value == 1
                    ? "身份证"
                    : item.value == 2
                    ? "护照"
                    : "港澳台胞证";
              } else {
                obj.value = "身份证";
              }

              obj.showJT = true;
            } else if (item.fieldType == "memberName1") {
              obj.placeHolder = "请选择所在地区";
              obj.showJT = true;
            } else if (item.fieldType == "memberName2") {
              obj.placeHolder = "请填写详细地址";

              obj.showJT = false;
            } else if (item.fieldType == "plateNo") {
              obj.placeHolder = "请填写车牌号";

              obj.showJT = false;
            } else if (item.fieldType == "detail") {
              obj.placeHolder = "请填写详细地址";

              obj.showJT = false;
            } else if (item.fieldType == "address") {
              obj.placeHolder = "请选择所在地区";
              obj.showJT = true;

              if (item.value.province) {
                obj.value =
                  item.value.province + item.value.city + item.value.county;
              } else {
                obj.value = "";
              }
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
    showPopView(type) {
      let info = this.infons[type];
      console.log(type, "inde____", info);

      if (info.type == "phone") return this.jumpUpdatePhone();
      if (info.isEdit) return;
      // 这里先给选中的obj赋值 是为了pickview 能回显
      var columnsIdx = 0;

      if (info.columns) {
        columnsIdx = info.columns.indexOf(info.value);
      }

      this.currentInfo = {
        index: type,
        ...info,
      };
      this.columnsIdx = columnsIdx;
      if (
        info.type == "memberName" ||
        info.type == "papersNo" ||
        info.type == "age"
      ) {
        this.isShow = true;
      } else if (info.type == "birthday") {
        this.birthdayShow = true;
      }

      this.selectViewShowValue =
        this.currentInfo.type == "sex" ||
        this.currentInfo.type == "papersType" ||
        this.currentInfo.type == "maritalStatus";
    },
    /**
     * 关闭弹框
     */
    onClosePop() {
      this.showAlertView = false;
      this.isShow = false;
      this.inputText = "";
    },
    /**
     * 输入框 确定 事件
     * */

    surePop() {
      console.log(this.inputText);
      if (this.currentInfo.type == "papersNo") {
        var isSfz = true;
        this.infons.forEach((item) => {
          if (item.type == "papersType") {
            if (item.value != "身份证") {
              isSfz = false;
            }
          }
        });

        if (isSfz) {
          var id = /^[1-8][0-9]{5}(19|20)\d{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;

          if (
            !this.currentInfo.value ||
            id.test(this.currentInfo.value) === false
          ) {
            return uni.$alert.showToast("请输入正确的证件号码");
          }
          // 如果是 身份证号
          if (this.currentInfo.type == "papersNo") {
            this.infons.forEach((item) => {
              if (item.type == "birthday" && !item.value) {
                item.value = uni.$util.getBirthdayFromIdCard(
                  this.currentInfo.value
                );
              } else if (item.type == "age" && !item.value) {
                let sr = uni.$util.getBirthdayFromIdCard(
                  this.currentInfo.value
                );
                item.value = uni.$util.getAgeFromBirthday(sr);
              } else if (item.type == "sex" && !item.value) {
                item.value = uni.$util.getSexFromIdCard(this.currentInfo.value);
              }
            });
          }
        }
      } else if (this.currentInfo.type == "memberName") {
        if (
          !this.currentInfo.value ||
          this.currentInfo.value.length < 2 ||
          this.currentInfo.value.length > 20
        ) {
          return uni.$alert.showToast("请按要求输姓名");
        }
      } else if (this.currentInfo.type == "papersType") {
      } else if (this.currentInfo.type == "age") {
        let zz = /^[0-9]*$/;

        if (zz.test(this.currentInfo.value) === false) {
          return uni.$alert.showToast("请输入正确的年龄");
        }
      } else if (this.currentInfo.type == "address") {
        this.currentInfo.value = "北京市 北京市 东城区";
        this.currentInfo.adress = ["北京市", "北京市", "东城区"];
        this.currentInfo.adressCode = JSON.parse(
          '[{"code":"110000","name":"北京市"},{"code":"110100","name":"北京市"},{"code":"110101","name":"东城区"}]'
        );
      }
      // 姓名交验 "^([\\u4e00-\\u9fa5]{1,20}|[a-zA-Z\\.\\s]{1,20})$"
      this.infons[this.currentInfo.index] = this.currentInfo;
      this.isShow = false;

      if (this.pageTitle == "个人信息") {
        // 个人信息情况下 修改任何字段都调用接口
        this.registuser([this.currentInfo]);
      }
    },
    /**
     * 输入框 姓名、证件号、年龄
     */
    inputChange(e) {
      console.log(e.detail.value);
      this.currentInfo.value = e.detail.value;
    },

    /**
     * picker 先择器 性别 、 婚姻状况 、证件类型
     */
    pickerOnChange(event) {
      const { value, label } = event[0];
      if (this.currentInfo.type == "papersType") {
        this.infons.forEach((item) => {
          if (item.type == "papersNo") {
            item.value = "";
          }
          if (item.type == "papersType") {
            item.value = label;
          }
        });
      }
      this.currentInfo.value = label;
      if (
        this.currentInfo.type == "birthday" ||
        this.currentInfo.type == "sex" ||
        this.currentInfo.type == "maritalStatus"
      ) {
        this.infons[this.currentInfo.index] = this.currentInfo;
      }
      if (this.pageTitle == "个人信息") {
        // 个人信息情况下 修改任何字段都调用接口
        this.registuser([this.currentInfo]);
      }
    },
    /**
     * 出生日期
     */
    onInput(event) {
      this.currentInfo.value = `${event.year}-${event.month}-${event.day}`;
      this.infons[this.currentInfo.index] = this.currentInfo;
      if (this.pageTitle == "个人信息") {
        // 个人信息情况下 修改任何字段都调用接口
        this.registuser([this.currentInfo]);
      }
    },

    /**
     * 所在地区
     */
    areaOnChange(values) {
      console.log(values);
      if (values && values.length > 0) {
        this.currentInfo.value = "";
        var ad = [];
        values = values.map((item) => {
          ad.push(item.label);
          this.currentInfo.value += item.label + " ";
          return {
            name: item.label,
            code: item.value,
          };
        });
        this.currentInfo.adress = ad;
        this.currentInfo.adressCode = values;
      } else {
        this.currentInfo.value = "北京市 北京市 东城区";
        this.currentInfo.adress = ["北京市", "北京市", "东城区"];
        this.currentInfo.adressCode = JSON.parse(
          '[{"code":"110000","name":"北京市"},{"code":"110100","name":"北京市"},{"code":"110101","name":"东城区"}]'
        );
      }
      this.currentInfo = this.currentInfo;
    },
    /**
     * 授权 头像
     */
    getUserInfo: function(e) {
      let self = this;
      if (e.detail.userInfo) {
        uni.$localStorage.setCurrentUser(e.detail.userInfo);
        if (e.detail.userInfo.gender > 0) {
          self.registuser([
            {
              title: "性别",
              type: "sex",
              isRequired: false,
              value: e.detail.userInfo.gender == 1 ? "男" : "女",
            },
          ]);
          self.infons.forEach((item) => {
            if (item.type == "sex") {
              item.value = e.detail.userInfo.gender == 1 ? "男" : "女";
            }
          });
        }
        //  会员昵称 代替会员姓名
        this.infons.forEach((item) => {
          if (item.type == "memberName") {
            if (e.detail.userInfo.nickName && !item.value) {
              item.value = e.detail.userInfo.nickName;
            }
          }
        });

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
    registuser(datas) {
      var isOk = "";
      var pram = {
        orgId: uni.$localStorage.getItem("orgId"),
        memberId: this.userInfo.memberId,
        phone: this.userInfo.phone,
        isPerfect: 1,
      };

      if (!this.userInfo.headImg) {
        return uni.$alert.showToast("请完善头像信息");
      } else {
        pram.nickName = this.userInfo.nickName;
        pram.headImg = this.userInfo.headImg;
      }

      // 参数组装
      function getParams(data) {
        let obj = {
          fieldsName: "",
        };
        data.forEach((item) => {
          if (item.isRequired) {
            if (!item.value || item.value.length < 1) {
              isOk = item.title;
            }
          }

          if (item.type == "papersNo") {
            obj.papersNo = item.value;
          } else if (item.type == "memberName") {
            obj.memberName = item.value;
          } else if (item.type == "sex") {
            obj.sex = item.value == "男" ? "M" : "F";
          } else if (item.type == "maritalStatus") {
            obj.maritalStatus = item.value == "未婚" ? "0" : "1";
          } else if (item.type == "birthday") {
            obj.birthday = item.value;
          } else if (item.type == "age") {
            obj.age = item.value;
          } else if (item.type == "papersType") {
            obj.papersType =
              item.value == "身份证" ? "1" : item.value == "护照" ? "2" : "3";
          } else if (item.type == "detail") {
            obj.detailed = item.value;
          } else if (item.type == "plateNo") {
            obj.plateNo = item.value;
          } else if (item.type == "address") {
            if (item.adress) {
              obj.province = item.adress[0];
              obj.city = item.adress[1];
              obj.county = item.adress[2];
            }
          }
          // 完善字段
          if (item.value != undefined && item.value != "") {
            obj.fieldsName += item.title;
          }
        });
        return obj;
      }
      if (datas && datas.length) {
        pram = { ...pram, ...getParams(datas) };
      } else {
        pram = { ...pram, ...getParams(this.infons) };
      }

      if (!isOk) {
        uni.$api.apiRequest("saveUserInfo", pram).then((res) => {
          if (res.code == 10000 && !datas.length) {
            if (this.isExchangeCoupon) {
              uni.navigateBack({});
            } else {
              // 判断一下当前是不是场景模式在运行
              if (app.globalData.isScene) {
                uni.$scene.next();
              } else {
                uni.switchTab({
                  url: "/pages/index/index",
                });
              }
            }
          }
        });
      } else {
        uni.$alert.showToast("请完善" + isOk + "信息");
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
  },
};
</script>
<style scoped lang="less">
button::after {
  border: none;
}
.alertView {
  margin-left: 5.3vw;
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
.view {
  background-color: white;
}

.headerView {
  display: flex;
  align-items: center;
  height: 188rpx;
  border-bottom: 20rpx solid #f8f6f9;
  background-color: white;
}

.getUserInfoBtn {
  position: absolute;
  width: 70vw;
  height: 50px;
  right: 0px;
  background: transparent;
}

.userTx {
  height: 112rpx;
  width: 112rpx;
  margin-left: 64rpx;
  border-radius: 56rpx;
}

.header-info {
  margin-left: 32rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-info-Name {
  height: 37rpx;
  font-size: 32rpx;
  font-family: Arial-BoldMT, Arial;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 37rpx;
  margin-bottom: 5rpx;
}

.header-info-iphone {
  margin-top: 5rpx;
  height: 32rpx;
  font-size: 28rpx;
  font-family: Arial-BoldMT, Arial;
  font-weight: normal;
  color: rgba(155, 155, 155, 1);
  line-height: 32rpx;
}

/* 内容 */

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

.jt {
  width: 32rpx;
  height: 19rpx;
}

.contentList {
  padding: 40rpx;
  background-color: white;
  padding-bottom: 170rpx;
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
}

.contentList-item {
  height: 90rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #e2e2e2;

  //   padding: 0rpx 28rpx;
}

.contentList-item-title {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(143, 143, 143, 1);
  line-height: 22rpx;
  margin-bottom: 11rpx;
}

.contentList-item-Valuebg {
  margin-top: 11rpx;
  padding-bottom: 11rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contentList-item-Value {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(43, 43, 43, 1);
}

/* 提交 */
.commitViewbg {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 168rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rpx 20rpx 60rpx 0rpx rgba(0, 0, 0, 0.15);
}

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

/* 弹框 */

.coustomPopStyle {
}

.pop-toolBar {
  padding: 32rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pop-toolBar-title {
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
}

.pop-field {
  height: 60rpx;
  margin: 32rpx 60rpx 0px 60rpx;
  border-bottom: 1rpx solid #c8c8c8;
}

.pop-input-placeholder {
  padding: 18rpx 60rpx 60rpx 60rpx;
  text-align: center;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(137, 137, 137, 1);
}

.van-picker__toolbar {
  display: none !important;
}
</style>
