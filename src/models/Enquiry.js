import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    interestedCourse: {
      type: String,
      default: "",
    },
    preferredMode: {
      type: String,
      enum: ["Online", "Offline", "Not Selected"],
      default: "Not Selected",
    },
    message: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["Contact Form", "Course Enquiry", "Popup Form"],
      default: "Contact Form",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;