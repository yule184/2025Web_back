import { ApiProperty } from "@midwayjs/swagger";

export class CreateUserDTO{
    @ApiProperty({example:'Zhangsan',description:'username of the user'})
    username:string;

    @ApiProperty({example:'张三',description:'Name of the user'})
    name:string

    @ApiProperty({example:'123456',description:'password of the user'})
    password:string

    @ApiProperty({example:3,description:'age of the user'})
    age:number

    @ApiProperty({example:'男',description:'sex of the user'})
    sex:string

    @ApiProperty({example:'12345678900',description:'telphone of the user',required:false})
    tel:string

    @ApiProperty({example:'CUSTOMER',description:'password of the user'})
    identity:string
}