import { Body, Controller, Get, Inject,Param,Post } from "@midwayjs/core";
import { ActivityService } from "../service/activity.service";
import { ActivityResponseDTO, createActivityDTO,ActivityDetailDTO } from "../dto/activity.dto";
import { plainToInstance } from 'class-transformer';


@Controller('/api/activity')
export class ActivityController{
    @Inject()
    activityService:ActivityService;

    @Get('/')
    public async getRecruitingActivities(){
        try{
            const activities = await this.activityService.getRecruitingActivities();
            return{
                code:200,
                message:'获取活动列表成功',
                data:activities
            };
        }catch(e){
            return{
                code:400,
                message:e.message
                
            };
        }
        
    }

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

    @Get('/:id')
    public async getActivityDetailById(@Param('id') id:number){
        try{
            const activity = await this.activityService.getAcitivityDetailById(id);
            if(!activity){
                return{
                    code:404,
                    message:'活动不存在'
                };
            }
            return{
                code:200,
                message:'获取指定活动详情成功',
                // data:activity

                data:plainToInstance(ActivityDetailDTO,activity,{
                    excludeExtraneousValues:true,
                })
            };
        }catch(e){
            return{
                code:400,
                message:'获取详情失败'
            }
        }
    }
}