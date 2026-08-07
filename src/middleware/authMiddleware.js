import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const protectAdmin = async (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("Received Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded:", decoded);

      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        res.status(401);
        throw new Error("Admin not found");
      }

      return next();
    } catch (error) {
      console.error("JWT Verify Error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token");
};

export { protectAdmin };