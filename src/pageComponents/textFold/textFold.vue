<template>
  <view>
    <!--components/textFold/textFold.wxml-->
    <view
      class="contentBg"
      v-if="showText == '展开'"
      :style="'height:' + height_bg + 'rpx;'"
    >
      <view
        class="content oneLine oneLineStyle"
        :style="'-webkit-line-clamp: ' + maxLine + ';'"
        >{{ contentText }}
        <view class="wdpj-zk" @tap.stop="Unfold">{{ showText }}</view>
      </view>
      <view
        class="content moreLineStyle"
        :style="
          'background-color: ' +
            backGroundColor +
            ';max-height: ' +
            (showText == '展开' ? height : 'inital') +
            'rpx;'
        "
        >{{ contentText }}</view
      >
    </view>
    <view class="content" :style="'padding-bottom: ' + bottomSl + 'rpx;'" v-else
      >{{ contentText }}
      <span class="wdpj-sq">收起</span>
      <view class="wdpj-zk" style="right: 0;" @tap.stop="Collapse">{{
        showText
      }}</view>
    </view>
  </view>
</template>

<script>
// components/textFold/textFold.js
const app = getApp();

export default {
  data() {
    return {
      showText: "",
      height_bg: 0,
      height: 0,
      bottomSl: 0,
    };
  },

  components: {},
  props: {
    maxLine: Number,
    contentText: String,
    backGroundColor: {
      type: String,
      default: "white",
    },
    fontSize: {
      type: Number,
      default: 26,
    },
  },
  // 布局完成
  mounted: function() {
    let size = this.fontSizeHeight(this.fontSize);
    this.setData({
      height_bg: this.properties.maxLine * size,
      height: (this.properties.maxLine - 1) * size,
    });
    var query = this.createSelectorQuery(); // 计算高度 判定 是否显示 "展开"

    var that = this;
    let proportion = uni.$util.decimalTwo(
      750 / app.globalData.iphoneInfo.screenWidth
    );
    query
      .select(".content")
      .boundingClientRect(function(rect) {
        if (rect) {
          that.setData({
            showText: that.height_bg / proportion < rect.height ? "展开" : "",
          });
        }
      })
      .exec();
  },
  methods: {
    Unfold() {
      if (!this.showText) return;
      this.setData({
        showText: "收起",
      });
      var query = this.createSelectorQuery(); // 计算高度 判定 是否显示 "展开"

      var that = this;
      query
        .select(".wdpj-sq")
        .boundingClientRect(function(rect) {
          if (rect) {
            console.log(rect);
            that.setData({
              bottomSl:
                app.globalData.iphoneInfo.screenWidth -
                  (rect.left + rect.width + 16 * 2) >
                15
                  ? 0
                  : 26,
            });
          }
        })
        .exec();
    },

    Collapse() {
      if (!this.showText) return;
      this.setData({
        showText: "展开",
      });
    },

    /**
     * 字体高度
     * */
    fontSizeHeight(size) {
      return (38 / 26) * size;
    },
  },
};
</script>
<style>
@import "./textFold.css";
</style>
