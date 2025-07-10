import { Entity, PrimaryGeneratedColumn,Column,Unique } from "typeorm";

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
}