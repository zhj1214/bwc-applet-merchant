/*
 * @Description: 埋点，后续使用minxin重构
 * @Version: 0.0.1
 * @Autor: zhj1214
 * @Date: 2021-05-21 14:52:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-19 11:37:09
 */
const sampling = {
  browseCommodity: {
    goodId: '',
    startTime: '',
    endTime: ''
  },

  /**
   * @description 计算时间差
   * @param {*} options
   */
  calculateAtoBtimeDifference(time1, time2) {
    if (!time1) {
      return 0;
    }

    return new Promise(function (resolve, rejected) {
      if (uni.$util.getCurrentSystemiOS()) {
        time2 = time2 ? time2 : new Date().Format("YYYY-MM-DD HH:mm:ss");
        let end = new Date(time2.replace(/-/g, '/')).getTime();
        let star = new Date(time1.replace(/-/g, '/')).getTime();

        if (!isNaN(end) && !isNaN(star)) {
          resolve((end - star) / 1000);
        } else {
          rejected(0);
        }
      } else {
        let d1 = new Date(time1);
        time2 = time2 ? time2 : new Date();
        let d2 = new Date(time2);
        let difference = parseInt(d2 - d1);

        if (difference !== undefined && difference !== null && !isNaN(difference)) {
          resolve(difference / 1000);
        } else {
          rejected(0);
        }
      }
    });
  },

  /**
   * @description 埋点
   * @param {*} options
   */
  sampling(type, goodsId, requestUrl) {
    const self = this;
    var startTime = new Date();
    let userObj = uni.$localStorage.getCurrentUser() || {};
    let data = {
      requestUrl: requestUrl,
      orgId: uni.$localStorage.getItem('userOrgId') || '',
      memberId: userObj.memberId || '',
      inTime: startTime.Format('YYYY-MM-DD HH:mm:ss'),
      // openId: uni.$localStorage.getItem('userOpenId') || '', 
      phone: userObj.phone || '',
      type: type
    };

    if (type === 'LOGIN') {
      // 那个公众号进入了积分商城
      data.remark = '那个公众号进入了积分商城';
      data.platform = uni.$localStorage.getItem('userEntranceKey') || '';
    } else if (type === 'BROWSER_GOODS') {
      // 浏览什么商品，浏览多久
      if (self.browseCommodity.goodId !== goodsId) {
        self.browseCommodity.goodId = goodsId;
        self.browseCommodity.startTime = startTime.Format('YYYY-MM-DD HH:mm:ss');
      } else {
        self.browseCommodity.endTime = startTime.Format('YY-MM-DD HH:mm:ss');
        data.goodsId = goodsId;
        data.remark = '浏览什么商品，浏览多久';
        self.calculateAtoBtimeDifference(self.browseCommodity.startTime, self.browseCommodity.endTime).then(res => {
          data.browsingTime = res; // console.log(data)
          // 进行埋点请求

          uni.$api.apiRequest('appLetSampling', data).then(() => {
            // console.log(res);
            self.browseCommodity = {
              goodId: '',
              startTime: '',
              endTime: ''
            };
          });
        });
      }
      return;
    } else if (type === 'ADD_SHOPCART') {
      // 添加什么商品到 -> 购物车
      data.remark = '添加什么商品到 -> 购物车';

      if (Array.isArray(goodsId) && goodsId) {
        data.goodsIds = goodsId;
      } else {
        data.goodsId = goodsId;
      }
    } else if (type === 'GOODS_EXCHANGE') {
      // 购买了什么商品 只有购买的时候传入 数组id
      data.remark = '购买了什么商品';
      data.goodsIds = goodsId;
    }
    uni.$api.apiRequest('appLetSampling', data)
  }
};
export default sampling;