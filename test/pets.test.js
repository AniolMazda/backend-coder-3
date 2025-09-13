import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

import 'dotenv/config'

mongoose.set("strictQuery",true)

const request = supertest(app)
let testPetId;

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
describe("Testing Pets Route", function (){
    it("Test para obtener todas las mascotas", async function() {
        const response = await request.get("/api/pets/")
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status').equal('success');
            expect(response.body).to.have.property('payload').that.is.an('array');
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
    it('Test para comprobar error por datos incompletos a la hora de crear una mascota', async () => {
        const incompletePetData = {
            name: "Incomplete Pet"
        };
        const response = await request.post('/api/pets').send(incompletePetData);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('status').equal('error');
        expect(response.body).to.have.property('error').equal('Incomplete values');
    });
    it('Test para actualizar una mascota', async () => {
        const updatedData = {
            specie: "cat"
        };
        const response = await request.put(`/api/pets/${testPetId}`).send(updatedData);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('message').equal('pet updated');
    });
    it('Test para eliminar una mascota', async () => {
        const response = await request.delete(`/api/pets/${testPetId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body).to.have.property('message').equal('pet deleted');
        const checkPet = await request.get(`/api/pets/${testPetId}`);
        expect(checkPet.status).to.equal(404);
        expect(checkPet.body).to.have.property('status').equal('error');
    });
    it('Test de creación de mascota con imagen', async () => {
        const response = await request.post('/api/pets/withimage')
            .field('name', 'Image Pet')
            .field('specie', 'hamster')
            .field('birthDate', '2022-05-15')
            .attach('image', './test/04.png');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status').equal('success');
        expect(response.body.payload).to.have.property('name').equal('Image Pet');
        expect(response.body.payload).to.have.property('image').to.include('public/img/');
    });
});
after(async function(){
        await mongoose.connection.close();
        console.log("Se ha desconectado la base de datos")
}); 