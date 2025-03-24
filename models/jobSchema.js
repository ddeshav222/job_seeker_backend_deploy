import mongoose from "mongoose";

const jobSchema= new mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, "Please provide Job Title"],
            minlength: [3,"Job title must contain three characters"]
        },
        description:{
            type: String,
            required: [true, "Please provide Job Description"],
            minlength: [10,"Job Descripton must contain 10 characters"]
        },
        category:{
            type: String,
            required: [true, "Please provide Job Category"],
        },

        country:{
            type: String,
            required: [true, "Please provide Job Country"],
        },
        city:{
            type: String,
            required: [true, "Please provide Job City"],
        },
        location:{
            type: String,
            required: [true, "Please provide Job Location"],
        },
        fixedSalary:{
            type: Number,
            minlength: [4,"Fixed Salary should be greater than 999"]
        },
        salaryFrom:{
            type: Number,
            minlength: [4,"Salary should be greater than 999"]
        },
        salaryTo:{
            type: Number,
            minlength: [4,"Salary should be greater than 999"]
        },
        expired:{
            type: Boolean,
            default: false,
        },
        jobPostedOn:{
            type: Date,
            default: Date.now,
        },
        postedBy:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },







    }
);

export const Job= mongoose.model("Job", jobSchema);
