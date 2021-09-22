<!--
 * @Description: 地图组件
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-09-18 09:55:09
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-18 16:54:23
-->
<template>
  <view class="view">
    <navBar title="地图" background="#fff"></navBar>
    <!-- 搜索 -->
    <view class="flex-center" style="padding: 32rpx; justify-content: space-between">
      <view class="flex-center">
        <view class=""> 搜索： </view>
        <u-input
          style="margin: 0 3px"
          v-model="searchText"
          :border="true"
          @blur="textChange"
          placeholder="请输入搜索内容"
        />
      </view>
      <u-button type="success" @click="clearCovers">清空</u-button>
    </view>
    <!-- :enable-building="true" -->
    <map
      style="width: 100%; height: 800rpx"
      :latitude="latitude"
      :longitude="longitude"
      :enable-poi="true"
      :min-scale="3"
      :max-scale="20"
      :enable-indoorMap="true"
      :show-location="true"
      :markers="covers"
      @markertap="markertapClick"
      @poitap="poitapClick"
      @tap="tabClick"
    >
      <!-- <cover-view slot="callout">
        <cover-view :marker-id="1"> 哒哒哒哒哒哒 </cover-view>
      </cover-view> -->
    </map>
    <!-- 内容 -->
    <view class="content">
      <!-- 地图选点 -->
      <view class="selectMap">
        <view style="padding: 10px"> 位置：{{ selectName || '当前位置' }} </view>
        <!-- <view class="" v-if="selectLatitude">
          经度：{{ selectLatitude }}，纬度：{{ selectLongitude }}
        </view> -->
      </view>
    </view>
    <button open-type="contact" bindcontact="handleContact">发消息</button>
    <view class="oneRowBtn" style="margin: 20px" @click="back"> 确认 </view>
  </view>
</template>

<script>
  export default {
    name: 'MapView',
    data() {
      return {
        latitude: 30.278497941698333,
        longitude: 120.14652643613647,
        covers: [],
        selectName: '',
        selectLatitude: '',
        selectLongitude: '',
      }
    },
    methods: {
      back() {
        uni.navigateBack()
      },
      /**
       * @description: 清空搜索
       * @author: zhj1214
       */
      clearCovers() {
        this.covers = this.covers.filter((e) => e.id === 'zhj1214')
      },
      /**
       * @description: 搜索地点
       * @author: zhj1214
       */
      textChange(e) {
        console.log('你输入的:', e)
        const page_index = 1
        uni.$api
          .apiRequest('mapSearch', {
            boundary: 'nearby(30.278497941698333,120.14652643613647,1000)',
            keyword: e,
            page_size: 20,
            page_index: page_index,
            filter: 'category=美食',
            key: 'DJXBZ-VDOKU-2UUV4-2YTOK-45FLE-BLFLH',
          })
          .then((res) => {
            console.log('结果', res)
            this.covers = res.data.map((e, index) => {
              return {
                id: Number(index + page_index * 20),
                latitude: e.location.lat,
                longitude: e.location.lng,
                name: e.title,
              }
            })
          })
      },
      /**
       * @description: 点击兴趣点
       * @author: zhj1214
       */
      poitapClick(e) {
        console.log(e, '--poitapClick-')
        setTimeout(() => {
          this.covers.forEach((item) => {
            if (item.latitude === e.detail.latitude && item.longitude === e.detail.longitude) {
              item.name = e.detail.name
              this.selectName = e.detail.name
              this.selectLatitude = e.detail.latitude
              this.selectLongitude = e.detail.longitude
            }
          })
        }, 220)
      },
      markertapClick(e) {
        console.log(e, '--markertapClick--', this.covers)
        this.unCreateMarker = true
        this.covers.forEach((item) => {
          if (item.id === e.markerId) {
            this.selectName = item.name
            this.selectLatitude = item.latitude
            this.selectLongitude = item.longitude
          }
        })
      },
      tabClick(e) {
        console.log(e, '--tabClick--', this.unCreateMarker)
        setTimeout(() => {
          if (!this.unCreateMarker) {
            this.covers = this.covers.filter((e) => e.id !== 12140624)
            this.covers.push({
              id: 12140624,
              latitude: e.detail.latitude,
              longitude: e.detail.longitude,
            })
            this.selectName = e.detail.name
            this.selectLatitude = e.detail.latitude
            this.selectLongitude = e.detail.longitude
          }
          this.unCreateMarker = false
        }, 200)
      },
    },
  }
</script>
