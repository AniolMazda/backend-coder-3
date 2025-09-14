import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app)
let testUserId;

describe("Testing Users Route", function (){
     const testUser = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@example.com",
        password: "testuserpassword"
    };
    it('Test de resgistro de un nuevo usuario', async () => {
        const response = await request.post('/api/sessions/register').send(testUser);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        testUserId = response.body.payload
    });
    it('Test para obtener todos los usuarios', async () => {
        const response = await request.get('/api/users');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('payload').that.is.an('array');
    });
    
    it('Test para obtener un usuario especifico', async () => {
        const response = await request.get(`/api/users/${testUserId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body.payload).to.have.property('_id').equal(testUserId);
    });

    it('Test para comprobar el error si el usuario no existe', async () => {
        const nonExistentId = '60c72b2f9b1d8e1c6c8d7e9f';
        const response = await request.get(`/api/users/${nonExistentId}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('status').equal('error');
        expect(response.body).to.have.property('error').equal('User not found');
    });

    it('Test para actualizar un cliente', async () => {
        const updatedData = {
            first_name: "Jane"
        };
        const response = await request.put(`/api/users/${testUserId}`).send(updatedData);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('message').equal('User updated');
    });
    it('Test para eliminar un usuario', async () => {
        const response = await request.delete(`/api/users/${testUserId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('message').equal('User deleted');
        const checkUser = await request.get(`/api/users/${testUserId}`);
        expect(checkUser.status).to.equal(404);
        expect(checkUser.body).to.have.property('status').equal('error');
        expect(checkUser.body).to.have.property('error').equal('User not found');
    });
});