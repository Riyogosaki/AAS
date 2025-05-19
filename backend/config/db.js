import mongoose from "mongoose";

export const ConnectDb = async()=>{
try {
    const data= await mongoose.connect(process.env.MONGO_URI);
console.log(`Mongo is Connected : ${data.connection.host}`);    
} catch (error) {
    console.error("Mongoose is Not Connected",console.error);
    process.exit(1);
}
}