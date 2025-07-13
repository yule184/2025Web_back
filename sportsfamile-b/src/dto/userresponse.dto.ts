import { Expose } from 'class-transformer';

export class UserResponseDTO {
    @Expose()
    id: number;

    @Expose()
    username: string;

    // 注意：不暴露关联实体！
}