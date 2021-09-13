class CookieUtils {
    /**
     * 将cookie同步到WebView
     *
     * @param url WebView要加载的url
     * @return true 同步cookie成功，false同步cookie失败
     * @Author JPH
     */
    static boolean syncCookie(String url) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            CookieSyncManager.createInstance(MyApplication.getAppContext());
        }
        CookieManager cookieManager = CookieManager.getInstance();

        Map < String, String > cookieMap = getCookieMap();
        for (Map.Entry < String, String > entry : cookieMap.entrySet()) {
            String cookieStr = makeCookie(entry.getKey(), entry.getValue());
            cookieManager.setCookie(url, cookieStr);
        }
        String newCookie = cookieManager.getCookie(url);
        return TextUtils.isEmpty(newCookie) ? false : true;
    }

    /**
     * 组装 Cookie 里需要的值
     *
     * @return
     */
    static Map<String, String> getCookieMap() {

        UserData userData = SPUtils.getUserData(MyApplication.getAppContext());
        String accessToken = userData.getAccessToken();
        Map < String, String > headerMap = new HashMap <> ();
        headerMap.put("access_token", accessToken);
        headerMap.put("login_name", userData.getLoginName());
        headerMap.put("refresh_token", userData.getRefreshToken());
        headerMap.put("remove_token", userData.getRemoveToken());
        headerMap.put("unitId", userData.getUnitId());
        headerMap.put("unitType", userData.getUnitType() + "");
        headerMap.put("userId", userData.getUserId());

        return headerMap;
    }

    /**
     * 拼接 Cookie 字符串
     *
     * @param key
     * @param value
     * @return
     */
    static String makeCookie(String key, String value) {
        Date date = new Date();
        date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);  //3天过期
        return key + "=" + value + ";expires=" + date + ";path=/";
    }
}