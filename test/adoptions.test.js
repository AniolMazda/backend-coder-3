import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app)
let testUserId;
let testPetId;
let testAdoptionId;

describe("Testing Adoptions Route", function (){
    it('Test de registro de un nuevo usuario', async () => {
        const testUser = {
            first_name: "Test",
            last_name: "Adoption User",
            email: "testadoptionuser@example.com",
            password: "testadoptionuserpassword"
        };
        const response = await request.post('/api/sessions/register').send(testUser);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        testUserId = response.body.payload
    });
    it("Test para crear una nueva mascota", async function() {
        const petData = {
            name: "Test Pet",
            specie: "dog",
            birthDate: "2023-01-01"
        };
        const response = await request.post("/api/pets/").send(petData)
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body.payload).to.have.property('_id');
        expect(response.body.payload).to.have.property('name').equal('Test Pet');   
        testPetId = response.body.payload._id;
    });
    it("Test para crear una nueva adoption", async function() {
        const response = await request.post(`/api/adoptions/${testUserId}/${testPetId}`)
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').equal('success');
            expect(response.body).to.have.property('message').equal('Pet adopted');
    });
    it("Test para obtener todas las adopciones", async function() {
        const response = await request.get("/api/adoptions/")
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').equal('success');
            expect(response.body).to.have.property('payload').that.is.an('array');
        testAdoptionId = response.body.payload[0]._id
    });
    it("Test para obtener una adopción", async function() {
        const response = await request.get(`/api/adoptions/${testAdoptionId}`)
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').equal('success');
            expect(response.body).to.have.property('payload').that.is.an('object');
    });
    it("Test para comprobar un ID incorrecta en una adopción", async function() {
        const incorrectId = "68c742174919ca6f34d69b62"
        const response = await request.get(`/api/adoptions/${incorrectId}`)
            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('status').equal('error');
            expect(response.body).to.have.property('error').equal('Adoption not found');
    });
});