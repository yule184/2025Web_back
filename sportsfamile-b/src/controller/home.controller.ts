import { Controller, Get } from '@midwayjs/core';

@Controller('/')
export class HomeController {
  @Get('/')
  async home(): Promise<string> {  // async 异步方法
    return 'Hello Midwayjs!';
  }
}
