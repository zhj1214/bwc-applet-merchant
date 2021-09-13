/**
 * @author ZHJ
 * @description 配置不同的主题
 * @param btn 按钮样式
 * @param bgColor 背景色
 * @param jgColor 首页加购按钮色值
 * @param color 文字颜色
 */
const envList = {
  hzds_Theme: {
    theme: "hzds_Theme",
    btn: `background-color:#FE5D4D !important;
          color: #FFFFFF !important;`,
    bgColor: `background: #FE5D4D;`,
    jgColor: `background: #F3C392;`,
    color: `color: #FE5D4D !important;`,
    borderColor: `#FE5D4D;`,
    borderColorValue: `#FE5D4D`,
  },
  mos_Theme: {
    theme: "mos_Theme",
    btn: `background-color:#FEC721 !important;
          color: #313131 !important;
         `,
    bgColor: `background: #FEC721;`,
    jgColor: `background: #FEC721;`,
    color: `color: #FEC721 !important;`,
    borderColor: `#FEC721;`,
    borderColorValue: `#FEC721`,
  },
};
const currentEnv = "hzds_Theme";
export default envList[currentEnv];
