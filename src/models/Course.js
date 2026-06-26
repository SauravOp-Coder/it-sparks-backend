import mongoose from "mongoose";

const detailSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph", "bulletList", "numberedList", "highlight"],
      default: "paragraph",
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    items: [
      {
        type: String,
      },
    ],
    textCase: {
      type: String,
      enum: ["normal", "uppercase", "lowercase", "capitalize"],
      default: "normal",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
    },

    category: {
      type: String,
      default: "Programming",
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    mode: {
      type: String,
      default: "Online / Offline",
    },

    level: {
      type: String,
      default: "Beginner to Advanced",
    },

    syllabus: [
      {
        type: String,
      },
    ],

    detailSections: [detailSectionSchema],

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

    brochure: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
      originalName: {
        type: String,
        default: "",
      },
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;