import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Activity, Stadium, User } from "../entity";
import { Repository } from "typeorm";
import { createActivityDTO } from "../dto/activity.dto";
import { Like } from "typeorm";
import { UpdateActivityDTO } from "../dto/updateactivity.dto";

@Provide()
export class ActivityService{

    /**
     * 注入 Activity 实体的数据库操作模型
     */
    @InjectEntityModel(Activity)
    activityModel:Repository<Activity>;

    /**
     * 注入 Stadium 实体的数据库操作模型
     */
    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>;

    /**
     * 注入 User 实体的数据库操作模型
     */
    @InjectEntityModel(User)
    userModel:Repository<User>

    /**
     * 获取所有招募中的活动列表
     * @returns 招募中的活动数组
     */
    public async getRecruitingActivities(){
        return this.activityModel.find({
            where:{status:'recruiting'},
            select:['id','name','targetParticipants','currentParticipants'],
            
        });
    }



    /**
     * 新增活动
     * @param createDTO 活动创建 DTO
     * @returns 新创建的活动信息
     * @throws 场馆或用户不存在
     */
    public async createActivity(createDTO:createActivityDTO){
        // 获取场馆
        const stadium = await this.stadiumModel.findOne({
            where:{id:createDTO.stadiumId}
        });
        if(!stadium){
            throw new Error('场馆不存在');
        }

        // 获取活动创建者用户
        const creator = await this.userModel.findOne({
            where:{id:createDTO.creatorId},
            select:['id','username'],
            // relations:['joinedActivities']
        });

        if(!creator){
            throw new Error('用户不存在');
        }

        // 创建活动实体并赋值
        const activity = new Activity();
        activity.name = createDTO.name;
        activity.stadium = stadium;
        activity.startTime = createDTO.startTime;
        activity.duration = createDTO.duration;
        activity.targetParticipants = createDTO.targetParticipants;
        activity.status = createDTO.status || 'recruiting';
        activity.currentParticipants = 1; // 创建者自动报名
        
        activity.creator = creator;
        activity.participants = [creator];

        // 保存活动到数据库
        const result = await this.activityModel.save(activity);
        return result;
    }

    /**
     * 根据活动id获取活动详细信息
     * @param id 活动id
     * @returns 活动详细信息
     */
    public async getAcitivityDetailById(id:number){
        return this.activityModel.findOne({
            where:{id},
            relations:['creator','stadium','participants'],
        });
    }

    /**
     * 根据用户id获取用户参加的活动列表
     * @param userId 用户id
     * @returns 用户参加的活动数组
     */
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

    /**
     * 用户报名参加活动
     * @param activityId 活动id
     * @param userId 用户id
     * @returns 报名结果及活动状态
     * @throws 活动或用户不存在、活动状态不符、人数已满、重复报名
     */
    public async joinActivity(activityId:number,userId:number){
        // 查询活动和用户
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

        // 添加用户到活动参与者列表
        activity.participants=[...activity.participants,user];
        activity.currentParticipants+=1;
        
        // 如果人数已满则自动完成活动
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

    /**
     * 搜索活动（按名称模糊匹配）
     * @param keyword 关键字
     * @returns 匹配的活动列表
     */
    public async searchActivities(keyword:string){
        return this.activityModel.find({
            where:{
                name:Like(`%${keyword}%`)
            },
            relations:['creator'],
            take:20
        });
    }

    /**
     * 修改活动信息
     * @param updateDTO 活动更新 DTO
     * @returns 更新后的活动信息
     * @throws 活动不存在、活动状态不符、人数限制错误
     */
    public async updateActivity(updateDTO:UpdateActivityDTO){
        // 查询活动
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

        // 校验目标人数
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