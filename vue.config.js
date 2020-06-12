/*
 * @Author: eds
 * @Date: 2020-04-01 10:22:07
 * @LastEditTime: 2020-06-11 20:03:21
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \lucheng-economy-map\vue.config.js
 */ 
/**
 * vue.config
 * created by eds 2019/8/22
 */
module.exports = {
  //  打包静态文件访问相对路径设置
  publicPath: "./",
  assetsDir: "libs",
  devServer: {
    proxy: {
      //配置跨域
      "/api": {
        target: "http://172.20.89.68:5001/api",
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
