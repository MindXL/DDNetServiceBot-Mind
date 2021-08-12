// 定义数据表
// 以上面的 schedule 数据表为例，让我们看看如何定义新的数据表：

// jsts
// import { Tables } from 'koishi-core'

// declare module 'koishi-core' {
//   interface Tables {
//     schedule: Schedule
//   }
// }

// export interface Schedule {
//   id: number
//   assignee: string
//   lastCall: Date
//   command: string
// }

// Tables.extend('schedule')
// 这个方法还可以传入第二个参数，用于配置数据表：

// Tables.extend('schedule', {
//   // 主键名称，将用于 database.get() 等方法
//   primary: 'id',
//   // 所有数据值唯一的字段名称构成的列表
//   unique: [],
//   // 主键产生的方式，incremental 表示自增
//   type: 'incremental',
// })
// 与上面一致，如果你是插件开发者，你还需要手动处理 MySQL 字段的定义：

// jsts
// import { Database } from 'koishi-core'
// import {} from 'koishi-plugin-mysql'

// Database.extend('koishi-plugin-mysql', ({ tables }) => {
//   tables.schedule = {
//     id: 'int',
//     assignee: 'varchar(50)',
//     // 其他字段定义
//   }
// })
