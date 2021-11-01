<template>
	<view class="">
		<!-- <navBar title='' background='#fff'></navBar> -->
		<web-view :src="src" bindmessage=""></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			}
		},
		onLoad(options) {
			this.setData({
				src: options.src
			})
		},
		methods: {

		}
	}
</script>

<style>

</style>
