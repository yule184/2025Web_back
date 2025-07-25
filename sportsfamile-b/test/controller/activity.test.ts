import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { Application } from '@midwayjs/koa';
import { DataSource } from 'typeorm';
import * as entities from '../../src/entity'




describe('test/controller/activity.test.ts', () => {
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


    describe('GET /api/activity/', () => {
        it('should get recruiting activities correctly', async () => {
            const result = await createHttpRequest(app)
                .get('/api/activity/')
                ;

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('获取活动列表成功');
            
        });

        

    });



    describe('GET /api/activity/:id', () => {
        it('should get detail information of target stadium', async () => {
            const result = await createHttpRequest(app)
                .get('/api/activity/1')

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('获取指定活动详情成功');
            expect(result.body.data.id).toBe(1);
            
        });
    });
});