import { Body, Controller, Inject, Post, Query ,Get} from "@midwayjs/core";
import { CreateUserDTO } from "../dto/createuser.dto";
import { UserService } from "../service/user.service";

@Controller('/api/user')
export class UserController{

    @Inject()
    userService:UserService;

    @Post('/login')
    public async login(
        @Body('username') username:string,
        @Body('password') password:string
    ){
        try{
            const result = await this.userService.login(username,password);
            return{
                code:200,
                data:result,
                message:'登录成功'
            };
        }catch(e){
            return{
                code:401,
                message:e.message || '登录失败'
            }
        }
    }


    @Post('/register')
    public async register(@Body() createUserDTO:CreateUserDTO){
        try{
            const user = await this.userService.register(createUserDTO);
            return{
                code:200,
                data:{
                    username:user.username,
                    name:user.name
                },
                message:'注册成功'
            };
        }catch(e){
            return {
                code:400,
                message:e.message
            };
        }
    }

    @Get('/info')
    public async getUserInfo(@Query('username') username:string){
        try{
            const user = await this.userService.getUserByUsername(username);
            return{
                code:200,
                data:user,
                message:'success'
            };
        }catch(e){
            return {
                code:404,
                message:e.message
            };
        }
    }
}