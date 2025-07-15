import {Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Activity, ActivityComment, User } from "../entity";
import { Repository } from "typeorm";
import { CreateActivityCommentDTO } from "../dto/activitycomment.dto";

@Provide()
export class ActivityCommentService{
    @InjectEntityModel(ActivityComment)
    commentModel:Repository<ActivityComment>;

    @InjectEntityModel(User)
    userModel:Repository<User>;

    @InjectEntityModel(Activity)
    activityMode:Repository<Activity>;

    // TODO: 创建评论
    public async createComment(createDTO:CreateActivityCommentDTO){
        const user = await this.userModel.findOne({
            where:{id:createDTO.userId}
        });
        if(!user){
            throw new Error('用户不存在');
        }

        const activity = await this.activityMode.findOne({
            where:{id:createDTO.activityId},
            relations:['participants']
        });
        if(!activity){
            throw new Error('活动不存在');
        }
        if(activity.status !== 'completed'){
            throw new Error('只能评论已结束的活动')
        }
        if(!activity.participants.some(p=>p.id===createDTO.userId)){
            throw new Error('您未参与该活动，无法评论');
        }

        const comment = new ActivityComment();
        comment.content = createDTO.content;
        comment.rating = createDTO.rating;
        comment.user = user;
        comment.activity = activity;
        return await this.commentModel.save(comment);
    }


    // TODO:根据活动id获取评论列表
    public async getCommentsByActivityId(activityId:number){
        return this.commentModel.find({
            where:{activity:{id:activityId}},
            relations:['user'],
            select:{
                id:true,
                content:true,
                rating:true,
                user:{
                    id:true,
                    username:true
                }
            }
        });
    }

}