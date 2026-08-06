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
    seoTitle: {
      type: String,
      default: "IT Sparks Technologies | Practical IT Training",
    },
    seoDescription: {
      type: String,
      default: "IT Sparks Technologies provides practical IT training, AI courses, software development programs, and placement support for students and professionals.",
    },
    seoKeywords: {
      type: String,
      default: "IT training, software courses, AI training, data science, cloud computing, placement support, practical learning",
    },
    seoImage: {
      type: String,
      default: "/og-image.jpg",
    },
    seoCanonicalBase: {
      type: String,
      default: "https://itsparkstechnologies.com",
    },
    siteName: {
      type: String,
      default: "IT Sparks Technologies",
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