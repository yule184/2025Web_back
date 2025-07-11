import { Body, Controller, Inject, Post } from "@midwayjs/core";
import { CreateUserDTO } from "../dto/createuser.dto";
import { UserService } from "../service/user.service";

@Controller('/api/user')
export class UserController{

    @Inject()
    userService:UserService;

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

}