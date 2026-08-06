import mongoose from "mongoose";

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

    // Text storage fields
    whyChooseCardsText: { type: String, default: "" },
    trainingStepsText: { type: String, default: "" },
    placementSupportCardsText: { type: String, default: "" },
    recruitersText: { type: String, default: "" },
    faqsText: { type: String, default: "" },
    sectionsText: { type: String, default: "" },

    // Parsed Array outputs
    whyChooseCards: { type: Array, default: [] },
    trainingSteps: { type: Array, default: [] },
    placementSupportCards: { type: Array, default: [] },
    recruiters: { type: Array, default: [] },
    faqs: { type: Array, default: [] },
    sections: { type: Array, default: [] },
  },
  { timestamps: true, strict: false } // strict: false stops Mongoose from dropping fields!
);

export default mongoose.model("HomeContent", homeContentSchema);