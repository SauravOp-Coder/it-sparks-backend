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

const normalizeSectionType = (type) => {
  const value = String(type || "").toLowerCase();

  if (value === "heading") return "heading";
  if (value === "paragraph") return "paragraph";
  if (value === "list") return "bulletList";
  if (value === "bulletlist") return "bulletList";
  if (value === "bullet") return "bulletList";
  if (value === "numberedlist") return "numberedList";
  if (value === "numbered") return "numberedList";
  if (value === "highlight") return "highlight";

  return "paragraph";
};

const parseHomeSections = (value) => {
  if (!value) return [];

  try {
    const parsed = Array.isArray(value) ? value : JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((section, index) => {
        const type = normalizeSectionType(section.type);

        return {
          type,
          title: section.title || "",
          content: section.content || "",
          items: Array.isArray(section.items)
            ? section.items.filter(Boolean)
            : section.itemsText
            ? section.itemsText
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
          textCase: section.textCase || "normal",
          layout: section.layout || "full",
          order: index,
        };
      })
      .filter((section) => {
        if (section.type === "bulletList" || section.type === "numberedList") {
          return section.items.length > 0;
        }

        return section.title || section.content;
      });
  } catch (error) {
    return [];
  }
};

const parseFaqs = (value) => {
  if (!value) return [];

  const parseArrayLike = (input) => {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object") return Object.values(input);
    return [];
  };

  const readFirstValue = (item, keys) => {
    for (const key of keys) {
      const candidate = item?.[key];
      if (candidate !== undefined && candidate !== null && candidate !== "") {
        return String(candidate).trim();
      }
    }
    return "";
  };

  const parseFaqItem = (item) => {
    if (!item) return { question: "", answer: "" };

    if (typeof item === "string") {
      const [question, ...answerParts] = item.split("|");
      return {
        question: question ? question.trim() : "",
        answer: answerParts.length ? answerParts.join("|").trim() : "",
      };
    }

    if (Array.isArray(item)) {
      return {
        question: item[0] ? String(item[0]).trim() : "",
        answer: item[1] ? String(item[1]).trim() : "",
      };
    }

    if (typeof item === "object") {
      const question = readFirstValue(item, [
        "question",
        "faqQuestion",
        "questionText",
        "title",
        "faq",
      ]);
      const answer = readFirstValue(item, [
        "answer",
        "faqAnswer",
        "answerText",
        "description",
        "content",
        "details",
      ]);

      return {
        question,
        answer,
      };
    }

    return {
      question: "",
      answer: "",
    };
  };

  const parseAsText = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map(parseFaqItem);
  };

  let parsed = value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") {
      return [];
    }

    try {
      parsed = JSON.parse(value);
    } catch (error) {
      parsed = parseAsText(value);
    }
  }

  parsed = parseArrayLike(parsed);

  return parsed
    .map((faq, index) => ({
      ...parseFaqItem(faq),
      order: index,
    }))
    .filter((faq) => faq.question || faq.answer);
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

  if (req.body.homeSections !== undefined) {
    homeContent.homeSections = parseHomeSections(req.body.homeSections);
  }

  if (req.body.faqs !== undefined) {
    homeContent.faqs = parseFaqs(req.body.faqs);
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

export { getHomeContent, updateHomeContent, parseFaqs };