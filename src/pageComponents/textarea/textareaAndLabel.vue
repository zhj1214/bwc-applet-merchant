<template>
<!--components/textarea/textareaAndLabel.wxml-->
<view class="textareaAndLabel">
	<view v-if="!showTextarea" class="textareaTextView" @tap.stop="clickTextarea">
		<view class="textareaTextView-text" v-if="description.length<=0">{{placeholder}}</view>
		<view v-else>{{description}}</view>
	</view>
	<textarea v-else class="textareaView" :value="description" :focus="showTextarea" :maxlength="maxlength || 9999999" :placeholder="placeholder" placeholder-class="refundDescription" @blur="bindblur"></textarea>
	</view>
</template>

<script>

export default {
  data() {
    return {
      showTextarea: false,
      description: ''
    };
  },

  components: {},
  props: {
    maxlength: Number,
    placeholder: String
  },
  methods: {
    /**
     * 解决 Textarea 层级太高问题
     * 当需要获取焦点是 显示Textarea 否则隐藏clickTextarea，显示TextareaView
     * */
    clickTextarea() {
      this.setData({
        showTextarea: true
      });
    },

    /**
     * 焦点消失 输入框 事件
     * 判断一下啊是否大于最大值
     * */
    bindblur(e) {
      this.setData({
        showTextarea: false,
        description: e.detail.value
      });
      this.$emit('bindblur', {
        detail: e.detail.value
      });
    }

  }
};
</script>
<style>
@import "./textareaAndLabel.css";
</style>