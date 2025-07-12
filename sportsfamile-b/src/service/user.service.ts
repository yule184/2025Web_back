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

  // 登录
  public async login(username:string,password:string){
    // 查找用户
    const user = await this.userModel.findOne({
      where:{username},
      select:['id','username','password','identity']
    });

    // 用户不存在
    if(!user){
      throw new Error('用户名不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      throw new Error('密码错误')
    }

    return{
      userInfo:{
        id:user.id,
        username:user.username,
        identity:user.identity,
      }
    };
  }

  // 注册用户
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

  // 根据username获取用户信息
  public async getUserByUsername(username:string){
    const user = await this.userModel.findOne({
      where:{username},
      select:['id','username','name','sex','identity','tel','age']
    });

    if(!user){
      throw new Error('用户不存在');
    }

    return user;
  }
    
}
