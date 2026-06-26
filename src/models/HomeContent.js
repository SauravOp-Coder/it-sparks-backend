import mongoose from "mongoose";

const homeContentSchema = new mongoose.Schema(
  {
    heroBadge: { type: String, default: "Practical IT Training Institute" },
    heroHeading: {
      type: String,
      default: "Build Your IT Career With Practical Training",
    },
    heroSubheading: {
      type: String,
      default:
        "Learn job-ready skills through practical courses, real projects, expert mentorship, and career guidance.",
    },
    primaryButtonText: { type: String, default: "Explore Courses" },
    primaryButtonLink: { type: String, default: "/courses" },
    secondaryButtonText: { type: String, default: "Book Free Demo" },
    secondaryButtonLink: { type: String, default: "/contact" },

    heroImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    popularCoursesTitle: {
      type: String,
      default: "Industry-focused courses to build your career",
    },
    popularCoursesSubtitle: {
      type: String,
      default:
        "Choose from practical IT courses designed with real-world projects, interview preparation, and career support.",
    },

    whyChooseTitle: {
      type: String,
      default: "Why students choose IT Sparks Technologies",
    },
    whyChooseSubtitle: {
      type: String,
      default:
        "We focus on practical learning, real-world projects, career guidance, and continuous support for students.",
    },
    whyChooseCards: [
      {
        title: { type: String, default: "" },
        text: { type: String, default: "" },
      },
    ],

    trainingTitle: {
      type: String,
      default: "Our practical training process",
    },
    trainingSubtitle: {
      type: String,
      default:
        "Our process is designed to help students learn step by step and become confident with real project work.",
    },
    trainingSteps: [
      {
        number: { type: String, default: "" },
        title: { type: String, default: "" },
        text: { type: String, default: "" },
      },
    ],

    placementTitle: {
      type: String,
      default: "Placement-focused training and career support",
    },
    placementSubtitle: {
      type: String,
      default:
        "Our training approach focuses on skills, project practice, resume preparation, interview confidence, and career guidance.",
    },
    placementSupportCards: [
      {
        title: { type: String, default: "" },
        text: { type: String, default: "" },
      },
    ],

    recruiterTitle: {
      type: String,
      default: "Companies our students prepare for",
    },
    recruiterSubtitle: {
      type: String,
      default:
        "We help students build skills required for interviews, internships, and job opportunities in IT companies.",
    },
    recruiters: [{ type: String }],

    ctaTitle: { type: String, default: "Start your IT learning journey today" },
    ctaSubtitle: {
      type: String,
      default: "Book a free demo and get course guidance from our team.",
    },
    ctaButtonText: { type: String, default: "Book Free Demo" },
    ctaButtonLink: { type: String, default: "/contact" },
  },
  { timestamps: true }
);

const HomeContent = mongoose.model("HomeContent", homeContentSchema);

export default HomeContent;