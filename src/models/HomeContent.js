import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const buttonSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    link: { type: String, default: "/" },
    style: {
      type: String,
      enum: ["primary", "secondary", "link"],
      default: "primary",
    },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const sectionSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      enum: [
        "heading",
        "paragraph",
        "bulletList",
        "numberedList",
        "highlight",
        "imageBanner",
      ],
      default: "paragraph",
    },
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    content: { type: String, default: "" },
    items: [{ type: String }],
    textCase: {
      type: String,
      enum: ["normal", "uppercase", "lowercase", "capitalize"],
      default: "normal",
    },
    layout: {
      type: String,
      enum: ["full", "split"],
      default: "full",
    },
    image: imageSchema,
    buttons: [buttonSchema],
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const heroSchema = new mongoose.Schema(
  {
    badge: { type: String, default: "Practical IT Training Institute" },
    heading: {
      type: String,
      default: "Build Your IT Career With Practical Training",
    },
    subheading: {
      type: String,
      default:
        "Learn job-ready skills through practical courses, real projects, expert mentorship, and career guidance.",
    },
    buttons: [buttonSchema],
    image: imageSchema,
  },
  { _id: false }
);

const sectionHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Industry-focused courses to build your career",
    },
    subtitle: {
      type: String,
      default:
        "Choose from practical IT courses designed with real-world projects, interview preparation, and placement support.",
    },
  },
  { _id: false }
);

const ctaSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: {
      type: String,
      default: "Start your IT learning journey today",
    },
    subtitle: {
      type: String,
      default: "Book a free demo and get course guidance from our team.",
    },
    buttonText: { type: String, default: "Book Free Demo" },
    buttonLink: { type: String, default: "/contact" },
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    hero: heroSchema,
    popularCourses: sectionHeaderSchema,
    sections: [sectionSchema],
    faqs: [faqSchema],
    cta: ctaSchema,
  },
  { timestamps: true }
);

const HomeContent = mongoose.model("HomeContent", homeContentSchema);

export default HomeContent;
