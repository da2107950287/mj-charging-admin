module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'mjchargingadmin',

  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
       
        'views': '@/views',
        'vue$': 'vue/dist/vue.esm.js'
      }
    },

  },
  devServer: {
    // proxy: "http://cd.mjcmkj.com",
    proxy:"http://charge.linkzl.com"
    
  }
}