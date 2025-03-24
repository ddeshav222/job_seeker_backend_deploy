import {catchAssyncError} from "../middlewares/catchassyncError.js";
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";

export const employerGetAllApplications =catchAssyncError(async(req, res, next)=>{
    const {role} = req.user;

    if(role === "Job Seeker")
    {
        return next(new ErrorHandler("Job Seeker is not allowed to acces this resources!", 400));
    }

    const {_id}= req.user;

    const applications = await Application.find({'employerID.user': _id});
    res.status(200).json({
        success: true,
        applications
    })


});


export const jobSeekerGetAllApplications =catchAssyncError(async(req, res, next)=>{
    const {role} = req.user;

    if(role === "Employer")
    {
        return next(new ErrorHandler("Employer is not allowed to access this resources!", 400));
    }

    const {_id}= req.user;

    const applications = await Application.find({'applicantID.user': _id});
    res.status(200).json({
        success: true,
        applications
    })


});


export const jobSeekerDeleteApplication = catchAssyncError(async(req,res,next)=>{

    const {role} = req.user;

    if(role === "Employer")
    {
        return next(new ErrorHandler("Employer can't  delete application", 400));
    }

    const{id}= req.params;
    const applications = await Application.findById(id);

    if(!applications)
    {
        return next(new ErrorHandler("OOPs , application not found", 404));
    }

    await applications.deleteOne();

    res.status(200).json({
        success: true,
        message: "Application Deleted Succesfully"
    })
});


export const postApplication    = catchAssyncError(async(req, res, next)=>{
    
    const {role} = req.user;

    if(role === "Employer")
    {
        return next(new ErrorHandler("Employer is not allowed to post application", 400));
    }

    if(!req.files || Object.keys(req.files).length ===0 )
    {
        return next(new ErrorHandler("Resume file required",400));
    }

    const {resume}= req.files;

    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
    
    if(!allowedFormats.includes(resume.mimetype))
    {
        return next(new ErrorHandler("Invalid File type", 400));
    }

    const cloudinaryRespons =  await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    
    if(!cloudinaryRespons  || cloudinaryRespons.error)
    {
        console.error("Cloudinary Error: ", cloudinaryRespons.error || "Unknown Cloudinary error");

        return next(new ErrorHandler("Failed to upload resume", 500));
    }

    const { name,email, coverLetter, phone, address, jobId} = req.body;
    const applicantID= {
        user: req.user._id,
        role: "Job Seeker"
    };

    if(!jobId)
    {
        return next(new ErrorHandler("Job not found", 404));
    }

    const jobDetails = await Job.findById(jobId);
    if(!jobDetails)
    {
        return next(new ErrorHandler("Job not found", 404));
    }


    const employerID= {
        user: jobDetails.postedBy,
        role: "Employer"
    };

    if(!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume)
    {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const application = await Application.create(
    {   
         name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume:
        {
            public_id: cloudinaryRespons.public_id,
            url: cloudinaryRespons.secure_url,
        },


    })

res.status(200).json({
    success: true,
    message:"Application Submitted",
    application,
})

});


