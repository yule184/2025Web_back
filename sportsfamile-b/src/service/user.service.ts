import { Provide } from '@midwayjs/core';
import { User } from '../entity';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { CreateUserDTO } from '../dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  private userModel:Repository<User>;

  public async register(createUserDTO:CreateUserDTO){
    // 检查用户名是否已存在
    const existUser = await this.userModel.findOne({
      where:{username:createUserDTO.username}
    });
    if(existUser){
      throw new Error('用户名已存在')
    }
    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDTO.password,salt);

    // 创建用户
    const newUser = new User();
    newUser.username = createUserDTO.username;
    newUser.password = hashedPassword;
    newUser.name = createUserDTO.name;
    newUser.sex = createUserDTO.sex;
    newUser.identity = createUserDTO.identity;
    newUser.age = createUserDTO.age;
    
    if(createUserDTO.tel){
      newUser.tel = createUserDTO.tel;
    }

    // 保存到数据库
    return await this.userModel.save(newUser);

  }
    
}
