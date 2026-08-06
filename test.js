import mongoose from "mongoose";


const uri = "mongodb+srv://cafeAdmin:90281Svs%40123@cluster0.cfthevk.mongodb.net/healthiffy?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection Failed");
    console.error(err);
    process.exit(1);
  });