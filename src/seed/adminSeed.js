import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@itsparks.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD is not set in .env");
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Update existing admin password
      existingAdmin.password = adminPassword;
      await existingAdmin.save();

      console.log("=================================");
      console.log("Admin password updated successfully");
      console.log(`Email: ${adminEmail}`);
      console.log("=================================");

      process.exit(0);
    }

    // Create new admin if one doesn't exist
    await Admin.create({
      name: "IT Sparks Admin",
      email: adminEmail,
      password: adminPassword,
    });

    console.log("=================================");
    console.log("Admin created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log("=================================");

    process.exit(0);
  } catch (error) {
    console.error(`Admin seed error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();