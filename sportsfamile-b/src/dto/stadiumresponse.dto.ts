import {Expose} from 'class-transformer'

export class StadiumResponseDTO{
    @Expose()
    id:number;

    @Expose()
    name:string;

    @Expose()
    address:string;
}