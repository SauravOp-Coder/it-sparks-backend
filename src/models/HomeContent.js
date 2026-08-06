import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, default: "" },
  answer: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const sectionSchema = new mongoose.Schema({
  key: { type: String, required: true },
  title: { type: String, default: "" },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const homeContentSchema = new mongoose.Schema(
  {
    heroBadge: { type: String, default: "" },
    heroHeading: { type: String, default: "" },
    heroSubheading: { type: String, default: "" },
    primaryButtonText: { type: String, default: "" },
    primaryButtonLink: { type: String, default: "" },
    secondaryButtonText: { type: String, default: "" },
    secondaryButtonLink: { type: String, default: "" },
    popularCoursesTitle: { type: String, default: "" },
    popularCoursesSubtitle: { type: String, default: "" },
    whyChooseTitle: { type: String, default: "" },
    whyChooseSubtitle: { type: String, default: "" },
    trainingTitle: { type: String, default: "" },
    trainingSubtitle: { type: String, default: "" },
    placementTitle: { type: String, default: "" },
    placementSubtitle: { type: String, default: "" },
    recruiterTitle: { type: String, default: "" },
    recruiterSubtitle: { type: String, default: "" },
    ctaTitle: { type: String, default: "" },
    ctaSubtitle: { type: String, default: "" },
    ctaButtonText: { type: String, default: "" },
    ctaButtonLink: { type: String, default: "" },
    faqTitle: { type: String, default: "" },
    faqSubtitle: { type: String, default: "" },

    whyChooseCards: { type: Array, default: [] },
    trainingSteps: { type: Array, default: [] },
    placementSupportCards: { type: Array, default: [] },
    recruiters: { type: Array, default: [] },

    heroImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    sections: [sectionSchema],
    faqs: [faqSchema],
  },
  { timestamps: true }
);

export default mongoose.model("HomeContent", homeContentSchema);