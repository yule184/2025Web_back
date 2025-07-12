import { Provide } from "@midwayjs/core";
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { StadiumComment } from "../entity";
import { User } from "../entity";
import { Stadium } from "../entity";
import { createStadiumCommentDTO } from "../dto/createstadiumcomment.dto";

@Provide()
export class StadiumCommentService{
    @InjectEntityModel(StadiumComment)
    commentModel:Repository<StadiumComment>

    @InjectEntityModel(User)
    userModel:Repository<User>

    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>

    public async getCommentsByStadiumId(stadiumId:number){
        const comments = await this.commentModel.find({
            where:{
                stadium:{id:stadiumId}
            },
            relations:['user'],
            select:{
                id:true,
                content:true,
                rating:true,
                user:{
                    id:true,
                    username:true,
                }
            }
        });
        return comments;
    }

    public async createComment(createDTO:createStadiumCommentDTO){
        const user = await this.userModel.findOne({
            where:{id:createDTO.userId}
        });
        if(!user){
            throw new Error('用户不存在');
        }

        const stadium = await this.stadiumModel.findOne({
            where:{id:createDTO.stadiumId},
            //relations:['comments']
            
        });
        if(!stadium){
            throw new Error('场馆不存在')
        }

        const comment = new StadiumComment();
        comment.content = createDTO.content;
        comment.rating = createDTO.rating;

        comment.user = user;
        comment.stadium = stadium;

        

        const result = await this.commentModel.save(comment);

        // 更新场馆评分
        // 重新查询该场馆的所有评论（包括刚添加的）
        const comments = await this.commentModel.find({
            where: { stadium: { id: stadium.id } }
        });

        // 计算新的平均评分
        if (comments.length > 0) {
            const totalRating = comments.reduce((sum, c) => sum + c.rating, 0);
            stadium.rating = parseFloat((totalRating / comments.length).toFixed(1));
            await this.stadiumModel.save(stadium);
        }
        
        return{
            ...result,
            user:{
                id:user.id,
                username:user.username,
            }
        };
    }
}