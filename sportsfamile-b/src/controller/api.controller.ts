import { Inject, Controller} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;



  // @Get('/get_user')
  // async getUser(@Query('uid') uid) {
  //   const user = await this.userService.getUser({ uid });
  //   return { success: true, message: 'OK', data: user };
  // }
}
