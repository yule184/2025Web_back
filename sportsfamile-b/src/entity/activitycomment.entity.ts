import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Activity } from "./activity.entity";

@Entity()
export class ActivityComment{
    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    content:string;

    @Column('int')
    rating:number;

    // 用户
    @ManyToOne(()=>User,user=>user.activityComments)
    user:User;

    //活动
    @ManyToOne(()=>Activity,activity=>activity.activityComments)
    activity:Activity;

}