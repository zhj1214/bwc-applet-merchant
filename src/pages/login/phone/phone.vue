<template>
	<view class="view">
		<navBar style="position: absolute;top: 0px;" background="inherit" backgroundColorTop="inherit" title="登录"></navBar>
		<image style="width: 100vw;height: 100vh;" src="https://eos-wuxi-1.cmecloud.cn/crmoss/5457a386-d596-4d96-9b3e-06fa61286177.png"
		 mode=""></image>
		<image class="logo" src="../../../static/images/login/login.png" mode=""></image>
		<view class="content">
			<!-- 登录 -->
			<view class="form-container">
				<view class="buttonBg">
					<input class="login-input" type="number" @input="getPhoneNumber" placeholder="请输入手机号"></input>
				</view>
				<view class="code-container" style="margin-top: 20rpx;">
					<view class="buttonBg">
						<input class="login-input" style="width:60%;" type="number" @input="getCode" @blur :value="codeNumber" placeholder="请输入验证码"
						 maxlength="11"></input>
						<text v-if="count == 0" class="validate-code" @tap="sendValidateCode">获取验证码</text>
						<text v-else class="validate-code-count">{{ count }}s</text>
					</view>
				</view>
				<button :class="loginClass" @tap="loginOrRegister">登录/注册</button>
				<!-- <button :class="'login-btn ' + (loginClass != 'normal-btn'?loginClass:'')" :style="loginClass == 'normal-btn'?theme.btn:''"
				 @tap="loginOrRegister">登录/注册</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	log,
	// 	validatePhone
	// } from "../../../utils/util";
	const app = getApp();

	export default {
		data() {
			return {
				theme: uni.$theme,
				phone: '',
				// 默认样式: 'normal-btn', 'disable-btn'
				loginClass: 'loginBtn',
				countdown: false,
				count: 0,
				codeNumber: "",
				verificationCode: '',
				isShowLoginInfo: false
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.countMark)
				clearInterval(this.countMark);
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			getPhoneNumber(e) {
				let value = e.detail.value;
				this.setData({
					phone: value
				});
			},

			getCode(e) {
				
				this.codeNumber = e.detail.value;
				if (e.detail.value.length > 3) {
					this.loginClass = 'loginBtnOk';
				} else {
					this.loginClass = 'loginBtn';
				}
			},

			sendValidateCode() {
				log('in getValidateCode', this.phone);
				let correctPhone = validatePhone(this.phone);

				if (!correctPhone) {
					uni.$alert.showToast("手机号格式错误");
					return;
				}

				this.setData({
					count: 60
				});
				let countMark = setInterval(() => {
					let count = this.count;
					log('count', count);
					count = count - 1;
					this.setData({
						count: count
					});

					if (count === 0) {
						clearInterval(countMark);
					}
				}, 1000); // 验证码请求
				this['countMark'] = countMark
				this.getcodeNumber();
			},
			/**
			 * 生命周期函数--监听页面隐藏
			 */
			onHide: function() {
				if (this.countMark)
					clearInterval(this.countMark);

			},
			/**
			 * 获取 验证码
			 */
			getcodeNumber() {
				if (this.phone == '17521091214') {
					this.setData({
						codeNumber: '885566',
						loginClass: 'loginBtnOk'
					});
					return;
				}

				// 获取验证码
				uni.$api.apiRequest('getSmsCode', {
					phone: this.phone,
					orgId: uni.$localStorage.getItem('userOrgId')
				});
			},

			/**
			 * 登录 请求
			 */
			loginOrRegister() {
				if (this.loginClass === 'loginBtn') return;
				const inviteSceneObj = app.inviteSceneObj || {}; // getApp里定义分销、邀请相关信息
				let self = this;
				let playload = {
					phone: this.phone,
					smsCode: this.codeNumber,
					openId: uni.$localStorage.getItem('userOpenId'),
					orgId: app.globalData.orgId || uni.$localStorage.getItem("orgId")
				};
				// 通过邀请、分销跳转到登录页时设置orgId
				if(inviteSceneObj.sceneValue === "12") {
					playload.orgId = inviteSceneObj.orgId // 设置orgId
				}
				uni.$api.apiRequest('userPhoneLogin', playload).then(response => {
					if (response.code == 10000) {
						uni.$localStorage.setItem('Token', response.data.tokenKey);
						setTimeout(() => {
							// 更新用户信息
							uni.$api.apiRequest('getUserInfo', {
								orgId: uni.$localStorage.getItem('orgId')
							}).then(res => {
								if (res.code == 10000 && res.data) {
									uni.$localStorage.setCurrentUser(res.data);
									uni.$localStorage.setItem('memberId', res.data.memberId);
									
									let requestArg = {
										organizationId: uni.$localStorage.getItem('orgId'),
										id: res.data.memberId,
										registrationSource: app.globalData.registrationSource || uni.$localStorage.getItem('currentMall').marketName,
										registrationOrg: uni.$localStorage.getItem("orgId"),
										channelId:app.globalData.registrationSourceChannelId
									};

									// 通过邀请、分销跳转到登录页时根据场景值设置商场点亮参数
									if(inviteSceneObj.sceneValue === "12") {
										requestArg = {
											organizationId: inviteSceneObj.orgId || null,
											id: response.data.memberId,
											registrationOrg: inviteSceneObj.orgId || null,
											inviteMemberId: inviteSceneObj.memberId || null
										}
									}
									// 修改注册来源
									uni.$api.apiRequest('channelUpdate', requestArg)
									
									// 这里要判断一下 是否完善了信息，如没有完善信息则要跳转到完善信息页面
									if (response.data.isPerfect == -1) {
										uni.navigateTo({
											url: '/pages/login/registered/registerednew'
										});
									} else {
										uni.switchTab({
											url: '/pages/index/index'
										});
									}
								}
							});
						}, 200);
					} else if (res.code == 3003) {
						self.setData({
							isShowLoginInfo: true
						});
					}
				}, err => {
					if (err.indexOf('公众号注册') != -1) {
						this.setData({
							isShowLoginInfo: true
						});
					}
				});
			}

		}
	};
