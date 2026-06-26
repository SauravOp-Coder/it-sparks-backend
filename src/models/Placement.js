import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "",
    },
    package: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.model("Placement", placementSchema);

export default Placement;