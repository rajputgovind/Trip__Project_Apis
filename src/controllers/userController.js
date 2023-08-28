import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import moment from "moment";
import Role from "../models/RoleModel.js";
import { validationResult } from "express-validator";
import errorHandler from "../middleware/validationErrorHandler.js";
import Sib from "sib-api-v3-sdk";
import Trip from "../models/TripModel.js";

// Registration Api

export const userRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

    const { name, email, phone, password, role, birthDate } = req.body;
    const isEmailMatch = await User.findOne({ email: email });

    if (isEmailMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "The email already exists." });
    }

    const hashPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      name,
      email,
      birthDate,
      phone,
      password: hashPassword,
      role,
    });

    // Code For Sending Mail

    const checkOrganizer = await Role.findById(user.role);

    if (checkOrganizer && checkOrganizer.roleName === "Organizer") {
      // console.log("organizer registration")
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = {
        email: req.body.email,
        name: `Hii ${req.body.email}`,
      };

      const receivers = [
        {
          email: "govindjadam.vkaps@gmail.com",
        },
      ];

      let emailResult = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "New Organizer Registration",
        textContent:
          "Hello Admin,\n\nA new organizer has registered. Please review their details.",
        htmlContent: `
        <div style="font-family: Arial, sans-serif;">
        <h2>New Organizer Registration</h2>
        <p>Hello Admin,</p>
        <p>A new organizer has registered. Please review their details.</p>
        <p>Organizer Information:</p>
        <ul>
          <li><strong>Name:</strong> ${req.body.name}</li>
          <li><strong>Email:</strong> ${req.body.email}</li>
          <li><strong>Role:</strong> ${checkOrganizer.roleName}</li>
        </ul>
        <p>Thank you.</p>
        <p>You can manage all organizers <a href="https://trip-planning-admin.vercel.app/organizer">here</a>.</p>
      </div>
        `,
        params: {
          role: "Frontend",
        },
      });
    }

    const userData = await user.save();
    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        message: "Registration successful!!",
        data: userData,
      });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error during user signup.",
      error: error.message,
    });
  }
};

// Login Api

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

    const email = req.body.email;
    const password = req.body.password;

    // if(!email || !password){
    //   return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Please fill all fields properly"})
    // }
    const user = await User.findOne({ email: email }).populate("role");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The user does not exist." });
    }

    const role = await Role.findById(user.role);
    const isPasswordMatch = bcryptjs.compareSync(password, user.password);
    if (isPasswordMatch) {
      const token = await user.generateAuthToken();

      if (user.isDeleted === true) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({
            success: false,
            message:
              "This user can not login. This has already been deleted by the admin",
          });
      } else if (user.isOrganizer && role.roleName === "Organizer") {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "Organizer login successful !",
          data: user,
          token: token,
        });
      } else if (user.isOrganizer === false && role.roleName === "Organizer") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            success: false,
            message: "The admin has not approved you as an organizer.",
          });
      } else if (role.roleName == "Admin") {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "Admin login successful !",
          data: user,
          token: token,
        });
      } else {
        return res.status(StatusCodes.OK).json({
          success: true,
          message: "User login successful !",
          data: user,
          token: token,
        });
      }
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: true, message: "Invalid login credentials." });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error during the user login.",
      error: error.message,
    });
  }
};

// Get All User Api

export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userId = await Role.findOne({ roleName: "User" });

    let matchOptions = {
      role: userId._id,
      isDeleted: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    };
    // if(req.query.category){
    //   matchOptions.category = req.query.category
    // }
    const users = User.aggregate([
      {
        $match: matchOptions,
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
    ]);
    const data = await User.aggregatePaginate(users, { page, limit });
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The user could not be found." });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "All users were found successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while trying to find all users.",
      error: error.message,
    });
  }
};

// Get Single User Api For Admin

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The user does not exist." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "The user find successfully", data: user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while trying to find the single user.",
      error: error.message,
    });
  }
};

