<!--
 * @Author: NineNan
 * @Date: 2021-01-18 14:38:14
 * @LastEditTime: 2021-01-20 14:21:59
 * @LastEditors: Please set LastEditors
 * @Description: 公告规则页面
 * @FilePath: \heng-weapp\src\pagesA\out\parsePage.vue
-->
<template>
    <view class="view">
        <navBar :title="title" background="#fff"></navBar>
        <u-parse
            :html="content"
            :lazy-load="true"
            :show-with-animation="true"
        ></u-parse>
    </view>
</template>

<script>
export default {
    data() {
        return {
            content: `<p>暂无数据</p>`,
            title: "文本",
        };
    },
    onLoad(options) {
        this.title = options.title;
        this.getData(options);
    },
    methods: {
        getData(val) {
            if (!val.url) return;
            uni.$api
                .apiRequest(val.url, val.param ? JSON.parse(val.param) : {})
                .then((res) => {
                    if (res.code == 10000 && res.data) {
                        const { data } = res;
                        if (val.url === "chargingRules") {
                            // 停车缴费规则
                            this.content = data.detail;
                        } else if (val.url === "benefitDetails") {
                            // 会员权益详情
                            this.content = data.equityExplain;
                        } else {
                            this.content = data.description || data;
                        }
                    }
                });
        },
    },
};
</script>

<style lang="scss" scoped>
.view {
    padding: 33px 20px;
}
</style>
