// controllers/homeController.js
import HomeContent from "../models/HomeContent.js";

const parseCardsText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [title, ...textParts] = line.split("|");
      return {
        title: title ? title.trim() : "",
        text: textParts.length ? textParts.join("|").trim() : "",
      };
    });
};

const parseTrainingText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [number, title, ...textParts] = line.split("|");
      return {
        number: number ? number.trim() : "",
        title: title ? title.trim() : "",
        text: textParts.length ? textParts.join("|").trim() : "",
      };
    });
};

const parseRecruitersText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const safeJsonParse = (data) => {
  if (!data) return null;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

export const getHomeContent = async (req, res) => {
  try {
    let homeContent = await HomeContent.findOne();
    if (!homeContent) {
      homeContent = await HomeContent.create({});
    }
    res.status(200).json({ success: true, homeContent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomeContent = async (req, res) => {
  try {
    let homeContent = await HomeContent.findOne();
    if (!homeContent) {
      homeContent = await HomeContent.create({});
    }

    const fields = [
      "heroBadge",
      "heroHeading",
      "heroSubheading",
      "primaryButtonText",
      "primaryButtonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
      "popularCoursesTitle",
      "popularCoursesSubtitle",
      "whyChooseTitle",
      "whyChooseSubtitle",
      "trainingTitle",
      "trainingSubtitle",
      "placementTitle",
      "placementSubtitle",
      "recruiterTitle",
      "recruiterSubtitle",
      "ctaTitle",
      "ctaSubtitle",
      "ctaButtonText",
      "ctaButtonLink",
      "faqTitle",
      "faqSubtitle",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        homeContent[field] = req.body[field];
      }
    });

    // Parse array objects passed via FormData
    if (req.body.sections !== undefined) {
      const parsedSections = safeJsonParse(req.body.sections);
      if (Array.isArray(parsedSections)) {
        homeContent.sections = parsedSections;
        homeContent.markModified("sections");
      }
    }

    if (req.body.faqs !== undefined) {
      const parsedFaqs = safeJsonParse(req.body.faqs);
      if (Array.isArray(parsedFaqs)) {
        homeContent.faqs = parsedFaqs;
        homeContent.markModified("faqs");
      }
    }

    if (req.body.whyChooseCardsText !== undefined) {
      homeContent.whyChooseCards = parseCardsText(req.body.whyChooseCardsText);
      homeContent.markModified("whyChooseCards");
    }

    if (req.body.trainingStepsText !== undefined) {
      homeContent.trainingSteps = parseTrainingText(req.body.trainingStepsText);
      homeContent.markModified("trainingSteps");
    }

    if (req.body.placementSupportCardsText !== undefined) {
      homeContent.placementSupportCards = parseCardsText(req.body.placementSupportCardsText);
      homeContent.markModified("placementSupportCards");
    }

    if (req.body.recruitersText !== undefined) {
      homeContent.recruiters = parseRecruitersText(req.body.recruitersText);
      homeContent.markModified("recruiters");
    }

    if (req.file) {
      homeContent.heroImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    const updatedHomeContent = await homeContent.save();

    res.status(200).json({
      success: true,
      message: "Home content updated successfully",
      homeContent: updatedHomeContent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};