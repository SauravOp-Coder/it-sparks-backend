import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@itsparks.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "IT Sparks Admin",
      email: adminEmail,
      password: adminPassword,
    });

    console.log("Admin created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit();
  } catch (error) {
    console.error(`Admin seed error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();