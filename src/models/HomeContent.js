const mongoose = require("mongoose");

const homeContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: "" },
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      primaryButtonText: { type: String, default: "" },
      primaryButtonLink: { type: String, default: "" },
      secondaryButtonText: { type: String, default: "" },
      secondaryButtonLink: { type: String, default: "" },
      imageUrl: { type: String, default: "" },
      imagePublicId: { type: String, default: "" },
    },
    titles: {
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
    },
    whyChooseCards: [
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
        icon: { type: String, default: "" },
      },
    ],
    trainingSteps: [
      {
        number: { type: String, required: true },
        title: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    placementSupportCards: [
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
        icon: { type: String, default: "" },
      },
    ],
    recruiters: [{ type: String }],
    customSections: [
      {
        title: { type: String, default: "" },
        type: {
          type: String,
          enum: ["heading", "paragraph", "bulletList", "numberedList", "highlight"],
          default: "paragraph",
        },
        content: { type: String, default: "" },
        items: [{ type: String }],
        layout: { type: String, enum: ["full", "split"], default: "full" },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    cta: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      buttonText: { type: String, default: "" },
      buttonLink: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);