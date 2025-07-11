import { Controller,Inject,Post,Body,Get } from "@midwayjs/core";
import { createStadiumDTO } from "../dto/createstadium.dto";
import { StadiumService } from "../service/stadium.service";

@Controller('/api/stadium')
export class StadiumController{
    @Inject()
    stadiumService:StadiumService;

    @Get('/')
    public async getStadiumList(){
        try{
            const stadiums = await this.stadiumService.getStadiumList();
            return{
                code:200,
                data:stadiums,
                message:'获取场馆列表成功',
            };
        }catch(e){
            return {
                code:400,
                message:'获取场馆列表失败：'+e.message,
            };
        }
    }

    @Post('/create')
    public async createStadium(@Body() createStadiumDTO:createStadiumDTO){
        try{
            const stadium = await this.stadiumService.createStadium(createStadiumDTO);
            return {
                code:200,
                data:stadium,
                message:'场馆创建成功',
            };
        }catch(e){
            return{
                code:400,
                message:'场馆创建失败'+e.message,
            };
        }
    }


}