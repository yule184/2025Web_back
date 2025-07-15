import { Controller, Get, Inject, Query } from "@midwayjs/core";
import { ActivityCommentService } from "../service/activitycomment.service";
import { CreateActivityCommentDTO } from "../dto/activitycomment.dto";
import { Body ,Post} from "@midwayjs/core";

@Controller('/api/activitycomment')
export class ActivityCommentController{
    @Inject()
    activityComentService:ActivityCommentService;

    @Post('/')
    public async createComment(@Body() createDTO:CreateActivityCommentDTO){
        try{
            const comment = await this.activityComentService.createComment(createDTO);
            return{
                code:200,
                data:comment,
                message:'评论成功'
            };
        }catch(e){
            return{
                code:400,
                message:e.message
            };
        }
    }

    //根据ID获取评论列表
    @Get('/byid')
    public async getCommentsByActivity(@Query('activityId') activityId:number){
        try{
            if(!activityId){
                throw new Error('activityId不能为空');
            }
            const comments = await this.activityComentService.getCommentsByActivityId(activityId);
            return{
                code:200,
                data:comments,
                message:'获取评论成功'
            };
        }catch(e){
            return{
                code:400,
                message:e.message
            };
        }
    }
}