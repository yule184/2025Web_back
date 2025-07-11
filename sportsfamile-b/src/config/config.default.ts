import { MidwayConfig } from '@midwayjs/core';
import * as entities from '../entity'


export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1752127710197_9758',
  koa: {
    port: 7001,
  },
  typeorm:{
    dataSource:{
      default:{
        type:'sqlite',
        database:'webbackend.db',
        synchronize:true,
        logging:true,
        // ...
        entities:[...Object.values(entities)],  // 引入实体（数据库的东西）
      }
    }
  }
} as MidwayConfig;
