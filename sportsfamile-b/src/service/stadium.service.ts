import { Provide } from "@midwayjs/core";
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Stadium } from "../entity";
import { createStadiumDTO } from "../dto/createstadium.dto";

@Provide()
export class StadiumService{

    /**
     * 注入 Stadium 实体的数据库操作模型
     */
    @InjectEntityModel(Stadium)
    stadiumModel:Repository<Stadium>


    /**
     * 创建新场馆
     * @param createStadiumDTO 场馆创建 DTO
     * @returns 新创建的场馆信息
     * @throws 场馆已存在
     */
    public async createStadium(createStadiumDTO:createStadiumDTO){
        // 检查场馆是否已存在
        const existStadium = await this.stadiumModel.findOne({
        where:{name:createStadiumDTO.name}
        });
        if(existStadium){
            throw new Error('该场馆已存在')
        }

        // 创建场馆实体并赋值
        const stadium = new Stadium();
        stadium.name = createStadiumDTO.name;
        stadium.address = createStadiumDTO.address;
        stadium.pricePerHour = createStadiumDTO.pricePerHour;
        stadium.rating = 0; // 新场馆默认评分为0

        // 保存场馆到数据库
        const result = await this.stadiumModel.save(stadium);
        return result;
    }

    /**
     * 获取所有场馆列表
     * @returns 场馆数组
     */
    public async getStadiumList(){
        return await this.stadiumModel.find({
            order:{
                id:'ASC'
            },
        });
    }

    /**
     * 获取场馆简要信息（用于下拉列表等场景）
     * @returns 场馆简要信息数组
     */    
    public async getSimpleStadiumList(){
        return this.stadiumModel.find({
            select:['id','name','address','pricePerHour']
        });
    }

    /**
     * 根据场馆id获取指定场馆详情信息
     * @param id 场馆id
     * @returns 场馆详情信息
     * @throws 场馆不存在
     */
    public async getStadiumById(id:number){
        // 查询场馆详情
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