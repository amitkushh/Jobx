import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User created Successfully",
      user,
    });
  } catch (error) {
    console.log("Error in registring user", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    // check role
    if (role !== existingUser.role) {
      return res.status(400).json({
        success: false,
        message: "Account doesn't exist with current role",
      });
    }

    const tokenData = {
      userId: existingUser._id,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const user = {
      _id: existingUser._id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      role: existingUser.role,
      profile: existingUser.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: `Welcome Back ${existingUser.fullname}`,
        user,
      });
  } catch (error) {
    console.log("Error in loggin user", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logged out user", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    //cloudnary file setup

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id; // comming from auth middleware

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    await user.save();

    user = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully",
      user,
    });
  } catch (error) {
    console.log("Error in update profile", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
