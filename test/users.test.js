import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

import 'dotenv/config'

mongoose.set("strictQuery",true)

const request = supertest(app)
let authToken;

before(async function () {
    this.timeout(5000)
    if (mongoose.connection.readyState !== 1) {
        console.log("Conectando a la base de datos de tests...");
        try {
            mongoose.connect(process.env.DB_LINK);
        } catch (error) {
            console.error("Error al conectar a la base de datos de tests:", error);
        }
    } else {
        console.log("Ya existe una conexión a la base de datos.");
    }
});
describe("Testing Users Route", function (){
     const testUser = {
            first_name: "Test",
            last_name: "User",
            email: "testuser@example.com",
            password: "testpassword"
        };
        
        it('Test de resgistro de un nuevo usuario', async () => {
            const response = await request.post('/api/sessions/register').send(testUser);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').equal('success');
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
});
after(async function(){
        await mongoose.connection.close();
        console.log("Se ha desconectado la base de datos")
}); 