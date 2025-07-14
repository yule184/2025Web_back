import { Provide } from "@midwayjs/core";
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Stadium } from "../entity";
import { createStadiumDTO } from "../dto/createstadium.dto";

@Provide()
export class StadiumService{
    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>

    public async createStadium(createStadiumDTO:createStadiumDTO){
        // 检查场馆是否已存在
        const existStadium = await this.stadiumModel.findOne({
        where:{name:createStadiumDTO.name}
        });
        if(existStadium){
            throw new Error('该场馆已存在')
        }

        const stadium = new Stadium();
        stadium.name = createStadiumDTO.name;
        stadium.address = createStadiumDTO.address;
        stadium.pricePerHour = createStadiumDTO.pricePerHour;
        stadium.rating = 0;

        const result = await this.stadiumModel.save(stadium);
        return result;
    }

    // 获取所有场馆
    public async getStadiumList(){
        return await this.stadiumModel.find({
            order:{
                id:'ASC'
            },
        });
    }

    // 获取场馆简要信息，为了后续方便
    public async getSimpleStadiumList(){
        return this.stadiumModel.find({
            select:['id','name','address','pricePerHour']
        });
    }

    // 根据场馆id获取指定场馆详情信息
    public async getStadiumById(id:number){
        const stadium = await this.stadiumModel.findOne({
        where:{id},
        select:['id','name','address','pricePerHour','rating']
        });

        if(!stadium){
            throw new Error('场馆不存在');
        }

        return stadium;
    }

}