// Get Single User Api

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The user does not exist" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "The user find successfully", data: user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while trying to find the single user.",
      error: error.message,
    });
  }
};

// Update User Api

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);
    if (errMessages && errMessages.length) {
      return res.status(400).json({
        success: false,
        errMessages,
      });
    }

    const userId = req.params.id;
    const updates = Object.keys(req.body);

    const user = await User.findById(req.user._id);

    if (req.body.password) {
      const hashPassword = bcryptjs.hashSync(req.body.password, 10);
      req.body["password"] = hashPassword;
    }

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `The user could not be found.`,
      });
    }
    
    if(req.file){
      const image = req.file.filename
      user.profileImage = image
    }

    const allowedUpdates = ["name", "phone", "birthDate", "password"];

    const isValidUpdates = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdates) {
      throw new Error("Invalid updates");
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Upadate successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while updating.",
      error: error.message,
    });
  }
};

// Delete User Apis

export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The user could not be found." });
    }

    user.isDeleted = true;

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Deleted successfully", data: user });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.OK).json({
      success: false,
      message: "There was an error while deleting.",
      error: error.message,
    });
  }
};

// Count Users Organizers And Trips Api

export const countAll = async (req, res) => {
  try {
    const userId = await Role.findOne({ roleName: "User" });
    const users = await User.find({
      role: userId._id,
      isDeleted: false,
    }).countDocuments();

    const organizerId = await Role.findOne({ roleName: "Organizer" });
    const organizers = await User.find({
      role: organizerId._id,
      isDeleted: false,
    }).countDocuments();

    const trips = await Trip.countDocuments();

    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Count successful",
        users: users,
        organizers: organizers,
        trips: trips,
      });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "Error while count all users",
        error: error.message,
      });
  }
};


// Forget Password Api

export const forgotPassword = async(req,res)=>{
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }


    const email = req.body.email
    const user = await User.findOne({email:email})

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User does not exist',

      })
    }
    if(user){
            const otp = Math.random().toString().substring(2, 8)
            const currentDate = new Date()
            const expire = currentDate.setMinutes(currentDate.getMinutes() + 5)
      
            user.otp = {
              value: otp,
              expire,
            }
    

    // Mail code

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: process.env.FORGET_PASSWORD_EMAIL,
      name: `Hii ${process.env.FORGET_PASSWORD_EMAIL}`,
    };

    const receivers = [
      {
        email: req.body.email,
      },
    ];

    let emailResult = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password Reset",
      textContent: "Dear User, Reset your password",
      htmlContent: `
      <div style="font-family: Arial, sans-serif;">
      <h2>Password Reset </h2>
      <p>Dear User,</p>
      <p>To reset your password, click on the following link:</p>
      <p><a href="http://localhost:5000/api/users/reset-password">Reset Password</a></p>
      <p>Your OTP <strong>${otp}</strong> valid for 5 minutes</p>
      <p>Best regards,<br>Thank-you</p>
    </div>
      `,
      params: {
        role: "Frontend",
      },
    });
    await user.save()
    return res.status(StatusCodes.OK).json({success:true, message:"Please check your email and reset your password"})
  }
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Error while forget password"})
  }
}


    
  

// Reset Password

export const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }


    const { email, otp, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, error: 'User does not found' })
    }
    if (user.otp.value !== otp) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, error: 'Incorrect OTP' })
    }
    if (user.otp.expire < new Date()) {
      user.otp = undefined
      await user.save()
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, error: 'OTP expired' })
    }
    const newPasswordMatch = await bcryptjs.compare(password, user.password)
    if (newPasswordMatch) {
      throw new Error(
        'Current password and new Password cannot be same'
       
      )
    }
   
    const hashPassword = bcryptjs.hashSync(password, 10);

    user.password = hashPassword
    user.otp = undefined
    await user.save()
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Password changed",
        
      });
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Error while reset password" ,error:error.message});
  }
};

