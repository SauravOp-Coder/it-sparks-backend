import HomeContent from "../models/HomeContent.js";

// Helper utilities to parse the incoming text strings back into database-ready structures
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

const getHomeContent = async (req, res) => {
  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = await HomeContent.create({});
  }

  res.status(200).json({
    success: true,
    homeContent,
  });
};

const updateHomeContent = async (req, res) => {
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
  ];

  // 1. Update basic text fields
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      homeContent[field] = req.body[field];
    }
  });

  // 2. Parse and update complex array/object fields from text inputs
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

  // 3. Handle image upload if present
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
};

export { getHomeContent, updateHomeContent };