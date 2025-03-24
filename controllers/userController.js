import { catchAssyncError } from "../middlewares/catchassyncError.js"
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAssyncError(async(req,res,next)=>{
    const {name, email , phone , role , password} = req.body;

    if( !name || !email || !phone || !role || !password )
    {
        return next(new ErrorHandler("Please fill required fields"));
    }
 
    const isEmail = await User.findOne({ email });

    if(isEmail)
    {
        return next(new ErrorHandler("Email already Exsists"));
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    });

    sendToken(user, 200, res, "User Registered Succesfully!")


});

export const login = catchAssyncError(async (req, res, next)=>{
    const { email, password, role }= req.body;

    if(!email || !password || !role)
    {
        return next(new ErrorHandler("Please provide email password and role", 400));

    }

    const user= await User.findOne({email}).select("+password");
    
    if(!user)
    {
        return next(new ErrorHandler("Invalid Email or Password", 400));

    }

    const isPAsswordMatched= await  user.comparePassword(password);

    if(!isPAsswordMatched)
    {
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    if(user.role !== role)
    {
        return next(new ErrorHandler("User with this role is not found", 400));
    }


    sendToken(user, 200, res, "User Logged in Succesfully ");
});



export const logout = catchAssyncError(async(req, res, next)=>{
    res
      .status(201)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "User logged out Succesfully!",
      });

});


export const getUSer= catchAssyncError(async(req,res,next)=>{
    const user= req.user;
    res.status(200).json({
        success: true,
        user,
    });
});