import { Provide } from '@midwayjs/core';
import { User } from '../entity';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';


@Provide()
export class UserService {

  @InjectEntityModel(User)
  private userModel:Repository<User>;

  public async register(username:string,password:string):Promise<boolean>{
    // TODO: 完成注册逻辑

    // 检查用户名是否已存在
    const existingUser = await this.userModel.findOne({
      where:{username},
    })

    if(existingUser){
      return false;
    }

    return true;
  }
    
}
