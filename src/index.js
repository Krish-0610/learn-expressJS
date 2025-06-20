import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw(error)   
        })

    app .listen(process.env.PORT || 8000, () => {
        console.log((` Server is running at ${process.env.PORT}`));
        
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
});







// Another way inside index.js
/*
import express from "express";


const app = express()

;(async () => {
    try {
        await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw(error)   
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
})()
*/