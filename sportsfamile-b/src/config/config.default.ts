import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity'


export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752127710197_9758',
  koa: {
    port: 7001,
  },
  crossDomain: {
    // 配置 CORS 选项
    origin: '*', // 允许所有域名跨域访问，生产环境建议设置具体域名
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH', // 允许的HTTP方法
    credentials: true, // 是否允许携带凭证（如cookie）
  },
  typeorm:{
    dataSource:{
      default:{
        type:'sqlite',
        database:'webbackend.db',
        synchronize:true,
        logging:false,
        // ...
        entities:[...Object.values(entities)],  // 引入实体（数据库的东西）
      }
    }
  }
} as MidwayConfig;
