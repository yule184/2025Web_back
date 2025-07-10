import { MidwayConfig } from '@midwayjs/core';

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
        
      }
    }
  }
} as MidwayConfig;
