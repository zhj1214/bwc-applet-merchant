<template>
  <view class="view">
    <u-checkbox-group v-if="cartObj" width="20px">
      <view class="content flex-row">
        <!-- 下架 -->
        <view
          v-if="
            cartObj.goodsState == 'DELISTED' || cartObj.goodsState == 'DELETED'
          "
          class="goods-status"
          >下架</view
        >
        <!-- 有买家尚 未付款 -->
        <view
          v-else-if="cartObj.buyStatus == 2"
          class="goods-status"
          style="width: inherit"
          >有买家尚未付款</view
        >
        <!-- 库存不足 -->
        <view v-else-if="cartObj.remainNum <= 0" class="goods-status"
          >售罄</view
        >
        <!-- 在售 -->
        <u-checkbox
          v-else
          class="carcheckbox"
          @change="checkboxChange"
          v-model="isGooodsSelect"
          :name="cartObj.goodsSkuId"
          active-color="#FF4C4C"
          shape="circle"
        ></u-checkbox>
        <view class="item flex-row" style="flex: 1">
          <image
            style="width: 74px; height: 74px; margin-left: 10px;"
            :src="cartObj.pictureUrl"
            mode="aspectFit"
            @click="onGoodsCardTap"
          ></image>
          <view class="info">
            <view
              class="item-title"
              :style="isDisable ? 'color:#B7B7B7;' : ''"
              >{{ cartObj.goodsName }}</view
            >
            <view class="item-spec" :style="isDisable ? 'color:#B7B7B7;' : ''"
              >规格：{{ strSplicing(cartObj.spec) || "张" }}</view
            >
            <view class="item-price flex-row">
              <pandp
                :price="cartObj.priceMoney"
                :point="cartObj.pricePoint"
                :isDisable="isDisable"
              ></pandp>
              <u-number-box
                input-width="50"
                v-if="!isDisable"
                v-model="cartNum"
                min="1"
                :long-press="false"
                :index="cartObj.userLimit || 99999999999999"
                :max="cartObj.remainNum || 99999999999999"
                bg-color="#fff"
                size="20"
                @minus="changeNumber"
                @plus="changeNumber"
                @blur="changeNumber"
              ></u-number-box>
            </view>
          </view>
        </view>
      </view>
    </u-checkbox-group>
  </view>
