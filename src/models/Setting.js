import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      default: "+91 99999 99999",
    },
    facebookLink: { type: String, default: "" },
instagramLink: { type: String, default: "" },
linkedinLink: { type: String, default: "" },
youtubeLink: { type: String, default: "" },
    whatsapp: {
      type: String,
      default: "+91 99999 99999",
    },
    email: {
      type: String,
      default: "info@itsparkstechnologies.com",
    },
    address: {
      type: String,
      default: "Pune, Maharashtra, India",
    },
    googleMapLink: {
      type: String,
      default: "",
    },
    googleReviewReadLink: {
      type: String,
      default: "",
    },
    googleReviewWriteLink: {
      type: String,
      default: "",
    },
    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      youtube: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;