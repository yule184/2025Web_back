import { Controller,Inject,Post,Body,Query,Get} from "@midwayjs/core";
import { createStadiumCommentDTO } from "../dto/createstadiumcomment.dto";
import { StadiumCommentService } from "../service/stadiumcomment.service";

@Controller('/api/stadiumcomment')
export class StadiumCommentController{
    @Inject()
    stadiumCommentService:StadiumCommentService;

    @Get('/byid')
    public async getComments(@Query('stadiumId') stadiumId:number){
        try{
            if(!stadiumId){
                throw new Error('stadiumId不能为空');
            }

            const comments = await this.stadiumCommentService.getCommentsByStadiumId(stadiumId);
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

    @Post('/')
    public async createStadiumComment(@Body() createDTO:createStadiumCommentDTO){
        try{
            const comment = await this.stadiumCommentService.createComment(createDTO);
            return{
                code:200,
                data:comment,
                message:'评论成功'
            };
        }catch(e){
            return {
                code:400,
                message:e.message,
            };
        }
    }
}