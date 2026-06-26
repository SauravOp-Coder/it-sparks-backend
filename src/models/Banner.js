import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      enum: [
        "home",
        "about",
        "courses",
        "courseDetail",
        "placements",
        "gallery",
        "blog",
        "contact",
      ],
    },

    type: {
      type: String,
      enum: ["slider", "page"],
      default: "page",
    },

    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
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

    order: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;