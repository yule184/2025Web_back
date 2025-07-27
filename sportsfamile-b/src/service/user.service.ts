import { Provide } from '@midwayjs/core';
import { User } from '../entity';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { CreateUserDTO } from '../dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Provide()
export class UserService {

  /**
   * 注入 User 实体的数据库操作模型
   */
  @InjectEntityModel(User)
  private userModel:Repository<User>;

  /**
   * 用户登录方法
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息（不包含密码）
   * @throws 用户名不存在或密码错误
   */
  public async login(username:string,password:string){
    // 根据用户名查找用户
    const user = await this.userModel.findOne({
      where:{username},
      select:['id','username','password','identity']
    });

    // 用户不存在则抛出异常
    if(!user){
      throw new Error('用户名不存在');
    }

    // 验证输入的密码与数据库中的加密密码是否一致
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      throw new Error('密码错误')
    }

    // 返回用户信息（不包含密码）
    return{
      userInfo:{
        id:user.id,
        username:user.username,
        identity:user.identity,
      }
    };
  }

    /**
   * 用户注册方法
   * @param createUserDTO 用户注册信息 DTO
   * @returns 新创建的用户信息
   * @throws 用户名已存在
   */
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

    // 创建新用户实体并赋值
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

  /**
   * 根据用户名获取用户信息
   * @param username 用户名
   * @returns 用户信息（不包含密码）
   * @throws 用户不存在
   */
  public async getUserByUsername(username:string){
    // 查询用户，返回部分字段
    const user = await this.userModel.findOne({
      where:{username},
      select:['id','username','name','sex','identity','tel','age']
    });

    // 用户不存在则抛出异常
    if(!user){
      throw new Error('用户不存在');
    }
    
    // 返回用户信息
    return user;
  }
    
}
