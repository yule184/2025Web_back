import { Entity, PrimaryGeneratedColumn,Column,ManyToOne} from "typeorm";
import { User } from "./user.entity";
import { Stadium } from "./stadium.entity";

@Entity()
export class StadiumComment{
    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    content: string;

    @Column('int') // 1-5分
    rating: number;

    // 关系
    @ManyToOne(() => User, user => user.stadiumComments)
    user: User;

    @ManyToOne(() => Stadium, stadium => stadium.comments)
    stadium: Stadium;
}