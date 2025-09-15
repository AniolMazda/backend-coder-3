import { usersService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.delete(userId);
    res.send({status:"success",message:"User deleted"})
}

const addDocuments = async(req,res) => {
    const files = req.files;
    const userId = req.params.uid;
    if (!files || files.length === 0) return res.status(400).send({ status: "error", error: "No files uploaded" });
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"});
    const newDocuments = files.map(f => ({
        name: f.filename,
        reference: `${__dirname}/../public/documents/${f.filename}`
    }));
    const result = await usersService.update(userId,{documents:newDocuments});
    res.send({status:"success",message:"User updated"});
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    addDocuments
}