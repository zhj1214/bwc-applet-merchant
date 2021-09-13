/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-08-10 11:42:45
 * @LastEditors: zhj1214
 * @LastEditTime: 2021-09-04 09:25:11
 */
/**
 *  操作数据库
 */
// 插入错误日志
const onSqlAdd = function (err) {
  const app = getApp().globalData
  if (!app.globalData || !app.globalData.cloudAvailable) return
  const db = uni.cloud.database()
  db.collection('errorLog').add({
    data: {
      time: new Date().getTime(),
      time_s: new Date().Format('Y-M-D HH:mm:ss'),
      token: uni.$localStorage.getItem('Token'),
      userName: uni.$localStorage.getCurrentUser()
        ? uni.$localStorage.getCurrentUser().memberName
        : undefined,
      ...err,
    },
  })
} // 查询

const onQuery = function (collectionName, data = {}) {
  const app = getApp().globalData
  if (!app.globalData || !app.globalData.cloudAvailable) return

  if (collectionName && collectionName.length < 1) {
    return
  }

  const db = uni.cloud.database() // 查询当前用户所有的 counters

  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .where(data)
      .get({
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        },
      })
  })
} // 实时数据推送 demo 即时

const immediate = function () {
  const app = getApp().globalData
  if (!app.globalData || !app.globalData.cloudAvailable) return

  if (uni.$util.compareVersion(uni.version.version, '2.8.2') >= 0) {
    // const db = uni.cloud.database();
    // const watcher = db.collection('errorLog').limit(5).where({
    //   _openid: db.command.neq(uni.$localStorage.getItem('userOpenId'))
    // }).watch({
    //   onChange: function (snapshot) {
    //     // console.log('docs\'s changed events', snapshot.docChanges)
    //     // console.log('query result snapshot after the event', snapshot.docs)
    //     // console.log('is init data', snapshot.type === 'init')
    //     // console.log('is snapshot id~ ', snapshot.id)
    //     if (snapshot.docChanges && snapshot.docChanges.length > 0) {
    //       var msg = '';
    //       snapshot.docChanges.forEach(item => {
    //         // console.log(item.dataType, "item.dataType")
    //         // console.log(item.queueType, "item.queueType")
    //         if (item.dataType == 'add') {
    //           let u = item.doc.url.split('server/')[1] || [];
    //           msg = item.doc.userName + '~接口：' + (u.length > 1 ? u[1] : u[0]);
    //         }
    //       });
    //       if (msg) {
    //         uni.$alert.showToast(msg);
    //       }
    //     }
    //   },
    //   onError: function (err) {
    //     console.error('the watch closed because of error', err);
    //     uni.$alert.showToast('监听抛出异常');
    //   }
    // });
    // // 等到需要关闭监听的时候调用 close() 方法
    // watcher.close()
  }
}

module.exports = {
  onSqlAdd: onSqlAdd,
  onQuery: onQuery,
  immediate: immediate,
}
