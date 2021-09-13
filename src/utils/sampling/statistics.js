/**
 * 页面浏览 pv记录
 * 1.什么人，什么时间，访问什么页面
 * userName openId memberId time  enterPagePath
 * 2.离开、进入什么页面
 * userName openId memberId time  awayPagePath
 * 3.停留时间
 * browseTime
 * */
var statistics = {}
/**
 * 入口 初始化函数
 * current 只当前页面
 * to 前往那个路由
 * form 来自那个路由
 * 这个方法在小程序中执行一次 只会有一个值 to/from
 * */

function collectionPVlog(to, from) {
  !statistics.openId && init() // 当离开当前页面的时候 from存在，则计算停留时长

  if (statistics.current && from) {
    if (from.route == statistics.current.route) {
      statistics.befor = {
        beginTimeStr: statistics.beginTimeStr,
        endTimeStr: new Date().Format('YYYY-MM-DD HH:mm:ss'),
        ...statistics.current,
      }
      uni.$sampling.calculateAtoBtimeDifference(statistics.beginTimeStr).then((res) => {
        statistics.browseTime = res // console.log(statistics, '停留多久———', res)
        // timeExposure(res);
        // clickExposure();
      })
    }
  }

  statistics.beginTime = new Date().getTime()
  statistics.beginTimeStr = new Date().Format('YYYY-MM-DD HH:mm:ss')

  if (to) {
    statistics.current = to
  }

  if (from) {
    statistics.befor = statistics.befor || from
  }
}

function init() {
  if (!uni.$localStorage) return

  if (uni.$localStorage.getCurrentUser()) {
    const user = uni.$localStorage.getCurrentUser()
    statistics = { ...statistics, ...user }
  }

  statistics.openId = uni.$localStorage.getItem('userOpenId')
  statistics.orgId = uni.$localStorage.getItem('userOrgId')
}

function reset() {
  statistics = {}
}
/**
 * 赋值曝光量 数据源
 * @param type 0.不存在时则是设置数据源  1.统计广告位次数
 * */

export function setStatisticsInfo(type, data) {
  // console.log(type,"setStatisticsInfo", data);
  if (type == 1 && (!statistics || !statistics.ads)) return

  if (data && data.length > 0 && !type) {
    statistics.ads = data
  } else if (type == 1 && data != undefined) {
    if (!statistics.ads[data].exposure) {
      statistics.ads[data].exposure = 0
    }

    statistics.ads[data].exposure += 1
  }
} //   方式一 曝光量从广告位中获取

function clickExposure() {
  if (!statistics.ads) return
  var arr = statistics.ads.map((item) => {
    return {
      indicatorType: 1,
      adId: item.id,
      memberId: statistics.memberId,
      enterPageTime: statistics.befor.beginTimeStr,
      exposureType: 1,
      amount: item.exposure || 0,
      leavePageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
      clickPageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
    }
  })
  statisticsAPI(arr)
} //   方式二 根据时间计算曝光量

function timeExposure(time) {
  if (!statistics.ads) return
  var totalNum = parseInt(time / 3) + 1 // 自动滚动了多少次  最后加1 代表默认加载的第一张

  var cycle = totalNum > statistics.ads.length ? parseInt(totalNum / statistics.ads.length) : 0 // 圈数

  var arr = statistics.ads.map((item, index) => {
    const j = index <= totalNum % statistics.ads.length ? 1 : 0
    return {
      indicatorType: 1,
      adId: item.id,
      memberId: statistics.memberId,
      enterPageTime: statistics.befor.beginTimeStr,
      exposureType: 2,
      amount: cycle == 0 ? j : j + cycle,
      leavePageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
      clickPageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
    }
  })
  statisticsAPI(arr)
}
/**
 * 点击量
 * */

export function clickStatistics(val) {
  if (!val.id) return // console.log("clickStatistics", val);

  statisticsAPI([
    {
      indicatorType: 2,
      adId: val.id,
      memberId: statistics.memberId,
      enterPageTime: statistics.befor.beginTimeStr,
      leavePageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
      clickPageTime: new Date().Format('YYYY-MM-DD HH:mm:ss'),
    },
  ])
}
/**
 * 上传服务端
 * */

function statisticsAPI(param) {
  // wx.$api.appLetSamplingStatistics(param)
}

export default {
  collectionPVlog,
  clickStatistics,
  setStatisticsInfo,
  reset,
}
