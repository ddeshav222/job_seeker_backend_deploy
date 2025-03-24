import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({ 
    
    name:{
        type: String,
        required: [true, "Please enter your name"],
        minlength: [3,"name must contain atleast three character"]
    },
    email:{
        type: String,
        validator: [validator.isEmail, "Please provide a valid email"],
        required: [true, "Please provide your email"]
    },
    coverLetter:{
        type: String,
        required: [true, "Please provide cover letter"]
    },
    phone:{
        type: Number,
        required: [true, "Please provide your phone number"]
    },
    address:{
        type: String,
        required: [true, "Please provide your address"]
    },
    resume:{
        public_id:{
            type: String,
            required: true,

        },
        url:{
            type: String,
            require: true,
        }
    },
    applicantID:{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role:{
            type: String,
            enum: ["Job Seeker"],
            required : true
        }
    },
    employerID:{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role:{
            type: String,
            enum: ["Employer"],
            required : true
        }
    }


});

export const Application = mongoose.model("Application",applicationSchema);