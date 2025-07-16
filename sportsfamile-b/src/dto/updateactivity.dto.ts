import { ApiProperty } from "@midwayjs/swagger";

export class UpdateActivityDTO{
    @ApiProperty({example:1,description:'activity id'})
    activityId:number;

    @ApiProperty({example:'你好我改个名',description:'the new name of activity'})
    name?:string;

    @ApiProperty({example:'可以录入志愿服务时长',description:'the new description'})
    description:string;

    @ApiProperty({example:2,description:'the new duration of the activity'})
    duration?:number;

    @ApiProperty({example:9,description:'the new target paritipants number'})
    targetParticipants?:number;
}