const HomeContent = require("../models/HomeContent");

// Get Home Content
exports.getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = await HomeContent.create({});
    }
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Home Content
exports.updateHomeContent = async (req, res) => {
  try {
    const payload = req.body;

    // Parse JSON strings if payload comes via FormData
    const parsedData = {
      hero: typeof payload.hero === "string" ? JSON.parse(payload.hero) : payload.hero,
      titles: typeof payload.titles === "string" ? JSON.parse(payload.titles) : payload.titles,
      whyChooseCards: typeof payload.whyChooseCards === "string" ? JSON.parse(payload.whyChooseCards) : payload.whyChooseCards,
      trainingSteps: typeof payload.trainingSteps === "string" ? JSON.parse(payload.trainingSteps) : payload.trainingSteps,
      placementSupportCards: typeof payload.placementSupportCards === "string" ? JSON.parse(payload.placementSupportCards) : payload.placementSupportCards,
      recruiters: typeof payload.recruiters === "string" ? JSON.parse(payload.recruiters) : payload.recruiters,
      customSections: typeof payload.customSections === "string" ? JSON.parse(payload.customSections) : payload.customSections,
      faqs: typeof payload.faqs === "string" ? JSON.parse(payload.faqs) : payload.faqs,
      cta: typeof payload.cta === "string" ? JSON.parse(payload.cta) : payload.cta,
    };

    // If image file uploaded (Multer/Cloudinary)
    if (req.file) {
      parsedData.hero = {
        ...parsedData.hero,
        imageUrl: req.file.path || req.file.secure_url,
      };
    }

    const updatedContent = await HomeContent.findOneAndUpdate({}, parsedData, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: updatedContent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};