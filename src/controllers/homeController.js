import HomeContent from "../models/HomeContent.js";

/*
|--------------------------------------------------------------------------
| Get Existing Home Document
|--------------------------------------------------------------------------
*/

const getOrCreateHomeContent = async () => {
  let home = await HomeContent.findOne();

  if (!home) {
    home = await HomeContent.create({
      popularCoursesTitle:
        "Industry-focused courses to build your career",

      popularCoursesSubtitle:
        "Choose from practical IT courses designed with real-world projects, interview preparation, and placement support.",

      homeSections: [],

      faqs: [],

      courseFaqs: [],

      ctaTitle: "Start Your IT Career Today",

      ctaSubtitle:
        "Book a free demo session and start learning with industry experts.",

      ctaButtonText: "Book Free Demo",

      ctaButtonLink: "/contact",
    });
  }

  return home;
};

/*
|--------------------------------------------------------------------------
| Parse Home Sections
|--------------------------------------------------------------------------
*/

const parseSections = (sections = []) => {
  if (typeof sections === "string") {
    sections = JSON.parse(sections);
  }

  if (!Array.isArray(sections)) return [];

  return sections.map((section, index) => ({
    type: section.type || "paragraph",

    title: section.title || "",

    content: section.content || "",

    items: Array.isArray(section.items)
      ? section.items.filter((item) => item.trim())
      : [],

    layout: section.layout || "full",

    textCase: section.textCase || "normal",

    order: index,
  }));
};

/*
|--------------------------------------------------------------------------
| Parse FAQs
|--------------------------------------------------------------------------
*/

const parseFaqs = (faqs = []) => {
  if (typeof faqs === "string") {
    faqs = JSON.parse(faqs);
  }

  if (!Array.isArray(faqs)) return [];

  return faqs.map((faq, index) => ({
    question: faq.question || "",

    answer: faq.answer || "",

    order: index,
  }));
};

/*
|--------------------------------------------------------------------------
| GET HOME CONTENT
|--------------------------------------------------------------------------
*/

export const getHomeContent = async (req, res) => {
  try {
    const home = await getOrCreateHomeContent();

    res.status(200).json({
      success: true,
      homeContent: home,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE HOME CONTENT
|--------------------------------------------------------------------------
*/

export const updateHomeContent = async (req, res) => {
  try {
    const home = await getOrCreateHomeContent();

    const body = req.body;

    home.popularCoursesTitle =
      body.popularCoursesTitle ?? "";

    home.popularCoursesSubtitle =
      body.popularCoursesSubtitle ?? "";

    home.homeSections = parseSections(
      body.homeSections
    );

    home.faqs = parseFaqs(
      body.faqs
    );

    home.courseFaqs = parseFaqs(
      body.courseFaqs
    );

    home.ctaTitle =
      body.ctaTitle ?? "";

    home.ctaSubtitle =
      body.ctaSubtitle ?? "";

    home.ctaButtonText =
      body.ctaButtonText ?? "";

    home.ctaButtonLink =
      body.ctaButtonLink ?? "";

    await home.save();

    res.status(200).json({
      success: true,
      message: "Home content updated successfully.",
      homeContent: home,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};