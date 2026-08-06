import HomeContent from "../models/HomeContent.js";

const ensureHomeContent = async () => {
  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = await HomeContent.create({
      heroBadge: "",
      heroHeading: "",
      heroSubheading: "",
      primaryButtonText: "Explore Courses",
      primaryButtonLink: "/courses",
      secondaryButtonText: "Book Free Demo",
      secondaryButtonLink: "/contact",
      homeSections: [],
      faqs: [],
      ctaTitle: "",
      ctaSubtitle: "",
      ctaButtonText: "",
      ctaButtonLink: "",
      recruiters: [],
    });
  }

  return homeContent;
};

const parseSections = (value) => {
  if (!value) return [];

  try {
    const sections = typeof value === "string" ? JSON.parse(value) : value;

    if (!Array.isArray(sections)) return [];

    return sections
      .map((section, index) => ({
        type: section.type || section.sectionType || "paragraph",
        title: section.title || "",
        content: section.content || "",
        items: Array.isArray(section.items)
          ? section.items.filter((item) => typeof item === "string" && item.trim())
          : [],
        textCase: section.textCase || "normal",
        layout: section.layout || "full",
        order: typeof section.order === "number" ? section.order : index,
      }))
      .filter((section) => section.title || section.content || section.items.length);
  } catch (error) {
    console.error("Error parsing sections:", error);
    return [];
  }
};

const parseFaqs = (value) => {
  if (!value) return [];

  try {
    const faqs = typeof value === "string" ? JSON.parse(value) : value;

    if (!Array.isArray(faqs)) return [];

    return faqs
      .map((faq, index) => ({
        question: faq.question || "",
        answer: faq.answer || "",
        order: typeof faq.order === "number" ? faq.order : index,
      }))
      .filter((faq) => faq.question || faq.answer);
  } catch (error) {
    console.error("Error parsing FAQs:", error);
    return [];
  }
};

const parseRecruiters = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const getHomeContent = async (req, res) => {
  try {
    const homeContent = await ensureHomeContent();
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
    const homeContent = await ensureHomeContent();
    const payload = req.body || {};

    // 1. Scalar Fields
    homeContent.heroBadge = payload.heroBadge ?? homeContent.heroBadge;
    homeContent.heroHeading = payload.heroHeading ?? homeContent.heroHeading;
    homeContent.heroSubheading = payload.heroSubheading ?? homeContent.heroSubheading;
    homeContent.primaryButtonText = payload.primaryButtonText ?? homeContent.primaryButtonText;
    homeContent.primaryButtonLink = payload.primaryButtonLink ?? homeContent.primaryButtonLink;
    homeContent.secondaryButtonText = payload.secondaryButtonText ?? homeContent.secondaryButtonText;
    homeContent.secondaryButtonLink = payload.secondaryButtonLink ?? homeContent.secondaryButtonLink;

    homeContent.popularCoursesTitle = payload.popularCoursesTitle ?? homeContent.popularCoursesTitle;
    homeContent.popularCoursesSubtitle = payload.popularCoursesSubtitle ?? homeContent.popularCoursesSubtitle;

    homeContent.ctaTitle = payload.ctaTitle ?? homeContent.ctaTitle;
    homeContent.ctaSubtitle = payload.ctaSubtitle ?? homeContent.ctaSubtitle;
    homeContent.ctaButtonText = payload.ctaButtonText ?? homeContent.ctaButtonText;
    homeContent.ctaButtonLink = payload.ctaButtonLink ?? homeContent.ctaButtonLink;

    // 2. Parsed Arrays
    if (payload.homeSections !== undefined || payload.sections !== undefined) {
      homeContent.homeSections = parseSections(payload.homeSections || payload.sections);
    }

    if (payload.faqs !== undefined) {
      homeContent.faqs = parseFaqs(payload.faqs);
    }

    if (payload.recruitersText !== undefined || payload.recruiters !== undefined) {
      homeContent.recruiters = parseRecruiters(payload.recruitersText || payload.recruiters);
    }

    // 3. Image Upload Handling via Multer
    if (req.file) {
      homeContent.heroImage = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    await homeContent.save();

    res.status(200).json({
      success: true,
      message: "Home content updated successfully",
      homeContent,
    });
  } catch (error) {
    console.error("Update Home Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getHomeContent, updateHomeContent };