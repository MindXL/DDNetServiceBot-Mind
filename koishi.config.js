const Config = require('./config').default;

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

  prefix: ['%', '&', '*', ''],

  autoAssign: session => session.channelId === Config.testGroup,
  autoAuthorize: session => session.userId === Config.mainQQ ? 4 : (session.groupId === Config.testGroup ? 1 : 0),

  plugins: {
    // mysql: {
    //   host: '127.0.0.1',
    //   // Koishi 服务器监听的端口
    //   port: 3306,
    //   user: 'root',
    //   password: '1634300602Wx',
    //   database: 'koishi',
    // },
    mysql: {
      host: '127.0.0.1',
      // Koishi 服务器监听的端口
      port: 3306,
      user: 'root',
      password: '1634300602Wx',
      database: '_koishi',
    },
    common: {},
    './AppManage': {},
    './Command': {},
    './UserManage': {},
    './EventEmitter': {},
    './MessageHandler': {},
  },

  // logTime: true,

  watch: {
    // 要监听的根目录，相对于工作路径
    root: './*.js',
    // 要忽略的文件列表，支持 glob patterns
    ignore: ['node_modules', 'src'],
  },
}
