import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { Application } from '@midwayjs/koa';
import { DataSource } from 'typeorm';
import * as entities from '../../src/entity'




describe('test/controller/stadium.test.ts', () => {
    let app: Application;
    let dataSource: DataSource;

    beforeAll(async () => {
        // 1. 先初始化数据源
        dataSource = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            logging: false,
            entities: [...Object.values(entities)],  // 引入实体（数据库的东西）
        });

        // 2. 等待数据源连接
        await dataSource.initialize();

        // 3. 创建应用
        app = await createApp<Framework>();

    });

    afterAll(async () => {
        // 先关闭应用
        await close(app);
        // 再关闭数据源
        await dataSource.destroy();
    })


    describe('GET /api/stadium/', () => {
        it('should get stadiums correctly', async () => {
            const result = await createHttpRequest(app)
                .get('/api/stadium/')
                ;

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('获取场馆列表成功');
            
        });

        

    });



    describe('GET /api/stadium/simplelist', () => {
        it('should get stadium list with simple information', async () => {
            const result = await createHttpRequest(app)
                .get('/api/stadium/simplelist')

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('获取场馆简略列表成功');
            
        });
    });

    describe('GET /api/stadium/:id', () => {
        it('should get detail information of target stadium', async () => {
            const result = await createHttpRequest(app)
                .get('/api/stadium/1')

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('获取场馆详情成功');
            expect(result.body.data.id).toBe(1);
            
        });
    });
});