// vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0' // 允许局域网访问
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
}
