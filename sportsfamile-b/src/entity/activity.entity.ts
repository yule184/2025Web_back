import { Column, Entity,  JoinTable,  ManyToMany,  ManyToOne,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";
import { Stadium } from "./stadium.entity";
import { User } from "./user.entity";
import { ActivityComment } from "./activitycomment.entity";

@Entity()
export class Activity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    name:string;


    @Column({type:'datetime' })
    startTime:Date;

    @Column('float')
    duration:number;

    @Column({default:'recruiting'})
    status:'recruiting'|'completed';

    @Column('int')
    targetParticipants:number;

    @Column('int',{default:0})
    currentParticipants:number;

    // 场馆
    @ManyToOne(()=>Stadium,stadium=>stadium.activities)
    stadium:Stadium;

    // 活动发起人
    @ManyToOne(()=>User,user=>user.createdActivities)
    creator:User;
    

    // 活动参与人
    @ManyToMany(()=>User,user=>user.joinedActivities)
    @JoinTable()
    participants:User[];

    
    // 活动评论
    @OneToMany(()=>ActivityComment,comment=>comment.activity)
    activityComments:ActivityComment[]

}