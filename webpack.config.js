// nodejs path module
const path = require('path')
// webpack
const webpack = require('webpack')
// 這個變數儲存目前 env, 可以用這個變數決定要不要壓縮程式碼等等
const isProduction = (process.env.NODE_ENV === 'production')
// 定義網站根目錄函數
const root = src => path.join(__dirname, './', src)
// 定義一個方便取得路徑的函數
// const src = file => path.join(root('resource/script'), file)
// 隱藏警告
process.noDeprecation = false
// 設定檔主體
module.exports = {
  mode: 'production',
  /**
   | 進入點，可以是單一字串或物件
   | 如果是物件，每一個key都會是一個檔案
   */
  entry: {
    app: [
      './src/index.js'
    ]
  },
  /*
   | 結果輸出的資料夾
   | [name].js的 name 將會是entry 物件的 key
   */
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
  },
  /*
   | 這裡開始定義對哪些檔案使用哪些loader.
   */
  module: {
    // rules 是一個陣列，接受多個物件
    rules: [
      // 規則一 編譯js file
      {
        // 副檔名
        test: /\.js$/,
        // 排除目錄
        exclude: /(node_modules|bower_components)/,
        // 使用 babel-loader, 我們將把babel設定寫在 .babelrc檔案之中
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },
  plugins: [
    /*
     | 如果執行環境是 Production, 那麼就將程式 minimize
     */
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction
    }),
    new webpack.BannerPlugin({

      banner: `// ==UserScript==
      // @name         Auto Boss - badgameshow.com
      // @namespace    http://tampermonkey.net/
      // @version      1.0
      // @description  try to take over the world!
      // @author       You
      // @match        https://badgameshow.com/top.cgi
      // @match        https://badgameshow.com/etc.cgi
      // @icon         https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com
      // @grant        none
      // ==/UserScript==`,
    })
  ]
}
