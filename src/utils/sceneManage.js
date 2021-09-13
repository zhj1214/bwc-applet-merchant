/**
 * 场景管理
 * 介绍：场景管理主要解决用户扫码、逻辑套餐跳转传值自动化过程。
 * 实现原理：初始化场景单利，合适时机执行场景步骤。通过重构导航跳转完成。
 *
 * @param {Array} scenePath 场景值枚举:1.Voucher 2.registChannel 3.turntableGame  ....
 * @description sceneManage 处理二维码中的参数，得到并保存参数,执行下一步操作
 *
 */

/**
 * ————————————————— 场景模式流程 ———————————————————
 * 1.用户通过扫描二维码打开商城，
 * 2.执行 TYPE_MAP 中的 render函数，获取完整的场景参数
 * 2.进入首页
 * 3.已存在商场，判断是否需要切换商场。
 * 4.首页数据加载完成。开始执行跳转到目标页面
 * 5.导航重构页面执行复杂的逻辑
 * 6.完成场景逻辑跳转到目标页面
 */
/**
 * 当前js类 只负责解析处理场景对象
 * 1.解析场景值
 * 2.执行 TYPE_MAP 中的 render函数，获取完整的场景参数
 * 目前只支持 单个场景的执行，多个场景需修改fetchScene函数
 * */

const SCENE_KEY = '$_scene' // 场景参数
const IS_IN_SCENEIS_KEY = '$_is_in_scene' // 当前场景render是否在ing
const SCENE_PARSE_KEY = '$_scene_parsed' // 场景析构
const SCENE_QUEUE_KEY = '$_scene_queue' // 当前场景队列
const SCENE_RECORDING_KEY = '$_scene_recording' // 所执行过的场景记录
const SCENE_DONE_KEY = '$_scene_done' // 场景模式所有逻辑执行完成
/**
 * 配置场景规则
 * @param { Number } key 场景类型
 * @param { String } name 场景标识
 * @param { Function } render 初始化场景
 * @param {type} FN_PARAMS
 * */

const TYPE_MAP = {
  //  11: {
  //    name: "scanReciiveCoupons", // 扫码领券
  //    pagePath: "/pagesA/scanReciiveCoupons/index",
  //    async render(config) {
  //      try {
  //        // 获取场景值下的所有参数
  //      } catch (error) {
  //        console.error(error);
  //      } finally {
  //        return true;
  //      }
  //    },
  //  },
  13: {
    name: 'becomeAdistributor', // 成为分销员
    pagePath: '/pagesA/myCenter/myExtendSales/JoinResult',
  },
}

/**
 * 初始化场景
 * @param { Object } sceneParam
 * @return { Object } 当前场景单利
 * */

var sceneManage = {} // 场景对象
const getSceneManage = function () {
  return sceneManage
}

export function setScene({ scene }) {
  if (!scene) return
  var senceObj = {}
  senceObj[IS_IN_SCENEIS_KEY] = true
  senceObj[SCENE_KEY] = scene
  senceObj[SCENE_PARSE_KEY] = sceneParse(scene)
  //  场景队列
  if (!sceneManage[SCENE_QUEUE_KEY]) sceneManage[SCENE_QUEUE_KEY] = [senceObj]
  else sceneManage[SCENE_QUEUE_KEY] = sceneManage[SCENE_QUEUE_KEY].push(senceObj)
  // 初始化 场景记录
  if (!sceneManage[SCENE_RECORDING_KEY]) sceneManage[SCENE_RECORDING_KEY] = []

  console.log('~~~scene~~~完成', sceneManage)

  fetchScene() // 运行规则 render函数
  return getSceneManage()
}

/**
 * 解析 105_17503880_1 场景值
 */
