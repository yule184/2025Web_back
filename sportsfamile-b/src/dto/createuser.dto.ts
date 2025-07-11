import { ApiProperty } from "@midwayjs/swagger";

export class CreateUserDTO{
    @ApiProperty({example:'admin',description:'username of the user'})
    username:string;

    @ApiProperty({example:'管理员',description:'Name of the user'})
    name:string

    @ApiProperty({example:'111111',description:'password of the user'})
    password:string

    @ApiProperty({example:99,description:'age of the user'})
    age:number

    @ApiProperty({example:'男',description:'sex of the user'})
    sex:string

    @ApiProperty({example:'12345678900',description:'telphone of the user',required:false})
    tel:string

    @ApiProperty({example:'ADMIN',description:'identity of the user'})
    identity:string
}