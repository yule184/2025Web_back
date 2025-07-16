import { Body, Controller, Get, Inject,Param,Post} from "@midwayjs/core";
import { ActivityService } from "../service/activity.service";
import { ActivityResponseDTO, createActivityDTO,ActivityDetailDTO, UserActivityDTO, JoinActicityDTO } from "../dto/activity.dto";
import { plainToInstance } from 'class-transformer';
import { UpdateActivityDTO } from "../dto/updateactivity.dto";

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

    // TODO:根据用户Id获取用户参加的活动
    @Get('/user/:userId')
    public async getActivitiesByUserId(@Param('userId') userId:number){
        try{
            const activities = await this.activityService.getActivitesByUserId(userId);
            return{
                code:200,
                message:'获取用户参与活动信息成功',
                data:plainToInstance(UserActivityDTO,activities,{
                    excludeExtraneousValues:true
                })
            };
        }catch(error){
            return{
                code:400,
                message:'获取用户参与活动信息失败：'+error.message
            };
        }
    }

    // 参加活动
    @Post('/join')
    public async joinActicity(@Body() joinDTO:JoinActicityDTO){
        try{
            const result = await this.activityService.joinActivity(
                joinDTO.activityId,
                joinDTO.userId
            );
            return{
                code:200,
                message: result.activityStatus === 'completed' 
                    ? '参加活动成功，活动人数已满' 
                    : '参加活动成功',
                data: {
                    currentParticipants: result.currentParticipants,
                    status: result.activityStatus
                }
            };
        }catch(e){
            return{
                code:400,
                message:e.message
            };
        }
    }

    @Get('/search/:keyword')
    public async searchActivities(@Param('keyword') keyword:string){
        try{
            const activities = await this.activityService.searchActivities(keyword);
            return{
                code:200,
                message:'搜索成功',
                data:plainToInstance(ActivityResponseDTO,activities,{
                    excludeExtraneousValues:true
                })
            };
        }catch(e){
            return{
                code:400,
                message:'搜索失败：'+e.message
            };
        }
    }

    // 修改活动
    @Post('/update')
    public async updateActivity(@Body() updateDTO:UpdateActivityDTO){
        try{
            const activity = await this.activityService.updateActivity(updateDTO);
            return {
                code:200,
                message:'修改活动成功',
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