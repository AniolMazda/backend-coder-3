import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app)
let authToken;
let testSessionId;

describe("Testing Sessions Route", function (){
     const testUser = {
        first_name: "Test",
        last_name: "Session",
        email: "testSession@example.com",
        password: "testsessionpassword"
    };
    
    it('Test de resgistro de un nuevo usuario', async () => {
        const response = await request.post('/api/sessions/register').send(testUser);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        testSessionId = response.body.payload
    });
    
    it('Test de registro si ya existe el usuario', async () => {
        const response = await request.post('/api/sessions/register').send(testUser);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').equal('error');
        expect(response.body).to.have.property('error').equal('User already exists');
    });

    it('Test de Login y retorno de cookie', async () => {
        const loginData = {
            email: testUser.email,
            password: testUser.password
        };
        const response = await request.post('/api/sessions/login').send(loginData);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.headers['set-cookie']).to.exist;
        authToken = response.headers['set-cookie'];
    });

    it('Test de Login y se coloca la contraseña mal', async () => {
        const loginData = {
            email: testUser.email,
            password: "wrongpassword"
        };
        const response = await request.post('/api/sessions/login').send(loginData);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').equal('error');
        expect(response.body).to.have.property('error').equal('Incorrect password');
    });

    it('Test que devuelve los datos del usuario', async () => {
        const response = await request.get('/api/sessions/current').set('Cookie', authToken);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body.payload).to.have.property('email').equal(testUser.email);
    });
    it('Test para eliminar un usuario', async () => {
        const response = await request.delete(`/api/users/${testSessionId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('message').equal('User deleted');
        const checkUser = await request.get(`/api/users/${testSessionId}`);
        expect(checkUser.status).to.equal(404);
        expect(checkUser.body).to.have.property('status').equal('error');
        expect(checkUser.body).to.have.property('error').equal('User not found');
    });
});