import mongoose from "mongoose";


export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "MERN_STACK_JOB_SEEKING"

    }).then(()=>{
        console.log('Connected to Database');

    }).catch((err)=>{
        console.log(`Some error occure while connecting to database : ${err}`);
    });

};