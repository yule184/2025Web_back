import { ApiProperty } from "@midwayjs/swagger";

export class createStadiumDTO{
    @ApiProperty({example:'第一篮球场',description:'name of stadium'})
    name:string;

    @ApiProperty({example:'虎丘区太湖大道1520号',description:'the location of stadium'})
    address:string;

    @ApiProperty({example:100,description:'price per hour'})
    pricePerHour:number;
}