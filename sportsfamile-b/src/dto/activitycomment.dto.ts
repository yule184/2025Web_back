import { ApiProperty } from "@midwayjs/swagger";

export class CreateActivityCommentDTO{
    @ApiProperty({example:3,description:'userId'})
    userId:number;

    @ApiProperty({example:4,description:'activity id'})
    activityId:number;

    @ApiProperty({example:'活动体验很棒！',description:'the content of comment'})
    content:string;

    @ApiProperty({example:4,description:'the rating of the activity'})
    rating:number;
}