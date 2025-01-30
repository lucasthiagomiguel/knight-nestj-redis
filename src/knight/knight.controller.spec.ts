import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { KnightsModule } from './knight.module'; // Ajuste para o caminho do seu módulo
import { INestApplication } from '@nestjs/common';
import { describe, it } from 'node:test';

describe('Knight Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [KnightsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/knights (GET)', () => {
    return request(app.getHttpServer())
      .get('/knights')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array); // Verifique se a resposta é um array
      });
  });

  it('/knights?filter=heroes (GET)', () => {
    return request(app.getHttpServer())
      .get('/knights?filter=heroes')
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        response.body.forEach((knight) => {
          expect(knight.attack).toBeGreaterThan(50); // Verifique se o ataque é maior que 50
        });
      });
  });

  it('/knights (POST)', () => {
    const knight = {
      name: 'Laurenti',
      nickname: 'Lau',
      birthday: '1994-08-25',
      weapons: [{ name: 'sword', mod: 3, attr: 'strength', equipped: true }],
      attributes: {
        strength: 10,
        dexterity: 8,
        constitution: 9,
        intelligence: 7,
        wisdom: 6,
        charisma: 5,
      },
      keyAttribute: 'strength',
    };

    return request(app.getHttpServer())
      .post('/knights')
      .send(knight)
      .expect(201)
      .then((response) => {
        expect(response.body.name).toBe(knight.name); // Verifique se o nome foi salvo corretamente
      });
  });

  it('/knights/:id (DELETE)', () => {
    const knightId = 'some-id';
    return request(app.getHttpServer())
      .delete(`/knights/${knightId}`)
      .expect(200);
  });

  it('/knights/:id (PUT)', () => {
    const knightId = 'some-id';
    const updateData = { nickname: 'NewNickname' };

    return request(app.getHttpServer())
      .put(`/knights/${knightId}`)
      .send(updateData)
      .expect(200)
      .then((response) => {
        expect(response.body.nickname).toBe(updateData.nickname);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
