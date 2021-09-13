<template>
  <view class="view">
    <navBar title="购物车" background="#fff"></navBar>
    <view class="container" v-if="list.length > 0">
      <view class="shop" v-for="(item1, index1) in list" :key="index1">
        <!-- 店铺头部 -->
        <view class="itemHeader" v-if="item1.goodsList.length">
          <u-checkbox
            @change="checkboxChangetotal"
            v-model="item1.isShopSelect"
            :name="item1.orgId"
            width="20px"
            active-color="#FF4C4C"
            class="flex-row"
            shape="circle" 
          >
            <view class="flex-row" @click.stop="jumpShop(item1)">
              <view class="checkbox flex-row">
                <image
                  v-if="item1.shopLogolUrl"
                  style="width: 22px;height: 22px;margin-right: 6px;"
                  :src="item1.shopLogolUrl"
                ></image
                >{{ item1.orgName }}
              </view>
              <image
                style="width: 9px;height: 12px;margin-left: 4px;"
                src="../../static/images/car/left.png"
                mode=""
              ></image>
            </view>
          </u-checkbox>
        </view>
        <!-- 列表 -->
        <view
          class="list"
          v-for="(item, index) in item1.goodsList"
          :key="index"
        >
          <!-- :disabled="currentgoodsStatus(item)" -->
          <u-swipe-action
            :index="index1"
            :show="item.show"
            @click="onDeleteGoods(arguments, index)"
            @open="open(arguments, index)"
            :options="options"
          >
            <!-- <view class="item u-border-bottom"> -->
            <cartItem
              :cartObj="item"
              :initCartNum="item.cartNum"
              @change="calculateTotalPrice"
              @triggerNumber="changeCartNum"
            ></cartItem>
            <!-- </view> -->
          </u-swipe-action>
        </view>
      </view>
      <!-- 发现更多 -->
      <view class="fxMore flex-center-row">
        <image
          class="mt22"
          v-show="!isShowMore"
          style="width: 140px; height: 140px"
          src="../../static/images/car/carnot.png"
          mode=""
        ></image>
        <image
          style="width: 228rpx; height: 40rpx; margin: 20px 0px"
          src="../../static/images/car/carfx.png"
          mode=""
        ></image>
        <view class="fxMoreList">
          <view
            class="fxMoreItem"
            v-for="(item, index) in goodsListArr"
            :key="index"
            @click="onGoodsCardTap(item)"
          >
            <u-image
              :width="324"
              :height="324"
              :src="item.imgUrl"
              bg-color="#EAEAEA"
              mode="aspectFill"
            ></u-image>
            <view class="fxMoreinfo">
              <view class="fxMoreTitle oneLine" style="-webkit-line-clamp: 2">{{
                item.goodsName
              }}</view>
              <view class="fxMorePrice flex-row">
                <!-- 三种情况 -->
                <pandp
                  :price="item.priceMoney"
                  :point="item.pricePoint"
                ></pandp>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 结算按钮 -->
      <view class="bottomView flex-row">
        <u-checkbox
          @change="bottomCheckboxChangetotal"
          v-model="bpttomAllchecked"
          active-color="#FF4C4C"
          class="flex-row"
          shape="circle"
        >
          <view style="font-size: 16px; color: #2e2e2e">全选</view>
        </u-checkbox>
        <view class="right flex-row">
          <view class="">
            <view
              style="
                                font-size: 12px;
                                color: #7f7f7f;
                                text-align: right;
                            "
              >不含运费</view
            >
            <view
              class="flex-row"
              style="
                                font-size: 12px;
                                color: #ff4c4c;
                                text-align: right;
                                margin-top: 3px;
                                margin-right: 3px;
                            "
              >合计:
              <pandp :price="allMoney" :point="allPoints"></pandp>
              <!-- <view style="font-size: 16px; font-weight: 900"
                                >{{ allMoney }}{{ ponitName }}</view
                            > -->
            </view>
          </view>
          <view class="rightjs" @click="initiateSettlement"
            >结算{{ allGoodsNum > 0 ? `(${allGoodsNum})` : "" }}</view
          >
        </view>
      </view>
    </view>
    <view v-else>
      <view v-if="goodsListArr.length" class="flex-center-row fxMore mt22">
        <image
          style="width: 140px; height: 140px"
          src="../../static/images/car/carnot.png"
          mode=""
        ></image>
        <image
          style="width: 228rpx; height: 40rpx; margin: 20px 0px"
          src="../../static/images/car/carfx.png"
          mode=""
        ></image>
        <view class="fxMoreList">
          <view
            class="fxMoreItem"
            v-for="(item, index) in goodsListArr"
            :key="index"
            @click="onGoodsCardTap(item)"
          >
            <image
              style="width: 324rpx; height: 324rpx"
              :src="item.imgUrl"
              mode=""
            ></image>
            <view class="fxMoreinfo">
              <view class="fxMoreTitle oneLine" style="-webkit-line-clamp: 2">{{
                item.goodsName
              }}</view>
              <view class="fxMorePrice flex-row">
                <!-- 三种情况 -->
                <pandp
                  :price="item.priceMoney"
                  :point="item.pricePoint"
                ></pandp>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="carnot">
        <image
          style="width: 140px; height: 140px"
          src="../../static/images/car/carnot.png"
          mode=""
        ></image>
        <view class="carnotText">您的购物车还是空的</view>
        <view class="carnotBtn" @click="jumpIndex">去逛逛吧</view>
      </view>
    </view>
  </view>
