import { Body, Controller, Post } from "@midwayjs/core";

@Controller('/user')
export class UserController{

    @Post('/register')
    public async register(
        @Body('username')username:string,
        @Body('password')password:string
    ):Promise<boolean>{
        return true;
    }

}