<template>
	<!--miniprogram/components/Timeline/historyTimeline.wxml-->
	<view class="listview-container">
		<view class="playlog-item" @tap="itemTapped">
			<!-- 时间轴 -->
			<view class="dotline">
				<!-- 竖线 -->
				<view class="line"></view>
				<!-- 圆点 -->
				<view class="dot"></view>
			</view>
			<!-- 右边内容部分 -->
			<slot name="playlog-item-right"></slot>
		</view>
	</view>
</template>

<script>
	// miniprogram/components/Timeline/historyTimeline.js
	const app = getApp();

	export default {
		data() {
			return {};
		},

		components: {},
		props: {
			param: {
				type: Object,
				default: () => ({})
			}
		},
		// 在组件定义时的选项中启用多slot支持
		options: {
			multipleSlots: true
		},
		mixins: [],
		// 生命周期函数，可以为函数，或一个在methods段中定义的方法名
		beforeMount: function() { // 在组件实例进入页面节点树时执行
			// console.log('attached')
		},
		moved: function() { // console.log('moved')
		},
		// 在组件实例被移动到节点树另一个位置时执行
		destroyed: function() { // console.log('detached')
			} //在组件实例被从页面节点树移除时执行
			,
		// 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
		beforeMount: function() { // console.log('旧attached')
			// 在组件实例进入页面节点树时执行
		},
		destroyed: function() { // console.log('旧detached')
			// 在组件实例被从页面节点树移除时执行
		},
		// 布局完成
		mounted: function() {},
		// 组件所在页面的生命周期函数
		onPageShow: function() { // console.log('show')
		},
		onPageHide: function() { // console.log('hide')
		},
		onPageResize: function() { // console.log('resize')
		},
		methods: {}
	};
</script>
<style>
	@import "./historyTimeline.css";
</style>
