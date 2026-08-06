import HomeContent from "../models/HomeContent.js";

// Helper: Parse Question | Answer lines
const parseFaqsText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [question, ...answerParts] = line.split("|");
      return {
        question: question?.trim() || "",
        answer: answerParts.join("|").trim() || "",
        order: idx,
      };
    });
};

// Helper: Parse Key | Title | Enabled lines for sections
const parseSectionsText = (text) => {
  if (!text || typeof text !== "string") return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [key, title, enabled] = line.split("|");
      return {
        key: key?.trim() || `section_${idx}`,
        title: title?.trim() || "",
        enabled: enabled ? enabled.trim() === "true" : true,
        order: idx,
      };
    });
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
    console.log("--- DEBUG: RECEIVED BODY IN CONTROLLER ---");
    console.log(req.body);

    const updateData = { ...req.body };

    // 1. Process Cards & Recruiters
    if (typeof updateData.whyChooseCardsText === "string") {
      updateData.whyChooseCards = updateData.whyChooseCardsText
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [title, ...text] = line.split("|");
          return { title: title?.trim() || "", text: text.join("|").trim() || "" };
        });
    }

    if (typeof updateData.trainingStepsText === "string") {
      updateData.trainingSteps = updateData.trainingStepsText
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [number, title, ...text] = line.split("|");
          return { number: number?.trim() || "", title: title?.trim() || "", text: text.join("|").trim() || "" };
        });
    }

    if (typeof updateData.placementSupportCardsText === "string") {
      updateData.placementSupportCards = updateData.placementSupportCardsText
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [title, ...text] = line.split("|");
          return { title: title?.trim() || "", text: text.join("|").trim() || "" };
        });
    }

    if (typeof updateData.recruitersText === "string") {
      updateData.recruiters = updateData.recruitersText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // 2. Process FAQs Text
    if (typeof updateData.faqsText === "string") {
      updateData.faqs = parseFaqsText(updateData.faqsText);
    } else if (Array.isArray(updateData.faqs)) {
      updateData.faqs = updateData.faqs;
    }

    // 3. Process Sections Text
    if (typeof updateData.sectionsText === "string") {
      updateData.sections = parseSectionsText(updateData.sectionsText);
    } else if (Array.isArray(updateData.sections)) {
      updateData.sections = updateData.sections;
    }

    // Save directly with MongoDB driver bypassing strict Mongoose casting
    const updatedContent = await HomeContent.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, strict: false }
    );

    console.log("--- DEBUG: SAVED DB RESULT ---");
    console.log("FAQS:", updatedContent.faqs);
    console.log("SECTIONS:", updatedContent.sections);

    res.status(200).json({
      success: true,
      message: "Home page updated successfully",
      homeContent: updatedContent,
    });
  } catch (error) {
    console.error("Update Home Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};