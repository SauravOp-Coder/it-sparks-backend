import HomeContent from "../models/HomeContent.js";

export const updateHomeContent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Process recruiters text
    if (typeof updateData.recruitersText === "string") {
      updateData.recruiters = updateData.recruitersText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // Process FAQs if sent as text string
    if (typeof updateData.faqsText === "string") {
      updateData.faqs = updateData.faqsText
        .split("\n")
        .filter(Boolean)
        .map((line, idx) => {
          const [question, ...answerParts] = line.split("|");
          return {
            question: question?.trim() || "",
            answer: answerParts.join("|").trim() || "",
            order: idx,
          };
        });
    }

    // Direct object update if sending array of objects from UI state
    if (Array.isArray(req.body.faqs)) {
      updateData.faqs = req.body.faqs;
    }

    // Persist changes
    const updatedContent = await HomeContent.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: false }
    );

    return res.status(200).json({
      success: true,
      message: "Home page updated successfully",
      homeContent: updatedContent,
    });
  } catch (error) {
    console.error("Update Home Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};