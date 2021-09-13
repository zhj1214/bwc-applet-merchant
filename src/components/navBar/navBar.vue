<template>
	<view :class="'lxy-nav-bar ' + extClass" :style="'background: ' + backgroundColorTop + ';height: ' + (navBarHeight+ navBarExtendHeight) + 'px;'">
		<view :class="'lxy-nav-bar__placeholder ' + (ios ? 'ios' : 'android')" :style="'padding-top: ' + (navBarHeight+ navBarExtendHeight) + 'px;visibility: hidden;'"></view>
		<view :class="'lxy-nav-bar__inner ' + (ios ? 'ios' : 'android')" :style="navigationbarinnerStyle">
			<view class="lxy-nav-bar__left" :style="navBarLeft">
				<block v-if="backBtn&&!homeBtn">
					<view @click="back" :class="'lxy-nav-bar__button lxy-nav-bar__btn_goback ' + iconTheme"></view>
				</block>
				<block v-if="!backBtn&&homeBtn">
					<view @click="home" :class="'lxy-nav-bar__button lxy-nav-bar__btn_gohome ' + iconTheme"></view>
				</block>
				<block v-else-if="backBtn&&homeBtn">
					<view :class="'lxy-nav-bar__buttons ' + (ios ? 'ios' : 'android')" v-if="homeBtn">
						<view @click="back" :class="'lxy-nav-bar__button lxy-nav-bar__btn_goback ' + iconTheme" v-if="backBtn"></view>
						<view @click="home" :class="'lxy-nav-bar__button lxy-nav-bar__btn_gohome ' + iconTheme"></view>
					</view>
				</block>
				<block v-else>
					<slot name="left"></slot>
				</block>
			</view>
			<view class="lxy-nav-bar__center">
				<block v-if="title">
					<text class="lxy-nav-bar__center-title">{{title}}</text>
				</block>
				<view class="lxy-nav-bar-search" :style="'height:' + capsulePosition.height + 'px;'" v-else-if="searchBar" @click="search">
					<view class="lxy-nav-bar-search__icon"></view>
					<view class="lxy-nav-bar-search__input">{{searchText}}</view>
				</view>
				<!-- 暂时不开发标题loading. 看后期需要 -->
				<!-- <view wx:if="{{loading}}" class="lxy-nav-bar__loading">
                <view class="lxy-loading" style="width:{{size.width}}rpx;height:{{size.height}}rpx;"></view>
            </view> -->
				<block v-else>
					<slot name="center"></slot>
				</block>
			</view>
			<view class="lxy-nav-bar__right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navigationbarinnerStyle: "",
				navBarLeft: "",
				navBarHeight: "",
				capsulePosition: "",
				navBarExtendHeight: "",
				ios: ""
			};
		},
		props: {
			extClass: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: 'rgba(255, 255, 255, 1)'
			},
			backgroundColorTop: {
				type: String,
				default: 'rgba(255, 255, 255, 1)'
			},
			color: {
				type: String,
				default: 'rgba(0, 0, 0, 1)'
			},
			title: {
				type: String,
				default: ''
			},
			searchText: {
				type: String,
				default: '点我搜索'
			},
			searchBar: {
				type: Boolean,
				default: false
			},
			customBackEvent: {
				type: Boolean,
				default: false
			},
			backBtn: {
				type: Boolean,
				default: false
			},
			homeBtn: {
				type: Boolean,
				default: false
			},
			iconTheme: {
				type: String,
				default: 'black'
			},
			showBackBtn: {
				type: Boolean,
				default: true
			},

			/* animated: {
			  type: Boolean,
			  value: true
			},
			show: {
			  type: Boolean,
			  value: true,
			  observer: '_showChange'
			}, */
			delta: {
				type: Number,
				default: 1
			}
		},
		watch: {
			background: '_showChange',
			backgroundColorTop: '_showChangeBackgroundColorTop'
		},
		options: {
			multipleSlots: true,
			addGlobalClass: true
		},
		mounted: function() {

		},
		created: function() {
			this.setData({
				backBtn: this.showBackBtn&&getCurrentPages().length > 1 ? true : false
			});
			this.getSystemInfo();
		},
		beforeMount: function() {
			this.setStyle(); //设置样式
		},
		onPageShow: function() {
			// console.log('_________________________onPageShow_________________________')
			if (getApp().globalSystemInfo.ios) {
				this.getSystemInfo();
				this.setStyle(); //设置样式1
			}
		},
		onPageHide: function() {},
		methods: {
			setStyle: function(life) {
				const {
					statusBarHeight,
					navBarHeight,
					capsulePosition,
					navBarExtendHeight,
					ios,
					windowWidth
				} = getApp().globalSystemInfo;
				const {
					backBtn,
					homeBtn,
					title
				} = this;
				let rightDistance = windowWidth - capsulePosition.right; //胶囊按钮右侧到屏幕右侧的边距

				let leftWidth = windowWidth - capsulePosition.left; //胶囊按钮左侧到屏幕右侧的边距

				// #ifdef H5
				let navigationbarinnerStyle = [`color: ${this.color}`, `background: ${this.background}`,
					`height:${navBarHeight + navBarExtendHeight}px`, `padding-bottom:${navBarExtendHeight}px`
				].join(';');
				// #endif
				// #ifdef MP-WEIXIN
				let navigationbarinnerStyle = [`color: ${this.color}`, `background: ${this.background}`,
					`height:${navBarHeight + navBarExtendHeight}px`, `padding-top:${statusBarHeight}px`,
					`padding-right:${leftWidth}px`, `padding-bottom:${navBarExtendHeight}px`
				].join(';');
				// #endif

				let navBarLeft = [];
				if (backBtn && !homeBtn || !backBtn && homeBtn) {
					navBarLeft = [`width:${capsulePosition.width}px`, `height:${capsulePosition.height}px`].join(';');
				} else if (backBtn && homeBtn || title) {
					navBarLeft = [`width:${capsulePosition.width}px`, `height:${capsulePosition.height}px`,
						`margin-left:${rightDistance}px`
					].join(';');
				} else {
					navBarLeft = [`width:auto`, `margin-left:0px`].join(';');
				}

				if (life === 'created') {
					this.data = {
						navigationbarinnerStyle,
						navBarLeft,
						navBarHeight,
						capsulePosition,
						navBarExtendHeight,
						ios
					};
				} else {
					this.setData({
						navigationbarinnerStyle,
						navBarLeft,
						navBarHeight,
						capsulePosition,
						navBarExtendHeight,
						ios
					});
				}
			},
			showChangeFun: function(value) {
				this.setStyle();
			},
			// 返回事件
			back: function() {
				console.log('咋回事，',this.customBackEvent)
				if (this.customBackEvent) {
					this.$emit('back', {
						detail: {
							delta: this.data.delta
						}
					});
				} else {
					console.log( getCurrentPages())
					uni.navigateBack();
				}
			},
			home: function() {
				// this.$emit('home', {
				// 	detail: {}
				// });
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			search: function() {
				this.$emit('search', {
					detail: {}
				});
			},
			// #ifdef MP-WEIXIN
			/**
			 * 小程序初始化 globalSystemInfo 
			 * */
			getSystemInfo() {
				var app = getApp();
				if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
					return app.globalSystemInfo;
				} else {

					let systemInfo = uni.getSystemInfoSync();
					let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
					let rect;
					// #ifdef MP-WEIXIN
					try {
						rect = uni.getMenuButtonBoundingClientRect ? uni.getMenuButtonBoundingClientRect() : null;
						if (rect === null) {
							throw 'getMenuButtonBoundingClientRect error';
						}
						//取值为0的情况  有可能width不为0 top为0的情况
						if (!rect.width || !rect.top || !rect.left || !rect.height) {
							throw 'getMenuButtonBoundingClientRect error';
						}
					} catch (error) {
						// #endif
						let gap = ''; //胶囊按钮上下间距 使导航内容居中
						let width = 96; //胶囊的宽度
						if (systemInfo.platform === 'android') {
							gap = 8;
							width = 96;
						} else if (systemInfo.platform === 'devtools') {
							if (ios) {
								gap = 5.5; //开发工具中ios手机
							} else {
								gap = 7.5; //开发工具中android和其他手机
							}
						} else {
							gap = 4;
							width = 88;
						}

						if (!systemInfo.statusBarHeight) {
							//开启wifi的情况下修复statusBarHeight值获取不到
							systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
						}

						rect = {
							//获取不到胶囊信息就自定义重置一个
							bottom: systemInfo.statusBarHeight + gap + 32,
							height: 32,
							left: systemInfo.windowWidth - width - 10,
							right: systemInfo.windowWidth - 10,
							top: systemInfo.statusBarHeight + gap,
							width: width
						};

						// #ifdef MP-WEIXIN
						console.log('error', error);
					}
					// #endif
					let navBarHeight = '';

					if (!systemInfo.statusBarHeight) {
						systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;

						navBarHeight = function() {
							let gap = rect.top - systemInfo.statusBarHeight;
							return 2 * gap + rect.height;
						}();

						systemInfo.statusBarHeight = 0;
						systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
					} else {
						navBarHeight = function() {
							let gap = rect.top - systemInfo.statusBarHeight;
							return systemInfo.statusBarHeight + 2 * gap + rect.height;
						}();

						if (ios) {
							systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
						} else {
							systemInfo.navBarExtendHeight = 0;
						}
					}

					systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight

					systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小

					systemInfo.ios = ios; //是否ios

					app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
					// console.log('systemInfo', systemInfo);

					return systemInfo;
				}
			},
			// #endif
			// #ifndef MP-WEIXIN
			/**
			 * 非小程序初始化 globalSystemInfo 
			 * */
			getSystemInfo() {
				var app = getApp();
				if (app.globalSystemInfo && !app.globalSystemInfo.ios) {
					return app.globalSystemInfo;
				} else {
					let systemInfo = uni.getSystemInfoSync();
					let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
					let rect;

					let gap = ''; //胶囊按钮上下间距 使导航内容居中
					let width = 96; //胶囊的宽度
					if (systemInfo.platform === 'android') {
						gap = 8;
						width = 96;
					} else if (systemInfo.platform === 'devtools') {
						if (ios) {
							gap = 5.5; //开发工具中ios手机
						} else {
							gap = 7.5; //开发工具中android和其他手机
						}
					} else {
						gap = 4;
						width = 88;
					}
					// 状态栏高度
					if (!systemInfo.statusBarHeight) {
						systemInfo.statusBarHeight = 20;
					}

					rect = {
						//获取不到胶囊信息就自定义重置一个
						bottom: systemInfo.statusBarHeight + gap + 32,
						height: 32,
						left: systemInfo.windowWidth - width - 10,
						right: systemInfo.windowWidth - 10,
						top: systemInfo.statusBarHeight + gap,
						width: width
					};

					let navBarHeight = function() {
						return 44
						// let gap = rect.top - systemInfo.statusBarHeight;
						// return systemInfo.statusBarHeight + 2 * gap + rect.height;
					}();

					systemInfo.navBarExtendHeight = 0;
					systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
					systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
					systemInfo.ios = ios; //是否ios

					app.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
					//console.log('systemInfo', systemInfo);
					return systemInfo;
				}
			}
			// #endif
		}
	};
</script>
<style>
	@import "./navBar.css";
</style>
