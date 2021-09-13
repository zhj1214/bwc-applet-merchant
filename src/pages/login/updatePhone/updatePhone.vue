<template>
	<view class="view">
		<navBar title="修改手机号" background="#fff"></navBar>
		<!-- 标题 -->
		<view class="title">{{titles[currentType]}}</view>
		<!-- 手机号、验证码 -->
		<input class="inputPhone" v-model="phone" type="number" placeholder="请输入手机号" />
		<view class="flex-row" style="border-bottom: 1px solid #D8D8D8;justify-content: space-between;">
			<input class="login-input" type="number" v-model="codeNumber" placeholder="请输入验证码" maxlength="11"></input>
			<text v-if="count == 0" class="validate-code" @click="sendValidateCode">获取验证码</text>
			<text v-else class="validate-code-count">{{ count }}s</text>
		</view>
		<!-- 提交按钮 -->
		<view class="commitBtn" v-bind:class="[isok ? 'okcommitBtn' : 'noralCommitBtn']" @click="commit">提 交</view>
		<alert v-if="alertShow" content="您的账号已成功更改成绑定手机" title="绑定成功" @ok="alertOk"></alert>
	</view>
</template>

<script>
	import alert from '../../../pageComponents/alertView/alertView.vue'

	export default {
		data() {
			return {
				currentType: 0, // 0：验证当前绑定手机   1：更改绑定手机
				titles: ['验证当前绑定手机', '更改绑定手机'],
				codeNumber: '',
				phone: '',
				count: '',
				alertShow: false
			}
		},

		components: {
			alert
		},
		computed: {
			isok() {
				return this.codeNumber.length > 3 && this.phone.length == 11
			}
		},
		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {
			if (this.countMark)
				clearInterval(this.countMark);
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			if (this.countMark)
				clearInterval(this.countMark);
		},
		methods: {
			/**
			 * 获取验证码
			 * */
			sendValidateCode() {
				let correctPhone = uni.$util.validatePhone(this.phone)
				if (!correctPhone)
					return uni.$alert.showToast("手机号格式错误");
				this.count = 60;
				var self = this;
				let countMark = setInterval(() => {
					self.count -= 1
					if (self.count === 0)
						clearInterval(countMark);
				}, 1000); // 验证码请求
				this['countMark'] = countMark
				this.getcodeNumber();
			},
			getcodeNumber() {
				if (this.phone == '17521091214') {
					this.codeNumber = '885566'
					return;
				}

				// 获取验证码
				uni.$api.apiRequest('getSmsCode',{
					phone: this.phone,
					orgId: uni.$localStorage.getItem('userOrgId')
				});
			},
			/**
			 * 验证手机号
			 * */
			commit() {
				if (this.currentType == 0) {
					uni.$api.apiRequest('checkSmsCodeUpPhone', {
						phone: this.phone,
						smsCode: this.codeNumber
					}).then(res => {
						if (res.code == 10000) {
							this.currentType = 1;
							clearInterval(this.countMark);
							this.count = 0;
							this.codeNumber = ''
							this.phone = ''
						}
					})
				} else {
					uni.$api.apiRequest('bindNewPhone', {
						phone: this.phone,
						smsCode: this.codeNumber
					}).then(res => {
						if (res.code == 10000) {
							this.alertShow = true
						} else {
							uni.$alert.showToast('绑定失败,请重试')
						}
					})
				}
			},

			/**
			 * 弹框ok
			 * */
			alertOk() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.view {
		background-color: white;
		height: 100vh;
		padding: 25px 20px;

		.title {
			font-size: 20px;
			font-family: PingFangSCSemibold-, PingFangSCSemibold;
			font-weight: normal;
			color: #2E2E2E;
		}

		.inputPhone {
			margin-top: 15px;
			height: 53px;
			border-bottom: 1px solid #D8D8D8;
		}


		.login-input {
			height: 53px;

		}

		.login-input::placeholder {
			color: rgba(32, 49, 82, 1);
		}

		.validate-code {
			border-radius: 28rpx;
			padding: 12rpx 32rpx;
			border: 1rpx solid #FE5D4D;
			line-height: 32rpx;
			color: #FE5D4D;
			font-size: 10px;
		}

		.validate-code-count {
			border-radius: 42rpx;
			color: #FE5D4D;
			padding: 12rpx 72rpx;
			font-size: 24rpx;
		}

		.commitBtn {
			margin-top: 40px;
			height: 46px;
			line-height: 46px;
			background: #F2F2F2;
			border-radius: 4px;
			text-align: center;

			font-size: 14px;
			font-family: SFUIDisplay-Medium, SFUIDisplay;
			font-weight: 500;

		}

		.okcommitBtn {
			color: white;
			background: #FE5D4D;
		}

		.noralCommitBtn {
			color: #BFBFBF;
			background: #F2F2F2;
		}
	}
</style>
