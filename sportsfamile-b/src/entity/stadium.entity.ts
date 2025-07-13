import { Entity, PrimaryGeneratedColumn,Column,OneToMany} from "typeorm";
import { StadiumComment } from "./stadiumcomment.entity";
import { Activity } from "./activity.entity";

@Entity()
export class Stadium{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({ nullable: false,unique:true })
    name: string;

    @Column({ nullable: false })
    address: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    pricePerHour: number;

    @Column('float', { default: 0 })
    rating: number; // 根据评论自动计算

    // 场馆拥有的评论
    @OneToMany(() => StadiumComment, comment => comment.stadium)
    stadiumComments: StadiumComment[];

    // 场馆关联的活动
    @OneToMany(()=>Activity,activity=>activity.stadium)
    activities:Activity[]
}