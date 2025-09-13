import mongoose from 'mongoose';
import dotenv from 'dotenv';
const dbConnection = async () => {
    try {
        const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
        dotenv.config({ path: envPath });
        const PORT = process.env.PORT||8080;
        const connection = mongoose.connect(process.env.DB_LINK)
        console.log("Database Connected")
        return PORT
    } catch (err) {
        console.error("Error to connect a database"+err)
    }
}
const PORTDB = await dbConnection();
export {dbConnection,PORTDB}