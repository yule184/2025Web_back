import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Activity, Stadium, User } from "../entity";
import { Repository } from "typeorm";
import { createActivityDTO } from "../dto/activity.dto";
import { Like } from "typeorm";
import { UpdateActivityDTO } from "../dto/updateactivity.dto";

@Provide()
export class ActivityService{
    @InjectEntityModel(Activity)
    activityModel:Repository<Activity>;

    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>;

    @InjectEntityModel(User)
    userModel:Repository<User>

    // 获取场馆列表
    public async getRecruitingActivities(){
        return this.activityModel.find({
            where:{status:'recruiting'},
            select:['id','name','targetParticipants','currentParticipants'],
            
        });
    }



    // 新增活动
    public async createActivity(createDTO:createActivityDTO){
        // 获取场馆
        const stadium = await this.stadiumModel.findOne({
            where:{id:createDTO.stadiumId}
        });
        if(!stadium){
            throw new Error('场馆不存在');
        }

        // 获取用户
        const creator = await this.userModel.findOne({
            where:{id:createDTO.creatorId},
            select:['id','username'],
            // relations:['joinedActivities']
        });

        if(!creator){
            throw new Error('用户不存在');
        }

        const activity = new Activity();
        activity.name = createDTO.name;
        activity.stadium = stadium;
        activity.startTime = createDTO.startTime;
        activity.duration = createDTO.duration;
        activity.targetParticipants = createDTO.targetParticipants;
        activity.status = createDTO.status || 'recruiting';
        activity.currentParticipants = 1;
        
        activity.creator = creator;

        activity.participants = [creator];

        //creator.joinedActivities = [...(creator.joinedActivities||[]),activity];

        const result = await this.activityModel.save(activity);

        // await this.userModel.save(creator);

        
        

        return result;
    }

    // 根据活动id获取活动详细信息
    public async getAcitivityDetailById(id:number){
        return this.activityModel.findOne({
            where:{id},
            relations:['creator','stadium','participants'],
        });
    }

    // 根据用户id获取用户参加的活动
    public async getActivitesByUserId(userId:number){
        return this.activityModel.createQueryBuilder('activity')
        .innerJoin('activity.participants','user','user.id=:userId',{userId})
        .select([
            'activity.id',
            'activity.name',
            'activity.status',
            'activity.startTime'
        ])
        .getMany();
    }

    // 参加活动
    public async joinActivity(activityId:number,userId:number){
        const activity = await this.activityModel.findOne({
            where:{id:activityId},
            relations:['participants']
        });
        const user = await this.userModel.findOne({
            where:{id:userId}
        });

        if(!activity){
            throw new Error('活动不存在');
        }
        if(!user){
            throw new Error('用户不存在');
        }
        if(activity.status!=='recruiting'){
            throw new Error('该活动不在招募状态');
        }
        if(activity.participants.some(p=>p.id===userId)){
            throw new Error('您已参加过该活动');
        }
        if(activity.currentParticipants>=activity.targetParticipants){
            throw new Error('活动人数已满');
        }
        activity.participants=[...activity.participants,user];
        activity.currentParticipants+=1;

        if(activity.currentParticipants>=activity.targetParticipants){
            activity.status = 'completed';
        }

        await this.activityModel.save(activity);
        return{
            success:true,
            activityStatus:activity.status,
            currentParticipants:activity.currentParticipants
        };
    }

    // 搜索活动
    public async searchActivities(keyword:string){
        return this.activityModel.find({
            where:{
                name:Like(`%${keyword}%`)
            },
            relations:['creator'],
            take:20
        });
    }

    // 修改活动信息
    public async updateActivity(updateDTO:UpdateActivityDTO){
        const activity = await this.activityModel.findOne({
            where:{id:updateDTO.activityId},
            select:['id','name','description','duration','targetParticipants','currentParticipants','status']
        });

        if(!activity){
            throw new Error('活动不存在');
        }

        if(activity.status !== 'recruiting'){
            throw new Error('只能修改招募中的活动');
        }

        if(updateDTO.targetParticipants !== undefined){
            if(updateDTO.targetParticipants<activity.currentParticipants){
                throw new Error('修改后的招募人数不能小于当前报名人数');
            }
            if(updateDTO.targetParticipants === activity.currentParticipants){
                activity.status = 'completed';
            }
        }

        // 更新可选字段
        if (updateDTO.name !== undefined) activity.name = updateDTO.name;
        if (updateDTO.description !== undefined) activity.description = updateDTO.description;
        if (updateDTO.duration !== undefined) activity.duration = updateDTO.duration;
        if (updateDTO.targetParticipants !== undefined) {
            activity.targetParticipants = updateDTO.targetParticipants;
        }
        
        return await this.activityModel.save(activity);
    }
}