import HomeContent from "../models/HomeContent.js";

// Helper function to decode standard JSON or Base64 JSON
const forceParseArray = (input) => {
  if (!input) return null;
  if (Array.isArray(input)) return input;
  
  try {
    // Try normal JSON parse
    return JSON.parse(input);
  } catch (err) {
    try {
      // Try Base64 decode + JSON parse
      const decoded = Buffer.from(input, "base64").toString("utf-8");
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to force parse array field:", e);
      return null;
    }
  }
};

const parseCardsText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...textParts] = line.split("|");
      return { title: title?.trim() || "", text: textParts.join("|").trim() || "" };
    });
};

const parseTrainingText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [number, title, ...textParts] = line.split("|");
      return { number: number?.trim() || "", title: title?.trim() || "", text: textParts.join("|").trim() || "" };
    });
};

const parseRecruitersText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text.split(",").map((item) => item.trim()).filter(Boolean);
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

    // Standard Text Fields
    const fields = [
      "heroBadge", "heroHeading", "heroSubheading", "primaryButtonText",
      "primaryButtonLink", "secondaryButtonText", "secondaryButtonLink",
      "popularCoursesTitle", "popularCoursesSubtitle", "whyChooseTitle",
      "whyChooseSubtitle", "trainingTitle", "trainingSubtitle",
      "placementTitle", "placementSubtitle", "recruiterTitle",
      "recruiterSubtitle", "ctaTitle", "ctaSubtitle", "ctaButtonText",
      "ctaButtonLink", "faqTitle", "faqSubtitle"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        homeContent[field] = req.body[field];
      }
    });

    // Parsed Card Inputs
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

    // FORCE PROCESS SECTIONS ARRAY
    if (req.body.sections !== undefined) {
      const parsedSections = forceParseArray(req.body.sections);
      if (parsedSections && Array.isArray(parsedSections)) {
        homeContent.sections = parsedSections;
        homeContent.markModified("sections");
      }
    }

    // FORCE PROCESS FAQS ARRAY
    if (req.body.faqs !== undefined) {
      const parsedFaqs = forceParseArray(req.body.faqs);
      if (parsedFaqs && Array.isArray(parsedFaqs)) {
        homeContent.faqs = parsedFaqs;
        homeContent.markModified("faqs");
      }
    }

    // Hero Image Handling
    if (req.file) {
      homeContent.heroImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
      homeContent.markModified("heroImage");
    }

    const saved = await homeContent.save();

    res.status(200).json({
      success: true,
      message: "Home content saved and updated successfully",
      homeContent: saved,
    });
  } catch (error) {
    console.error("Error updating home content:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};