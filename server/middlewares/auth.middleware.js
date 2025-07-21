import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Authentication error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isAuthenticated;
