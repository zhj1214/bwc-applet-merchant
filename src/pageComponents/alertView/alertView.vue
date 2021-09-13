<template>
    <view style="background: #ffffff">
        <!-- 积分弹框提示 -->
        <u-popup
            v-model="alertShow"
            mode="center"
            :closeable="closeable"
            border-radius="10"
            @close="cancel"
        >
            <view class="bgview">
                <!-- 头部 -->
                <view class="header headerPadding" v-if="showHeader">
                    <view class="header-title">{{ title }}</view>
                </view>
                <!-- 内容 -->
                <view v-if="content" class="content">{{ content }}</view>
                <view v-else style="min-height: 170rpx">
                    <slot name="contentView"></slot>
                </view>
                <!-- 交互按钮 -->
                <view class="bottomView" v-if="!customBottom">
                    <view
                        v-if="showCancel"
                        class="canle bottomView-title"
                        style="color: #2e2e2e"
                        @click="cancel"
                        >{{ cancelText }}</view
                    >
                    <view class="ok bottomView-title" @click="ok">{{
                        okText
                    }}</view>
                </view>
                <view v-else>
                    <slot name="bottomView"></slot>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            alertShow: true,
        };
    },
    props: {
        // 右上角X显示
        closeable: {
            type: Boolean,
            default: false,
        },
        // 头部是否显示
        showHeader: {
            type: Boolean,
            default: true,
        },
        // 底部交互按钮
        customBottom: {
            type: Boolean,
            default: false,
        },
        // 确认文案
        okText: {
            type: String,
            default: "确认",
        },
        // 取消文案
        cancelText: {
            type: String,
            default: "取消",
        },
        // 取消按钮显示
        showCancel: {
            type: Boolean,
            default: false,
        },
        // 内容
        content: {
            type: String,
            default: "",
        },
        // 标题
        title: {
            type: String,
            default: "温馨提示",
        },
    },
    created() {},
    mounted() {
        var self = this;
        setTimeout(() => {
            if (self.alertShow) uni.hideTabBar(); // 弹窗出现
        }, 300);
    },
    methods: {
        cancel() {
            uni.showTabBar();
            this.alertShow = false;
            this.$emit("cancel");
        },

        ok() {
            this.alertShow = false;
            this.$emit("ok");
        },
    },
};
</script>
<style>
.bgview {
    width: 83vw;
    min-height: 210rpx;
}

/* 弹框 */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #ededed;
}

.headerPadding {
    padding: 28rpx 39rpx;
}

.header-title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
}

.content {
    padding: 24rpx 39rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(127, 127, 127, 1);
}

.bottomView {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 24rpx 39rpx;
}

.bottomView-title {
    font-size: 14px;
    font-family: SFUIDisplay-Medium, SFUIDisplay;
    font-weight: 500;
    color: #ffffff;
}

.canle {
    line-height: 84rpx;
    width: 76px;
    height: 40px;
    margin-right: 40rpx;
    border-radius: 8rpx;
    border: 1rpx solid rgba(127, 127, 127, 1);
    background: rgba(255, 255, 255, 1);
    text-align: center;
}

.ok {
    width: 76px;
    height: 40px;
    background: #fe5d4d;
    border-radius: 4px;
    line-height: 40px;
    text-align: center;
}
</style>
