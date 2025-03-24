import {catchAssyncError} from "../middlewares/catchassyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Job} from "../models/jobSchema.js";


export const getAllJobs = catchAssyncError(async(req, res, next)=>{
    const jobs= await Job.find({expired: false});
    res.status(200).json({
        success: true,
        jobs,
    });
});


export const postJob = catchAssyncError(async(req, res, next)=>{

    const {role} = req.user;
    if(role === "Job Seeker")
    {
        return next(new ErrorHandler("Job Seeker is not allowed to acces this resources!", 400));
    }

    const {
        title, 
        description,
         category, 
         country, 
         city, 
         location,
          fixedSalary, 
          salaryFrom ,
           salaryTo}= req.body;


    if(!title || !description || !category || !country || !city || !location)
    {
        return next(new ErrorHandler("Please enter all details ", 400));
    }

    if( (!salaryFrom || !salaryTo) && !fixedSalary)
    {
        return next(new ErrorHandler("Please either provide range salary or fixed salary"));
    }

    if ((salaryFrom && salaryTo) && fixedSalary)
    {
        return next(new ErrorHandler("Cannot enter  range salary and fixed salary together"));
    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title, 
        description,
         category, 
         country, 
         city, 
         location,
          fixedSalary, 
          salaryFrom ,
           salaryTo,
           postedBy
    });
    
    res.status(200).json({
        success: true,
        message: "Job posted successfully!",
        job
    })
    

});


export const getmyJobs = catchAssyncError(async(req, res, next)=>{
    const {role} = req.user;

    if(role === "Job Seeker")
    {
        return next(new ErrorHandler("Job Seeker is not allowed to acces this resources!", 400));
    }

    const myjobs= await Job.find({postedBy: req.user._id});
    res.status(200).json({
        success: true,
        myjobs,
    })
});

export const updateJobs= catchAssyncError(async(req, res, next)=>{
    const {role} = req.user;

    if(role === "Job Seeker")
    {
        return next(new ErrorHandler("Job Seeker is not allowed to acces this resources!", 400));
    }

    const {id} = req.params;
    let job = await Job.findById(id);
    
    if(!job)
    {
        return next(new ErrorHandler("OOPs, job not found!", 404));
    }

    job = await Job.findByIdAndUpdate(id, req.body , {
        new : true,
        runValidators: true,
        useFindAndModify: false,

    })

    res.status(200).json({
        success: true,
        job,
        message: "Job Updated Succesfully !"
    })

});



export const deleteJobs= catchAssyncError(async(req , res, next) => {
    const {role} = req.user;

    if(role === "Job Seeker")
    {
        return next(new ErrorHandler("Job Seeker is not allowed to acces this resources!", 400));
    }

    const {id} = req.params;

    let job = await Job.findById(id);
    
    if(!job)
    {
        return next(new ErrorHandler("OOPs, job not found!", 404));
    }

    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted succesfully!"
    })

});


export const getSingleJob = catchAssyncError(async (req,res,next)=>{
    
    const {id}= req.params;
    try {
        const job= await Job.findById(id);

        if(!job)
        {
            return next(new ErrorHandler("OOPs, job not found!", 404));
        }
        res.status(200).json({
            success: true,
            job
        })

    } catch (error) {
        return next(new ErrorHandler("Invalid ID/ CastError", 400));
    }

})