import { fakerES } from "@faker-js/faker";
import { createHash } from "../utils/index.js";
import { usersService,petsService } from "../services/index.js";
import PetDTO from "../dto/Pet.dto.js";

const usersLoop = async(config) => {
    const mockUsers = []
    const roles = ["user","admin"]
    for(let i = 0; i < config.number; i++){
        let user = {
            first_name:fakerES.person.firstName(),
            last_name:fakerES.person.lastName(),
            email:fakerES.internet.email(),
            password:await createHash("coder123")
        }
        if(config.role){
            let roleNumber = Math.floor(Math.random() * roles.length);
            user.role = roles[roleNumber]
        }
        if(config.create){
            let result = await usersService.create(user);
        }
        mockUsers.push(user)
    }
    return mockUsers
}
const petsLoop = async(config) => {
    const mockPets = []
    for(let i = 0; i < config.number; i++){
        let pet = {
            name: fakerES.animal.petName(),
            specie: fakerES.animal.dog(),
            birthDate: fakerES.date.birthdate({mode:'age',min:1,max:16})
        }
        let petD = PetDTO.getPetInputFrom(pet);
        if(config.create){
            const result = await petsService.create(pet);
        }
        mockPets.push(petD)
    }
    return mockPets
}
export {usersLoop,petsLoop}