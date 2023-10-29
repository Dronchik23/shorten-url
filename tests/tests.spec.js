import request from 'supertest';
import {afterAll, beforeAll, beforeEach, describe, expect, it} from '@jest/globals';
import {app, shortCodeToUrl, urlToShortCode} from "../app/server.js";

let server;
const TEST_PORT = 5002;

beforeAll(() => {
    server = app.listen(TEST_PORT);
});
afterAll(done => {
    server.close(done);
});

describe('Сервис сокращения URL', () => {
    beforeEach(() => {
        for (let key in urlToShortCode) {
            delete urlToShortCode[key];
        }
        for (let key in shortCodeToUrl) {
            delete shortCodeToUrl[key];
        }
    });

    it('должен сокращать новый URL', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({url: 'www.example.com'});
        expect(response.status).toBe(200);
        expect(response.body.shortUrl).toBeDefined();
    });

    it('должен успешно создать короткий URL с кастомным кодом', async () => {
        const url = 'www.example.com';
        const response = await request(app).post('/shorten').send({url: url, customCode: 'кастом123'});

        expect(response.status).toBe(200);
        expect(response.body.shortUrl).toBe('кастом123');
    });

    it('должен возвращать существующий короткий код для ранее сокращенного URL', async () => {
        const url = 'www.example.com';
        const первыйОтвет = await request(app).post('/shorten').send({url});
        const второйОтвет = await request(app).post('/shorten').send({url});

        expect(второйОтвет.status).toBe(200);
        expect(второйОтвет.body.shortUrl).toBe(первыйОтвет.body.shortUrl);
    });

    it('не должен разрешать использование существующего кастомного кода', async () => {
        const первыйUrl = 'www.example.com';
        await request(app).post('/shorten').send({url: первыйUrl, customCode: 'кастом123'});
        const response = await request(app).post('/shorten').send({
            url: 'www.example.org',
            customCode: 'кастом123'
        });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Код уже используется');
    });

    it('должен отклонять URL, который не начинается с "www."', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({url: 'https://example.com'});

        const errors = response.body.errors;
        const errorMsgs = errors.map(error => error.msg);

        expect(errorMsgs).toContain('URL должен начинаться с "www."');
    });

    it('должен успешно сокращать URL, который начинается с "www."', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({url: 'www.example.com'});

        expect(response.status).toBe(200);
        expect(response.body.shortUrl).toBeDefined();
    });
});

describe('Перенаправление по короткому URL', () => {
    beforeEach(() => {
        for (let key in urlToShortCode) {
            delete urlToShortCode[key];
        }
        for (let key in shortCodeToUrl) {
            delete shortCodeToUrl[key];
        }
    });

    it('должен вернуть ошибку для недопустимого короткого кода', async () => {
        const invalidShortCode = '1234';
        const response = await request(app).get(`/${invalidShortCode}`);

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Поле shortCode должно иметь длину в 5 символов'
                })
            ])
        );
    });

    it('должен перенаправлять по короткому URL', async () => {
        const url = 'www.example.com';
        const customCode = '12345';
        await request(app).post('/shorten').send({url: url, customCode: customCode});

        const redirectResponse = await request(app).get(`/${customCode}`);
        expect(redirectResponse.status).toBe(302);
        expect(redirectResponse.headers.location).toBe('https://' + url);
    });

    it('должен возвращать 404 для несуществующего короткого кода', async () => {
        const fakeCode = '12345'

        const response = await request(app).get(`/${fakeCode}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe('URL не найден');
    });
});