</template>
<script>
const app = getApp();
import pandp from "../../pageComponents/priceAndPoint/priceAndPoint.vue";
export default {
  components: {
    pandp,
  },
  props: {
    cartObj: {
      type: Object,
    },
    initCartNum: {
      type: Number,
    },
  },
  data() {
    return {
      ponitName: app.globalData.pointName,
      isGooodsSelect: false, // 是否选择
      isDisable: false, // 商品是否禁用
      cartNum: 1, // 商品 数量
    };
  },
  created() {
    this.cartNum = this.initCartNum;
    this.isDisable =
      this.cartObj.goodsState == "DELETED" ||
      this.cartObj.goodsState == "DELISTED" ||
      this.cartObj.buyStatus == 2 ||
      this.cartObj.remainNum <= 0;
  },
  // 布局完成
  mounted: function() {
    // uni.$util.decimalTwo(this.cartObj.priceMoney * this.cartObj.cartNum, true, 0)
    // console.log(this.isDisable,'this.isDisable =this.isDisable =this.isDisable =');
  },
  watch: {
    initCartNum(newVal, oldValue) {
      this.cartNum = newVal;
    },
    cartObj(newVal, oldVal) {
      // console.log(
      //     "newVal",
      //     newVal.goodsName,
      //     "————————————",
      //     newVal.isGooodsSelect
      // );
      // console.log(
      //     "oldVal",
      //     oldVal.goodsName,
      //     "————————————",
      //     oldVal.isGooodsSelect
      // );
      if (newVal.isGooodsSelect != oldVal.isGooodsSelect)
        this.isGooodsSelect = newVal.isGooodsSelect;
    },
    // isGooodsSelect(newVal, oldVal) {
    //   this.checkboxChange({
    //     value: newVal,
    //     name: this.cartObj.goodsId,
    //   });
    // },
  },
  methods: {
    /**
     * @description 跳转商品详情
     */
    onGoodsCardTap() {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${this.cartObj.goodsId}`,
      });
    },
    /**
     * 选择商品
     * */
    checkboxChange(val) {
      //   if (val.value == this.isGooodsSelect) return;
      // console.log(
      //     val,
      //     "____",
      //     this.cartObj.isGooodsSelect,
      //     "___",
      //     this.isGooodsSelect
      // );
      //   this.cartObj.isGooodsSelect = val.value;
      this.$emit("change", [this.cartObj], val.value, val.name);
    },
    /**
     * 计步器 事件
     * */
    changeNumber(e) {
      if (this.isDisable) return;
      console.log(e, "______", this.cartObj.cartNum, "______", this.cartNum);
      let max = e.index;
      let value = parseInt(e.value);
      var jiu = this.cartObj.cartNum;
      if (value < 1) {
        value = 1;
      } else if (value > max) {
        value = max;
      }

      var ling = value - jiu;
      if (ling != 0) this.addGoodsche(ling);
      this.$emit("triggerNumber", {
        value: e.value,
        ling: ling,
        goods: this.cartObj,
      });
    },

    // 加入购物车请求
    addGoodsche(ling) {
      if (ling) {
        uni.$util.currentClockin(); // 点亮
        var self = this;
        uni.$api
          .apiRequest("carGoodsNum", {
            goodsId: this.cartObj.id || this.cartObj.goodsId,
            goodsNum: ling,
            goodsSkuId: this.cartObj.goodsSkuId,
            orgId: this.cartObj.orgId,
          })
          .then((res) => {
            console.log(self.cartNum, "购物车", ling);
            if (res.code != 10000 && ling > 0) {
              self.cartNum -= ling;
              self.$emit("triggerNumber", {
                value: self.cartNum,
                ling: ling,
                goods: self.cartObj,
              });
              // setTimeout(() => {
              // 	// 埋点
              // 	uni.$sampling.sampling('ADD_SHOPCART', self.cartObj.id, self.route);
              // }, 2000);
            }
          });
      }
    },

    /**
     * 跳转
     * */
    toGoodsDetail(e) {
      if (
        this.cartObj.goodsState == "DELETED" ||
        this.cartObj.goodsState == "DELISTED"
      ) {
        uni.$alert.showToast("该商品已下架");
        return;
      }

      let id = e.currentTarget.dataset.goodsid;
      uni.navigateTo({
        url: `/pages/goodsDetail/goodsDetail?goodsid=${id}`,
      });
    },
    // 拼接规格
    strSplicing(arr) {
      if (!arr) return;
      var str = "";
      arr.forEach((item) => {
        str += item.specContent + ",";
      });
      str = str.substring(0, str.length - 1);
      return str;
    },
  },
};
</script>
<style lang="less">
.carcheckbox {
  padding: 10px 4px;
}
</style>
<style lang="less" scoped>
.content {
  padding: 6px 0px;
}

.item {
  width: 100%;

  .info {
    flex: 1;
    margin-left: 14px;

    .item-title {
      font-size: 14px;
      font-family: PingFang-SC-Light, PingFang-SC;
      color: #2e2e2e;
    }

    .item-spec {
      margin-top: 2px;
      font-size: 12px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #929497;
    }

    .item-price {
      justify-content: space-between;
      margin-top: 9px;
      font-size: 14px;
      font-family: DINPro-Bold, DINPro;
      font-weight: bold;
      color: #ff4c4c;
    }
  }
}

.goods-status {
  padding: 0rpx 6rpx;
  height: 36rpx;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4rpx;
  font-size: 20rpx;
  font-family: PingFangSC-Light;
  font-weight: 300;
  color: rgba(255, 255, 255, 1);
  line-height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
