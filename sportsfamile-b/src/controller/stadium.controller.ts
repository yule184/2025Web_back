import { Controller,Inject,Post,Body } from "@midwayjs/core";
import { createStadiumDTO } from "../dto/createstadium.dto";
import { StadiumService } from "../service/stadium.service";

@Controller('/api/stadium')
export class StadiumController{
    @Inject()
    stadiumService:StadiumService;

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