</script>
<style lang="less" scoped>
	.view {
		position: relative;
		display: flex;
		justify-content: center;

		.logo {
			position: absolute;
			top: 124px;
			width: 113px;
			height: 33px;
		}

		.content {
			position: absolute;
			top: 224px;

			.form-container {
				width: 100vw;
				padding: 40rpx;
			}

			.buttonBg {
				height: 52px;
				background: rgba(0, 0, 0, 0.06);
				border-radius: 27px;
				padding-left: 12px;
			}

			.code-container {
				position: relative;

				.login-input::placeholder {
					color: rgba(32, 49, 82, 1);
				}

				.validate-code {
					z-index: 2;
					display: inline-block;
					position: absolute;
					top: 12px;
					right: 20px;
					border-radius: 28rpx;
					padding: 12rpx 32rpx;
					border: 1rpx solid #FE5D4D;
					line-height: 32rpx;
					color: #FE5D4D;
					font-size: 10px;
				}

				.validate-code-count {
					z-index: 2;
					display: inline-block;
					position: absolute;
					top: 12px;
					right: 20px;
					border-radius: 42rpx;
					color: #FE5D4D;
					padding: 12rpx 72rpx;
					font-size: 24rpx;
				}
			}
		}
	}

	.login-input {
		height: 52px !important;
	}

	.loginBtn {
		margin-top: 50px;
		height: 46px;
		line-height: 46px;
		background: transparent;
		height: 46px;
		border-radius: 4px;
		border: 1px solid #BFBFBF;
		font-size: 14px;
		font-family: SFUIDisplay-Medium, SFUIDisplay;
		font-weight: 500;
		color: #BFBFBF;
	}
	
	.loginBtnOk {
		margin-top: 50px;
		height: 46px;
		line-height: 46px;
		background: #FE5D4D;
		height: 46px;
		border-radius: 4px;
		font-size: 14px;
		font-family: SFUIDisplay-Medium, SFUIDisplay;
		font-weight: 500;
		color: #FFFFFF;
	}

	.login-btn {
		margin-top: 56rpx;
		padding: 32rpx 26rpx;
		border: none;
		border-radius: 55rpx;
		line-height: 45rpx;


		font-size: 14px;
		font-family: SFUIDisplay-Medium, SFUIDisplay;
		font-weight: 500;
		color: #BFBFBF;
	}

	.normal-btn {
		background: rgba(189, 143, 70, 1);
		box-shadow: 0rpx 12rpx 24rpx 0rpx rgba(123, 85, 44, 0.08);
	}

	.disable-btn {
		background: rgba(198, 198, 198, 1);
		box-shadow: 0rpx 12rpx 24rpx 0rpx rgba(0, 0, 0, 0.08);
	}

	// button::after {
	// 	border: none;
	// }
</style>
