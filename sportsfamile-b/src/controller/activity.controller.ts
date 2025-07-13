import { Body, Controller, Inject,Post } from "@midwayjs/core";
import { ActivityService } from "../service/activity.service";
import { ActivityResponseDTO, createActivityDTO } from "../dto/activity.dto";
import { plainToInstance } from 'class-transformer';


@Controller('/api/activity')
export class ActivityController{
    @Inject()
    activityService:ActivityService;

    @Post('/create')
    public async createActivity(@Body() createDTO:createActivityDTO){
        try{
            const activity = await this.activityService.createActivity(createDTO);
            return{
                code:200,
                message:'创建活动成功',
                data:plainToInstance(ActivityResponseDTO,activity,{
                    excludeExtraneousValues:true
                })
            };

        }catch(e){
            return{
                code:400,
                message:e.message
            };
        }
    }
}