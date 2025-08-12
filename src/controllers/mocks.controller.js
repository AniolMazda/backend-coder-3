import { usersLoop,petsLoop } from "../utils/mocksLoops.js";

const getMockingPets = async(req,res)=>{
    const pet = await petsLoop({number:1})
    res.send({status:"success",payload:pet})
}
const getMockingUsers = async(req,res)=>{
    const uid = req.params.uid
    const mockUsers = await usersLoop({number:uid,role:true})
    res.send({status:"success",payload:mockUsers})
}
const createData = async(req,res)=>{
    const {numberUsers,numberPets} = req.body
    if(!numberUsers||!numberPets) return res.status(400).send({status:"error",error:"Incomplete values"})
    const mockUsers = await usersLoop({number:numberUsers,create:true});
    const mockPets = await petsLoop({number:numberPets,create:true});
    res.send({status:"success",payload:{mockUsers,mockPets}})
}
export default {
    getMockingPets,
    getMockingUsers,
    createData
}