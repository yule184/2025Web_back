import { ApiProperty } from "@midwayjs/swagger";
import { Expose, Type } from 'class-transformer';
import { UserResponseDTO } from "./userresponse.dto";
import { StadiumResponseDTO } from "./stadiumresponse.dto";

export class createActivityDTO{
    @ApiProperty({example:'组一群人随便打球',description:'the name of event'})
    name:string;

    @ApiProperty({example:2,description:'the stadiumId of event'})
    stadiumId:number

    @ApiProperty({example:'2023-08-20T14:00:00',description:'the start time'})
    startTime:Date;

    @ApiProperty({example:5,description:'the duration of the activity'})
    duration:number;

    @ApiProperty({example:10,description:'the target participants number'})
    targetParticipants:number;

    @ApiProperty({example:1,description:'the createor userId of activity'})
    creatorId: number; 

    @ApiProperty({example:'recruiting',description:'the status of activity'})
    status?:'recruiting'|'completed';
}

export class ActivityResponseDTO{
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Type(() => UserResponseDTO)
    creator: UserResponseDTO;

    // @Expose()
    // @Type(() => UserResponseDTO)
    // participants: UserResponseDTO[];
}

export class ActivityDetailDTO{
    @Expose()
    id:number;

    @Expose()
    name:string;

    @Expose()
    startTime:Date;

    @Expose()
    duration:number;

    @Expose()
    status:string;

    @Expose()
    targetParticipants:number;

    @Expose()
    currentParticipants:number;

    @Expose()
    @Type(()=>UserResponseDTO)
    creator:UserResponseDTO;

    @Expose()
    @Type(()=>StadiumResponseDTO)
    stadium:StadiumResponseDTO&{pricePerHour?:number};

    @Expose()
    @Type(() => UserResponseDTO) // 明确指定数组元素的转换类型
    participants:UserResponseDTO[];

    @Expose()
    description?:string;
}

export class UserActivityDTO{
    @Expose()
    id:number;

    @Expose()
    name:string;

    @Expose()
    status:'recruiting'|'complete';

    @Expose()
    startTime:Date;
}

export class JoinActicityDTO{
    //@Expose()
    @ApiProperty({example:1,description:'the activity id'})
    activityId:number;

    //@Expose()
    @ApiProperty({example:3,description:'the user id'})
    userId:number;
}

