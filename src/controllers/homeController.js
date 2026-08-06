import HomeContent from "../models/HomeContent.js";

const ensureHomeContent = async () => {
  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = await HomeContent.create({
      hero: {
        buttons: [
          { text: "Explore Courses", link: "/courses", style: "primary", order: 0 },
          { text: "Book Free Demo", link: "/contact", style: "secondary", order: 1 },
        ],
      },
      popularCourses: {},
      cta: {},
    });
  }

  return homeContent;
};

const parseButtons = (value) => {
  if (!value) return [];

  try {
    const buttons = Array.isArray(value) ? value : JSON.parse(value);
    return buttons
      .filter((button) => button && button.text)
      .map((button, index) => ({
        text: button.text || "",
        link: button.link || "/",
        style: button.style || "primary",
        order: typeof button.order === "number" ? button.order : index,
      }));
  } catch (error) {
    return [];
  }
};

const parseSections = (value) => {
  if (!value) return [];

  try {
    const sections = Array.isArray(value) ? value : JSON.parse(value);

    if (!Array.isArray(sections)) return [];

    return sections
      .map((section, index) => ({
        sectionType: section.sectionType || section.type || "paragraph",
        enabled: section.enabled !== false,
        title: section.title || "",
        subtitle: section.subtitle || "",
        content: section.content || "",
        items: Array.isArray(section.items)
          ? section.items.filter((item) => typeof item === "string" && item.trim())
          : [],
        textCase: section.textCase || "normal",
        layout: section.layout || "full",
        image: section.image || null,
        buttons: parseButtons(section.buttons),
        order: typeof section.order === "number" ? section.order : index,
      }))
      .filter((section) => section.title || section.content || section.items.length || section.image?.url);
  } catch (error) {
    return [];
  }
};

const parseFaqs = (value) => {
  if (!value) return [];

  try {
    const faqs = Array.isArray(value) ? value : JSON.parse(value);

    if (!Array.isArray(faqs)) return [];

    return faqs
      .map((faq, index) => ({
        question: faq.question || faq.faqQuestion || faq.questionText || "",
        answer: faq.answer || faq.faqAnswer || faq.answerText || "",
        enabled: faq.enabled !== false,
        order: typeof faq.order === "number" ? faq.order : index,
      }))
      .filter((faq) => faq.question || faq.answer);
  } catch (error) {
    return [];
  }
};

const getHomeContent = async (req, res) => {
  const homeContent = await ensureHomeContent();

  res.status(200).json({
    success: true,
    homeContent,
  });
};

const updateHomeContent = async (req, res) => {
  const homeContent = await ensureHomeContent();

  const payload = req.body || {};

  if (payload.hero) {
    homeContent.hero.badge = payload.hero.badge || homeContent.hero.badge;
    homeContent.hero.heading = payload.hero.heading || homeContent.hero.heading;
    homeContent.hero.subheading = payload.hero.subheading || homeContent.hero.subheading;
    homeContent.hero.buttons = parseButtons(payload.hero.buttons || homeContent.hero.buttons);
  }

  if (payload.popularCourses) {
    homeContent.popularCourses.title = payload.popularCourses.title || homeContent.popularCourses.title;
    homeContent.popularCourses.subtitle = payload.popularCourses.subtitle || homeContent.popularCourses.subtitle;
  }

  if (payload.sections !== undefined) {
    homeContent.sections = parseSections(payload.sections);
  }

  if (payload.faqs !== undefined) {
    homeContent.faqs = parseFaqs(payload.faqs);
  }

  if (payload.cta) {
    homeContent.cta.enabled = payload.cta.enabled !== undefined ? payload.cta.enabled : homeContent.cta.enabled;
    homeContent.cta.title = payload.cta.title || homeContent.cta.title;
    homeContent.cta.subtitle = payload.cta.subtitle || homeContent.cta.subtitle;
    homeContent.cta.buttonText = payload.cta.buttonText || homeContent.cta.buttonText;
    homeContent.cta.buttonLink = payload.cta.buttonLink || homeContent.cta.buttonLink;
  }

  if (req.file) {
    homeContent.hero.image = {
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
};

export { getHomeContent, updateHomeContent }; 
