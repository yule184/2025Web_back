import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Activity, Stadium, User } from "../entity";
import { Repository } from "typeorm";
import { createActivityDTO } from "../dto/activity.dto";

@Provide()
export class ActivityService{
    @InjectEntityModel(Activity)
    activityModel:Repository<Activity>;

    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>;

    @InjectEntityModel(User)
    userModel:Repository<User>

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
            relations:['joinedActivities']
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
        creator.joinedActivities = [...(creator.joinedActivities||[]),activity];

        await this.userModel.save(creator);

        const result = await this.activityModel.save(activity);
        

        return result;
    }
}