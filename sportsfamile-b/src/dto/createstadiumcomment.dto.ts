import { ApiProperty } from "@midwayjs/swagger";

export class createStadiumCommentDTO{

    @ApiProperty({example:1,description:'user id'})
    userId:number;

    @ApiProperty({example:'场地很干净，好评',description:'the content of comment'})
    content:string;

    @ApiProperty({example:2,description:'the rating of the user comment'})
    rating:number;

    @ApiProperty({example:1,description:'the id of the stadium'})
    stadiumId:number;
}