import HomeContent from "../models/HomeContent.js";

// Parser for FAQs (Format per line: Question | Answer)
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
    const updateData = { ...req.body };

    // Parse cards, recruiters, and steps
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

    // CONVERT FAQS TEXT TO ARRAY (Exact same method as cards)
    if (typeof updateData.faqsText === "string") {
      updateData.faqs = parseFaqsText(updateData.faqsText);
    }

    const updatedContent = await HomeContent.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: false }
    );

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