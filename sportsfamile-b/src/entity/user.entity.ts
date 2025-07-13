import { Entity, PrimaryGeneratedColumn,Column,Unique,OneToMany, ManyToMany } from "typeorm";
import { StadiumComment } from "./stadiumcomment.entity";
import { Activity } from "./activity.entity";
import { ActivityComment } from "./activitycomment.entity";
// import { Exclude } from 'class-transformer';
// import { JoinTable } from "typeorm";


@Entity()
@Unique(['username'])
export class User{

    // 自增主键
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true,nullable:false})
    username:string;

    @Column({nullable:false})
    password:string;

    @Column({nullable:true})
    name?:string;

    @Column({nullable:true})
    sex?:string;

    @Column({nullable:true})
    tel?:string;

    @Column({nullable:true})
    age?:number;

    @Column({nullable:false})
    identity:string;

    // 新增：用户发出的场馆评论
    @OneToMany(() => StadiumComment, comment => comment.user)
    stadiumComments: StadiumComment[];

    // 用户参加的活动 多对多
    // @Exclude() // 关键点：排除循环字段
    @ManyToMany(()=>Activity,activity=>activity.participants)
    // @JoinTable()
    joinedActivities:Activity[];

     // 新增：用户创建的活动（一对多）
    // @Exclude() // 关键点：排除循环引用字段
    @OneToMany(() => Activity, activity => activity.creator)
    createdActivities: Activity[];

    // 用户发布的活动评论
    @OneToMany(()=>ActivityComment,comment=>comment.user)
    activityComments:ActivityComment[];

}