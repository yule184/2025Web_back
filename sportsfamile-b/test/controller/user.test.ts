import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { Application } from '@midwayjs/koa';
import { DataSource } from 'typeorm';
import * as entities from '../../src/entity'




describe('test/controller/user.test.ts', () => {
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

        // 创建测试用户
        // const userRepo = dataSource.getRepository(User);
        // const hashedPassword = await bcrypt.hash('testpassword', 10);
        // testUser = await userRepo.save({
        //     username: 'test_user',
        //     password: hashedPassword,
        //     name: 'Test User',
        //     sex: '男',
        //     identity: 'CUSTOMER',
        //     age: 25
        // });

        // 加密密码
        // const salt = await bcrypt.genSalt(10);
        // const hashedtp = await bcrypt.hash('111111',salt);



        // 4. 验证用户是否创建成功
        // const dbUser = await dataSource.getRepository(User).findOneBy({ username: 'test_user' });
        // if (!dbUser) throw new Error('测试用户创建失败');
        // else console.log('创建成功');
    });

    afterAll(async () => {
        // 先关闭应用
        await close(app);
        // 再关闭数据源
        await dataSource.destroy();
    })

    // beforeEach(async () => {
    //     // 只删除测试过程中创建的用户（假设测试用户的用户名有特定前缀，如 'test_'）
    //     await dataSource.getRepository(User)
    //         .createQueryBuilder()
    //         .delete()
    //         .where("username LIKE :pattern", { pattern: 'test_%' }) // 删除所有以 'test_' 开头的用户
    //         .execute();
    // });

    describe('POST /api/user/login', () => {
        it('should login successfully with correct credentials', async () => {
            const result = await createHttpRequest(app)
                .post('/api/user/login')
                .send({
                    username: 'admin',
                    password: '111111'
                });

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('登录成功');
            expect(result.body.data.userInfo).toEqual({
                id: 1,
                username: 'admin',
                identity: 'ADMIN'
            });
        });

        it('should fail with incorrect username', async () => {
            const result = await createHttpRequest(app)
                .post('/api/user/login')
                .send({
                    username: 'nonexistent',
                    password: 'testpassword'
                });

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(401);
            expect(result.body.message).toMatch(/用户名不存在/);
        });

        it('should fail with incorrect password', async () => {
            const result = await createHttpRequest(app)
                .post('/api/user/login')
                .send({
                    username: 'admin',
                    password: '22222'
                });

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(401);
            expect(result.body.message).toMatch(/密码错误/);
        });


    });



    describe('GET /api/user/info', () => {
        it('should get user info by username', async () => {
            const result = await createHttpRequest(app)
                .get('/api/user/info')
                .query({ username: 'admin' });

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(200);
            expect(result.body.message).toBe('success');
            expect(result.body.data).toEqual({
                id: 1,
                username: 'admin',
                name: '管理员',
                sex: '男',
                identity: 'ADMIN',
                tel: '12345678900',
                age: 99
            });
        });


        it('should fail when user does not exist', async () => {
            const result = await createHttpRequest(app)
                .get('/api/user/info')
                .query({ username: 'nonexistent' });

            expect(result.status).toBe(200);
            expect(result.body.code).toBe(404);
            expect(result.body.message).toMatch(/用户不存在/);
        });

    });
});