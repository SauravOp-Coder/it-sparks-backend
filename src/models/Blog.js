import mongoose from "mongoose";

const contentSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "heading",
        "subheading",
        "paragraph",
        "bulletList",
        "numberedList",
        "highlight",
      ],
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

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    // Legacy plain-text content (kept so old blogs keep working)
    content: {
      type: String,
      default: "",
    },
    // New structured content sections
    contentSections: [contentSectionSchema],
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
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    faqs: [
      {
        question: { type: String, default: "" },
        answer: { type: String, default: "" },
      },
    ],
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;