</template>

<script>
import pandp from "../../pageComponents/priceAndPoint/priceAndPoint";
const app = getApp();
import cartItem from "./cartItem.vue";

// import { adaptGoodsList } from "@/utils/adaptors/shop.js";

export default {
  components: {
    cartItem,
    pandp,
  },
  data() {
    return {
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
      ponitName: app.globalData.pointName,
      allchecked: false,
      bpttomAllchecked: false,
      list: [],
      // 总价
      allMoney: 0,
      allPoints: 0,
      allGoodsNum: 0,
      //   商品页码和size
      goodsPage: 1,
      goodsSize: 10,
      goodsTotal: 0,
      goodsListArr: [],
      isShowMore: true,
    };
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.bpttomAllchecked = false;
    this.getCarList();
    if (this.goodsTotal == 0 || this.goodsListArr.length <= this.goodsTotal) {
      if (this.goodsListArr.length < this.goodsTotal) this.goodsPage += 1;
      this.getGoodsData();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 滑到底部触发分页
   * */
  onReachBottom() {
    if (this.goodsListArr.length < this.goodsTotal) {
      this.goodsPage += 1;
      this.getGoodsData();
    }
  },
  /**
   * 页面离开
   * */
  onHide: function() {
    this.allPoints = 0;
    this.allMoney = 0;
    this.allGoodsNum = 0;
  },
  methods: {
    /**
     * @description 获取更多商品数据
     */
    async getGoodsData() {
      const res = await uni.$api.apiRequest("__v2__searchGoods", {
        pageNum: this.goodsPage,
        pageSize: this.goodsSize,
        searchContent: "",
        searchType: 1,
        sortType: 1,
        orgId: uni.$localStorage.getItem("orgId"),
      });
      if (res.code !== 10000 && !res.data) return;
      this.goodsTotal = res.data.goodsInfo.goodsInfoPageData.count; // 保存总条数
      // 保存列表数据
      // if (this.goodsPage === 1) {
      //   this.goodsListArr = adaptGoodsList(
      //     res.data.goodsInfo.goodsInfoPageData.list || []
      //   );
      // } else {
      //   this.goodsListArr = this.goodsListArr.concat(
      //     adaptGoodsList(res.data.goodsInfo.goodsInfoPageData.list || [])
      //   );
      // }
      console.log("goodsListArr:", this.goodsListArr);
    },
    onGoodsCardTap(item) {
      uni.navigateTo({
        url: `/pages/goods/detail?id=${item.id}`,
      });
    },
    currentgoodsStatus(val) {
      return (
        val.goodsState == "DELETED" ||
        val.goodsState == "DELISTED" ||
        val.buyStatus == 2 ||
        val.remainNum <= 0
      );
    },
    /**
     * 如果打开一个的时候，不需要关闭其他，则无需实现本方法
     * */
    open(idxArr, index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.list[idxArr[0]].goodsList[index].show = true;
      this.list[idxArr[0]].goodsList.map((val, idx) => {
        if (index != idx) this.list[idxArr[0]].goodsList[idx].show = false;
      });
    },
    /**
     * @description 滑动删除监测
     */
    onDeleteGoods(idxArr, idx) {
      let good = this.list[idxArr[0]].goodsList[idx];
      uni.$api
        .apiRequest("cartDelete", {
          goodsSkuIdList: [good.goodsSkuId],
        })
        .then((res) => {
          if (res) this.list[idxArr[0]].goodsList.splice(idx, 1);
          this.isShowMore = this.list.some((item) => {
            return item.goodsList.length > 0;
          });
        });
    },
    /**
     * 获取 购物车列表
     * */
    getCarList() {
      this.allMoney = 0;
      uni.$api.apiRequest("carList").then((res) => {
        if (res.code == 10000) {
          this.list = res.data.map((shop) => {
            shop.goodsList = shop.goodsList.map((item) => {
              return {
                ...item,
                ...{
                  isGooodsSelect: false,
                  show: false,
                },
              };
            });
            return {
              ...shop,
              ...{
                isShopSelect: false,
              },
            };
          });
          this.isShowMore = this.list.length;
        }
      });
    },
    /**
     * 发起结算
     * */
    initiateSettlement() {
      let arr = [];
      let isSelectedFlag = false;
  
      this.list.forEach((shop, index) => {
        shop.goodsList.forEach((val) => {
          
          if (val.isGooodsSelect) {
            isSelectedFlag = true;
          }
          if (val.isGooodsSelect && val.goodsState == "LISTED") {
            arr.push({
              orgId: val.orgId,
              goodsList: {
                goodsId: val.goodsId,
                num: val.cartNum,
                goodsSkuId: val.goodsSkuId || "",
              },
            });
          }
        });
      });

      if (!isSelectedFlag) {
        uni.showToast({
          title: "您未选择商品, 请选择",
          icon: "none",
        });
        return;
      }

      if (!arr.length) {
        uni.showToast({
          title: "您选择的商品可能已下架, 请确认",
          icon: "none",
        });
        return;
      }

      uni.$api.apiRequest("cartSettlementApply", arr).then((res) => {
        if (res.code == 10000) {
          let arr = res.data.map((item) => {
            return {
              settlementId: item,
            };
          });
          uni.navigateTo({
            url: `/pages/settlement/settlement?settlementId=${JSON.stringify(
              arr
            )}`,
          });
        }
      });
    },
    /**
     * 店铺全选
     * */
    checkboxChangetotal(val) {
      this.list.forEach((item) => {
        if (item.orgId == val.name) {
          if (item.isShopSelect != val.value) {
            item.isShopSelect = val.value;
          }
          item.goodsList.forEach((e) => {
            if (e.isGooodsSelect != val.value) {
              e.isGooodsSelect = val.value;
              this.calculateTotalPrice([e], val.value, e.goodsSkuId);
            }
          });
        }
      });
      // console.log(val, "_____", this.list);
    },
    /**
     * @description 底部去按钮全选
     * @param {Object} val {value: true, name: ""}
     */
    bottomCheckboxChangetotal(val) {
      console.log("bottomCheckboxChangetotal:", val);
      this.list.forEach((shop) => {
        this.checkboxChangetotal({
          name: shop.orgId,
          value: val.value,
        });
      });
    },
    /**
     * 计算总价 和 商品数量, 如果当前分组商品全选则店铺也将被勾选反之亦然
     * calculateTotalPrice 根据商品 “数量” 计算价格
     * calculateLingTotalPrice 根据商品 “增量” 计算价格
     * */
    calculateTotalPrice(goods, isAdd, goodsSkuId) {
      let total = Number(this.allMoney);
      let totalPoints = Number(this.allPoints);
      if (isAdd) {
        goods.forEach((item) => {
          if (item.goodsState == "LISTED")
            total += item.cartNum * item.priceMoney;
          totalPoints += item.cartNum * item.pricePoint;
        });
      } else {
        goods.forEach((item) => {
          if (item.goodsState == "LISTED")
            total -= item.cartNum * item.priceMoney;
          totalPoints -= item.cartNum * item.pricePoint;
        });
      }
      // console.log(total, "_____total");
      this.allMoney = total;
      this.allPoints = totalPoints;

      this.allGoodsNum = 0;

      this.list.forEach((shop) => {
        shop.goodsList.forEach((item) => {
          if (
            item.goodsState == "LISTED" &&
            (item.goodsSkuId == goodsSkuId || item.isGooodsSelect)
          ) {
            if (item.goodsSkuId == goodsSkuId) item.isGooodsSelect = isAdd;
            if (isAdd) {
              this.allGoodsNum += 1;
            } else {
              if (this.allGoodsNum > 0) this.allGoodsNum -= 1;
            }
          }
        });
      });
      // 当前店铺下面的商品是否全部都选中
      goods.forEach((val) => {
        var isAllShop = true;
        this.list.forEach((shop) => {
          if (shop.orgId == val.orgId) {
            var isAllselect = true;
            shop.goodsList.forEach((e) => {
              if (!e.isGooodsSelect) {
                isAllselect = false;
              }
            });
            shop.isShopSelect = isAllselect;
            if (!isAllselect) isAllShop = false;
          } else {
            if (!shop.isShopSelect) isAllShop = false;
          }
        });
        this.bpttomAllchecked = isAllShop;
      });
    },
    calculateLingTotalPrice(goods, isAdd, goodsSkuId, ling) {
      let total = Number(this.allMoney);
      let totalPoints = Number(this.allPoints);
      if (goods[0].goodsState != "LISTED") return;
      total += ling * goods[0].priceMoney;
      totalPoints += ling * goods[0].pricePoint;

      // console.log(total, "_____total");
      this.allMoney = total;
      this.allPoints = totalPoints;

      this.allGoodsNum = 0;

      this.list.forEach((shop) => {
        shop.goodsList.forEach((item) => {
          if (
            item.goodsState == "LISTED" &&
            (item.goodsSkuId == goodsSkuId || item.isGooodsSelect)
          ) {
            this.allGoodsNum += ling;
            if (this.allGoodsNum < 0) this.allGoodsNum = 0;
          }
        });
      });
    },
    /**
     * @description 购物车数量调整
     * @param {Object} val {value: '', ling: ling,goods: {…}}
     */
    changeCartNum(val) {
      console.log("changeCartNum:", val);
      this.list.forEach((shop) => {
        shop.goodsList.forEach((item) => {
          if (
            item.goodsId == val.goods.goodsId &&
            item.goodsSkuId == val.goods.goodsSkuId
          ) {
            item.cartNum = val.value;
            if (item.isGooodsSelect)
              this.calculateLingTotalPrice(
                [val.goods],
                val.ling > 0,
                val.goods.goodsSkuId,
                val.ling
              );
          }
        });
      });
    },

    // 跳转首页
    jumpIndex() {
      uni.switchTab({
        url: "../index/index",
      });
    },
    jumpShop(item) {
      console.log("onShopBarTap", item);
      const url = "pagesA/shop/home";
      uni.navigateTo({
        url: `/${url}?shopId=${item.orgId}`,
      });
    },
  },
};
</script>
<style scoped lang="less">
.mt22 {
  margin-top: 22vh;
}
.view {
  min-height: 100vh;
  background-color: #f9f9f9;

  .container {
    background-color: white;

    .shop {
      border-bottom: 10px solid #f9f9f9;
    }

    .itemHeader {
      background-color: white;
      margin: 0px 20px 10px 20px;
      padding: 16px 0px;
      border-bottom: 1px solid #dadada;

      .checkbox {
        margin-left: 10px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #2e2e2e;
      }
    }

    .list {
      padding: 0px 20px;
    }
  }

  .bottomView {
    z-index: 9;
    position: fixed;
    bottom: 0px;
    height: 60px;
    background-color: white;
    box-shadow: 0px 12px 24px 0px rgba(0, 0, 0, 0.08);
    width: 100vw;
    justify-content: space-between;
    padding: 0px 40rpx;

    .right {
      .rightjs {
        margin-left: 10px;
        min-width: 87px;
        height: 42px;
        background: #fe5d4d;
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        font-family: PingFang-SC-Light, PingFang-SC;
        font-weight: 300;
        color: #ffffff;
        line-height: 42px;
      }
    }
  }

  .carnot {
    margin-top: 22vh;
    display: flex;
    align-items: center;
    flex-direction: column;

    .carnotText {
      margin-top: 15px;
      font-size: 18px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #7f7f7f;
    }

    .carnotBtn {
      margin-top: 25px;
      width: 96px;
      height: 40px;
      background: #fe5d4d;
      border-radius: 4px;

      text-align: center;
      font-size: 16px;
      font-family: PingFang-SC-Light, PingFang-SC;
      font-weight: 300;
      color: #ffffff;
      line-height: 40px;
    }
  }

  .fxMore {
    flex-direction: column;
    background-color: #f9f9f9;
    margin-bottom: 140rpx;
    // margin-top: 22vh;

    .fxMoreList {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100vw;
      padding: 0px 20px;

      .fxMoreItem {
        background-color: white;
        border-radius: 6px;
        border: 1px solid #eaeaea;
        width: 325rpx;
        margin-bottom: 8px;
        overflow: hidden;

        .fxMoreinfo {
          padding: 8px;
          .fxMoreTitle {
            margin: 3px 0px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #2e2e2e;
          }

          .fxMorePrice {
            .price {
              font-size: 14px;
              font-family: Helvetica;
              color: #ff4c4c;
            }

            .originalPrice {
              font-size: 10px;
              font-family: Helvetica;
              color: #929497;
            }
          }
        }
      }
    }
  }
}
</style>
