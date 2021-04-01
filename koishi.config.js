// 配置项文档：https://koishi.js.org/api/app.html
module.exports = {
  // Koishi 服务器监听的端口
  port: 8080,

  onebot: {
    secret: '',
  },

  bots: [{
    type: 'onebot:ws',
    // 对应 cqhttp 配置项 ws_config.port
    server: 'ws://localhost:6700',
    selfId: 1066974992,
    token: '',
  }],

  plugins: {
    mysql: {
      host: '127.0.0.1',
      // Koishi 服务器监听的端口
      port: 3306,
      user: 'root',
      password: '1634300602Wx',
      database: 'koishi',
    },
    common: {},
  },
}
