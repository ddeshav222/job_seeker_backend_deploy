import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { decrypt } from "dotenv";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please provide your name"],
        minlength: [3, "Name must containg atleast three characters!"],
        maxlength: [30, "Name cannot exceed thirty characters!"],

    },
    email: {
        type: String,
        required: [true,"Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"],

    },
    phone: {
        type: Number,
        required : [true, "Please provide your phone number"],
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        minlength: [3, "Name must containg atleast three characters!"],
        maxlength: [30, "Name cannot exceed thirty characters!"],
        select: false
    },
    role:{
        type: String,
        require: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },

});


// Hasing the password

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    {
        next();

    }
    this.password = await bcrypt.hash(this.password, 10 );

});


// Comparing password

userSchema.methods.comparePassword = async function(enterPasswrod){
    return await bcrypt.compare(enterPasswrod, this.password);
};

// Genrating a JWT token for authorization

userSchema.methods.getJWTToken = function(){

    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn : process.env.JWT_EXPIRE , 
    });
};



export const User= mongoose.model("User", userSchema);
 