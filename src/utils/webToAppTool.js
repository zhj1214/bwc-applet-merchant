const isAndroid =
  navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

/**
 * @description 初始化配置
 * */
function setupWebViewJavascriptBridge(callback) {
  // console.log("00000000000000000000000000");
  //Android使用
  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function () {
          callback(WebViewJavascriptBridge)
          //如果发生ajax阻塞jsbrige的情况，尝试下方方式
          /*if(window.onWebViewJavascriptBridgeReady) window.onWebViewJavascriptBridgeReady(window.__bridge = WebViewJavascriptBridge);
					callback(WebViewJavascriptBridge)*/
        },
        false
      )
    }
    sessionStorage.phoneType = 'android'
  }

  //iOS使用
  if (isiOS) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
    sessionStorage.phoneType = 'ios'
  }
}

/**
 * 注册回调函数
 * @description 第一次连接时调用 初始化函数(android需要初始化,ios不用)
 * */
setupWebViewJavascriptBridge(function (bridge) {
  // console.log("11111111111111111111111111111");
  if (isAndroid) {
    //初始化
    bridge.init(function (message, responseCallback) {
      var data = {
        'Javascript Responds': 'Wee!',
      }
      responseCallback(data)
    })
  }
})

export default {
  /**
   * js->APP 并接收回调方法callback
   * @param {String} name app提供的方法名
   * @param {Object} data app传递的参数
   * @param {function} callback 回调函数
   * */
  callHandler(name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
  /**
   * APP->js方法 可传递callback回调
   * （参数分别为:js提供的方法名  回调）
   * @param {String} name js注册方法名
   * @param {function} callback 回调函数
   * */
  registerHandler(name, callback) {
    // console.log("22222222222222222222222222222_____", name);
    setupWebViewJavascriptBridge(function (bridge) {
      // console.log("333333333333333333333333333");
      bridge.registerHandler(name, function (data, responseCallback) {
        // console.log("4444444444444444444444444444_____", name);
        callback(data, responseCallback)
      })
    })
  },
}

/****************************************  postMessage使用	*********************************/
// 1.app -> js
// window['initJFSCmallData'] = (res) => {
// 	this.initJFSCmallData(res)
// }
// initJFSCmallData(res){
// 	console.log(res)
// }
// 2.js -> app
// // h5加载完成通知APP
// if (process.env.NODE_ENV != 'development') {
// 	setTimeout(() => {
// 		window.webkit.messageHandlers.loadH5Done.postMessage('加载完成')
// 	}, 1000)
// }
// 3.第二种使用方式
// h5PostMessage(val, name) {
// 	var channel = new MessageChannel(); // 创建一个 MessageChannel
// 	window.nativeCallBack = function(nativeValue) {
// 		channel.port1.postMessage(nativeValue)
// 	};

// 	window.webkit.messageHandlers[name].postMessage(val);
// 	return new Promise((resolve, reject) => {
// 		channel.port2.onmessage = function(e) {
// 			var data = e.data;
// 			resolve(data);
// 			channel = null;
// 			window.nativeCallBack = null;
// 		}
// 	})
// }
// function shiyong() {
// 	const arg1 = 100;
// 	const arg2 = 200;
// 	_postMessage(person, 'nativeMethod').then((val) => {
// 		console.log(val);
// 		console.log(arg1 + arg2);
// 	})
// }
