<template>
  <view class="pview">
    <!-- 现金 -->
    <view
      :class="isDisable ? 'isDisableStyle flex-row price' : 'flex-row price'"
      :style="priceviewStyle"
      v-if="priceValue && (!pointValue || pointValue == '0')"
      >
		    <view class="priceValueStyle flex-row">
			    ￥{{ priceValue }}
	        <text class="originalPrice">{{ originalPrice }}</text>
	      </view>
    </view>
    <!-- 积分 -->
    <view
      :class="isDisable ? 'isDisableStyle flex-row price' : 'flex-row price'"
      v-else-if="(!priceValue || priceValue === '0.00') && pointValue"
      :style="pointviewStyle"
    >
      <view class="priceValueStyle">
	      {{ pointValue }}
	      <text class="priceUnitStyle">{{ ponitName }}</text>
      </view>
    </view>
    <!-- 混合 -->
    <view
      :class="isDisable ? 'isDisableStyle flex-row price' : 'flex-row price'"
      :style="pointviewStyle + priceviewStyle"
      v-else
      >
	      <view class="priceValueStyle">
		      ￥{{ priceValue }}+{{ pointValue }}
		      <text class="priceUnitStyle">{{ ponitName }}</text>
	      </view>
    </view>
  </view>
</template>

<script>
const app = getApp();
export default {
  props: {
    originalPrice: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
    priceStyle: {
      type: String,
      default: "",
    },
    point: {
      type: String,
      default: "",
    },
    pointStyle: {
      type: String,
      default: "",
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pointValue() {
      return uni.$util.decimalTwo(this.point, true, 0);
    },
    priceValue() {
      return uni.$util.decimalTwo(this.price, true, 2);
    },
    pointviewStyle() {
      let a = this.isDisable ? "color:#B7B7B7;" : "";
      return `${a}${this.pointStyle}`;
    },
    priceviewStyle() {
      let a = this.isDisable ? "color:#B7B7B7;" : "";
      return `${a}${this.priceStyle}`;
    },
  },
  data() {
    return {
      ponitName: app.globalData.pointName || "积分",
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.pview {
  font-size: 10px;
  font-weight: 300;

  .isDisableStyle {
    color: #b7b7b7 !important;
  }

  .originalPrice {
    font-size: 10px;
    font-family: Helvetica;
    color: #929497;
  }
  .price {
    font-size: 14px;
    font-family: Helvetica;
    color: #ff4c4c;
    font-weight: 700;
  }

  .point {
    font-size: 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #ff4c4c;
  }
	.priceValueStyle {
		font-size: 16px;
	}
	.priceUnitStyle {
		font-size: 15px;
	}
}
</style>
