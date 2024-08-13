import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ItemEntity } from '../src/model/item.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PersonEntity } from '../src/model/person.entity';
import { AddressEntity } from '../src/model/address.entity';

jest.mock('../src/config/config.service', () => {
  return {
    configService: {
      getTypeOrmConfig: function (): TypeOrmModuleOptions {
        return {
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      getJwtSecret: function (): string {
        return 'secret';
      },
    },
  };
});

class Result {
  bearToken: string;
  person: PersonEntity;
}
async function getBearToken(app: INestApplication): Promise<Result> {
  const person = new PersonEntity();
  person.email = 'myemail';
  person.password = 'mypassword';
  await request(app.getHttpServer())
    .post('/api/person')
    .send(person)
    .expect(201);
  let bearToken: string;
  await request(app.getHttpServer())
    .post('/api/person/authenticate')
    .send(person)
    .expect(200)
    .expect(({ body }) => {
      expect(body).toBeDefined();
      bearToken = body.token;
    });
  return { bearToken: bearToken, person: person };
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
  });
  it('/api/person (POST)', async () => {
    const person = new PersonEntity();
    person.email = 'myemail';
    person.password = 'mypassword';
    await request(app.getHttpServer())
      .post('/api/person')
      .send(person)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(person.email);
      });
    return request(app.getHttpServer())
      .post('/api/person')
      .send(person)
      .expect(function (res) {
        expect(res.text).toContain(
          'email already linked to an account please, please log in',
        );
      });
  });

  it('/api/person/authenticate (POST)', async () => {
    const person = new PersonEntity();
    person.email = 'myemail';
    person.password = 'mypassword';
    await request(app.getHttpServer())
      .post('/api/person')
      .send(person)
      .expect(201);

    return request(app.getHttpServer())
      .post('/api/person/authenticate')
      .send(person)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('/api/person (GET)', async () => {
    const bearerToken = (await getBearToken(app)).bearToken;
    return request(app.getHttpServer())
      .get('/api/person')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
  });

  it('/api/person (PUT)', async () => {
    const bearerToken = (await getBearToken(app)).bearToken;
    return request(app.getHttpServer())
      .put('/api/person')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200);
  });

  it('/api/item (POST)', async () => {
    const bearerToken = (await getBearToken(app)).bearToken;
    const item = new ItemEntity();
    item.title = 'test';
    item.description = 'description';
    item.idExternal = 'idExternal';
    return request(app.getHttpServer())
      .post('/api/item')
      .send(item)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(201)
      .expect(({ body }) => {
        expect(body.title).toEqual(item.title);
        expect(body.description).toEqual(item.description);
        expect(body.id).toBeDefined();
      });
  });
  it('/api/item (GET)', async () => {
    const bearerToken = (await getBearToken(app)).bearToken;
    for (let i = 0; i < 10; i++) {
      const item = new ItemEntity();
      item.title = 'name' + i;
      item.description = 'description' + i;
      item.idExternal = 'idExternal' + i;
      await request(app.getHttpServer())
        .post('/api/item')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(item)
        .expect(201);
    }
    return request(app.getHttpServer())
      .get('/api/item')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(200)
      .expect(({ body }) => {
        const items = body as ItemEntity[];
        expect(items.length).toEqual(10);
      });
  });

  it('/api/address (PUT)', async () => {
    const result = await getBearToken(app);
    const addressEntity = new AddressEntity();
    addressEntity.city = 'city';
    addressEntity.country = 'country';
    addressEntity.street = 'street';
    addressEntity.person = result.person;
    addressEntity.postcode = 'postcode';
    return request(app.getHttpServer())
      .put('/api/address')
      .send(addressEntity)
      .set('Authorization', `Bearer ${result.bearToken}`)
      .expect(200);
  });

});
