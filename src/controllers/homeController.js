import HomeContent from "../models/HomeContent.js";

// Helper utilities to parse pipe-delimited text strings
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

// Helper to safely parse JSON strings (useful when FormData is used for uploads)
const safeJsonParse = (data) => {
  if (!data) return null;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const getHomeContent = async (req, res) => {
  try {
    let homeContent = await HomeContent.findOne();

    if (!homeContent) {
      homeContent = await HomeContent.create({});
    }

    res.status(200).json({
      success: true,
      homeContent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateHomeContent = async (req, res) => {
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

    // 1. Update basic text fields
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        homeContent[field] = req.body[field];
      }
    });

    // 2. Parse and update dynamic Sections & FAQs array
    if (req.body.sections !== undefined) {
      const parsedSections = safeJsonParse(req.body.sections);
      if (Array.isArray(parsedSections)) {
        homeContent.sections = parsedSections;
      }
    }

    if (req.body.faqs !== undefined) {
      const parsedFaqs = safeJsonParse(req.body.faqs);
      if (Array.isArray(parsedFaqs)) {
        homeContent.faqs = parsedFaqs;
      }
    }

    // 3. Parse and update complex text fields
    if (req.body.whyChooseCardsText !== undefined) {
      homeContent.whyChooseCards = parseCardsText(req.body.whyChooseCardsText);
    }

    if (req.body.trainingStepsText !== undefined) {
      homeContent.trainingSteps = parseTrainingText(req.body.trainingStepsText);
    }

    if (req.body.placementSupportCardsText !== undefined) {
      homeContent.placementSupportCards = parseCardsText(
        req.body.placementSupportCardsText
      );
    }

    if (req.body.recruitersText !== undefined) {
      homeContent.recruiters = parseRecruitersText(req.body.recruitersText);
    }

    // Direct object updates if sent as JSON arrays directly
    if (req.body.whyChooseCards && Array.isArray(safeJsonParse(req.body.whyChooseCards))) {
      homeContent.whyChooseCards = safeJsonParse(req.body.whyChooseCards);
    }
    if (req.body.trainingSteps && Array.isArray(safeJsonParse(req.body.trainingSteps))) {
      homeContent.trainingSteps = safeJsonParse(req.body.trainingSteps);
    }
    if (req.body.placementSupportCards && Array.isArray(safeJsonParse(req.body.placementSupportCards))) {
      homeContent.placementSupportCards = safeJsonParse(req.body.placementSupportCards);
    }

    // 4. Handle image upload if present
    if (req.file) {
      homeContent.heroImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    // Force Mongoose to mark sections and faqs as modified (ensures save detects array changes)
    homeContent.markModified("sections");
    homeContent.markModified("faqs");

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

export { getHomeContent, updateHomeContent };