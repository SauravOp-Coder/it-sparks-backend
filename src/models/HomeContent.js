import mongoose from "mongoose";

const homeSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "heading",
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
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    items: {
      type: [String],
      default: [],
    },

    layout: {
      type: String,
      enum: ["full", "split"],
      default: "full",
    },

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
  {
    _id: true,
  }
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      default: "",
      trim: true,
    },

    answer: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const homeContentSchema = new mongoose.Schema(
  {
    // Popular Courses
    popularCoursesTitle: {
      type: String,
      default: "",
    },

    popularCoursesSubtitle: {
      type: String,
      default: "",
    },

    // PDF Style Content
    homeSections: {
      type: [homeSectionSchema],
      default: [],
    },

    // FAQs (Homepage)
    faqs: {
      type: [faqSchema],
      default: [],
    },

    // FAQs (Courses Page)
    courseFaqs: {
      type: [faqSchema],
      default: [],
    },

    // CTA
    ctaTitle: {
      type: String,
      default: "",
    },

    ctaSubtitle: {
      type: String,
      default: "",
    },

    ctaButtonText: {
      type: String,
      default: "",
    },

    ctaButtonLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HomeContent", homeContentSchema);