function sceneParse(scene) {
  const arr = scene.split('_')
  // 解析长度为3时的情况
  if (arr.length == 3) {
    return {
      type: arr[2],
      orgId: arr[1],
      paramsId: arr[0],
    }
  } else {
    return {
      type: '',
      orgId: '',
      paramsId: '',
    }
  }
}
/**
 * @description: 因为二维码参数长度最大32个字符。所以需要调用接口获取完整的参数。
 * @param {*} render
 * @author: zhj1214
 */
export async function fetchScene(render) {
  if (!sceneManage[SCENE_QUEUE_KEY] || sceneManage[SCENE_QUEUE_KEY].length == 0) return false
  const senceObj = sceneManage[SCENE_QUEUE_KEY][0]
  if (!senceObj[IS_IN_SCENEIS_KEY]) return false
  render =
    render ||
    (TYPE_MAP[senceObj[SCENE_PARSE_KEY].type] && TYPE_MAP[senceObj[SCENE_PARSE_KEY].type].render)
  senceObj.pagePath = TYPE_MAP[senceObj[SCENE_PARSE_KEY].type].pagePath || '' // 赋值跳转目标也路径
  const scene = senceObj[SCENE_KEY]
  let isComplate
  if (render) {
    // 约定场景执行完成后返回一个true，否则则认为未结束
    isComplate = await render({
      scene,
      sceneObj: senceObj[SCENE_PARSE_KEY],
    })
  } else {
    isComplate = true
  }
  if (isComplate) {
    senceObj[IS_IN_SCENEIS_KEY] = false // 消费完场景之后软清除
    // 完成的场景添加到记录列表
    sceneManage[SCENE_RECORDING_KEY].push(senceObj)
    sceneManage[SCENE_QUEUE_KEY].shift()
  }
  // console.log("场景对象配置完成：", sceneManage);
}

/**
 * 获取对列记录表中的第一个未完成的场景,若无则返回进行中的第一个场景
 * @param {} scene
 */
export function getQueueScene() {
  if (!sceneManage[SCENE_RECORDING_KEY]) return false
  let undone
  sceneManage[SCENE_RECORDING_KEY].forEach((item) => {
    if (undone) return undone
    if (!item[SCENE_DONE_KEY]) return (undone = item)
  })
  return undone || sceneManage[SCENE_QUEUE_KEY][0] || false
}

/**
 * @description: 更新 场景列表记录
 * @param {*} val
 * @author: zhj1214
 */
export function updataManageQueue(val) {
  let undone
  sceneManage[SCENE_RECORDING_KEY].forEach((item) => {
    if (undone) return undone
    if (!item[SCENE_DONE_KEY]) {
      item = val
      undone = val
    }
    return
  })
  return sceneManage[SCENE_RECORDING_KEY]
}

/**
 * 切换商场（把新的商场重新写入缓存）
 * 更新用户信息（积分、成长值）
 * */
export async function changeMall(orgId) {
  if (!orgId) return false
  return new Promise((reslove, reject) => {
    const app = getApp()
    if (!uni.$localStorage.getItem('orgId')) {
      app.globalData.orgId = orgId
      uni.$localStorage.setItem('orgId', orgId)
    }
    uni.$api
      .apiRequest('getMallInfoUserServer', {
        orgId: orgId,
      })
      .then((res) => {
        if (res.code == 10000) {
          uni.$localStorage.setItem('currentMall', {
            marketName: res.data.name,
            orgId: orgId,
            orgid: orgId,
          })
          reslove(true)
        } else {
          reject(false)
        }
      })

    var self = this
    uni.$util.getMemberInfo().then((res) => {
      if (res) {
        const u = { ...self.userInfo, ...res }
        app.globalData.integral = res.integral
        uni.$localStorage.setCurrentUser(res)
        uni.$localStorage.setItem('memberId', res.memberId)
      }
    })
  })
}

const sceneMng = {
  /**
   *
   * @param {*} scene 扫描二维码获取的 query string的scren
   */
  setScene: setScene,
  getSceneManage: getSceneManage,
  getQueueScene: getQueueScene,
  updataManageQueue: updataManageQueue,
  changeMall: changeMall,
}

export default sceneMng
