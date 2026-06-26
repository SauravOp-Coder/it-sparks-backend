import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

const getAdminProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

export { loginAdmin, getAdminProfile };