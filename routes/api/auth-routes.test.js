const app = require('../../app');
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const { DB_TEST_HOST, PORT } = process.env;

describe("test login route", () => {
    let server;
    const loginData = {
        email: "example777@example.com",
        password: "examplepassword"
    };

    beforeAll(async () => {
        await mongoose.connect(DB_TEST_HOST);
        server = app.listen(PORT);
    });

    afterAll(async () => {
        server.close()
        await mongoose.connection.close()
    });
    
    test("login data processed correctly", async () => {
        const res = await request(server).post('/users/login').send(loginData);
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBeDefined();
        expect(res.body.user.subscription).toBeDefined();
        expect(typeof res.body.user.email).toBe('string');
        expect(typeof res.body.user.subscription).toBe('string');
    });
});