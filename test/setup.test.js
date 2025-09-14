import mongoose from "mongoose";
import 'dotenv/config'

before(async function () {
    this.timeout(5000)
    if (mongoose.connection.readyState !== 1) {
        console.log("Conectando a la base de datos de tests...");
        try {
            await mongoose.connect(process.env.DB_LINK);
        } catch (error) {
            console.error("Error al conectar a la base de datos de tests:", error);
            process.exit(1);
        }
    } else {
        console.log("Ya existe una conexión a la base de datos.");
    }
});
after(async function(){
        await mongoose.connection.close();
        console.log("Se ha desconectado la base de datos")
}); 