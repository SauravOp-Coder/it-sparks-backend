import HomeContent from "../models/HomeContent.js";

const ensureHomeContent = async () => {
  let homeContent = await HomeContent.findOne();

  if (!homeContent) {
    homeContent = await HomeContent.create({
      hero: {
        badge: "Practical IT Training Institute",
        heading: "Build Your IT Career With Practical Training",
        subheading: "Learn job-ready skills through practical courses, real projects, expert mentorship, and career guidance.",
        buttons: [
          { text: "Explore Courses", link: "/courses", style: "primary", order: 0 },
          { text: "Book Free Demo", link: "/contact", style: "secondary", order: 1 },
        ],
      },
      popularCourses: {
        title: "Industry-focused courses to build your career",
        subtitle: "Choose from practical IT courses designed with real-world projects, interview preparation, and placement support.",
      },
      sections: [],
      faqs: [],
      cta: {
        enabled: true,
        title: "Start your IT learning journey today",
        subtitle: "Book a free demo and get course guidance from our team.",
        buttonText: "Book Free Demo",
        buttonLink: "/contact",
      },
    });
  }

  return homeContent;
};

const parseSections = (value) => {
  if (!value) return [];

  try {
    const rawSections = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(rawSections)) return [];

    return rawSections
      .map((sec, index) => ({
        sectionType: sec.sectionType || sec.type || "paragraph",
        enabled: sec.enabled !== false,
        title: sec.title || "",
        subtitle: sec.subtitle || "",
        content: sec.content || "",
        items: Array.isArray(sec.items)
          ? sec.items.filter((item) => typeof item === "string" && item.trim())
          : [],
        textCase: sec.textCase || "normal",
        layout: sec.layout || "full",
        buttons: Array.isArray(sec.buttons) ? sec.buttons : [],
        order: typeof sec.order === "number" ? sec.order : index,
      }))
      .filter((sec) => sec.title || sec.content || sec.items.length);
  } catch (error) {
    console.error("Error parsing sections:", error);
    return [];
  }
};

const parseFaqs = (value) => {
  if (!value) return [];

  try {
    const rawFaqs = typeof value === "string" ? JSON.parse(value) : value;
    if (!Array.isArray(rawFaqs)) return [];

    return rawFaqs
      .map((faq, index) => ({
        question: faq.question || "",
        answer: faq.answer || "",
        enabled: faq.enabled !== false,
        order: typeof faq.order === "number" ? faq.order : index,
      }))
      .filter((faq) => faq.question || faq.answer);
  } catch (error) {
    console.error("Error parsing FAQs:", error);
    return [];
  }
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

    // 1. Update Hero Object
    homeContent.hero = {
      ...homeContent.hero?.toObject(),
      badge: payload.heroBadge ?? homeContent.hero?.badge,
      heading: payload.heroHeading ?? homeContent.hero?.heading,
      subheading: payload.heroSubheading ?? homeContent.hero?.subheading,
      buttons: [
        {
          text: payload.primaryButtonText ?? homeContent.hero?.buttons?.[0]?.text ?? "",
          link: payload.primaryButtonLink ?? homeContent.hero?.buttons?.[0]?.link ?? "/",
          style: "primary",
          order: 0,
        },
        {
          text: payload.secondaryButtonText ?? homeContent.hero?.buttons?.[1]?.text ?? "",
          link: payload.secondaryButtonLink ?? homeContent.hero?.buttons?.[1]?.link ?? "/",
          style: "secondary",
          order: 1,
        },
      ],
    };

    // If hero image uploaded via Multer
    if (req.file) {
      homeContent.hero.image = {
        url: req.file.path,
        publicId: req.file.filename,
      };
    }

    // 2. Update Popular Courses Section Header
    homeContent.popularCourses = {
      title: payload.popularCoursesTitle ?? homeContent.popularCourses?.title,
      subtitle: payload.popularCoursesSubtitle ?? homeContent.popularCourses?.subtitle,
    };

    // 3. Update CTA Section Object
    homeContent.cta = {
      enabled: true,
      title: payload.ctaTitle ?? homeContent.cta?.title,
      subtitle: payload.ctaSubtitle ?? homeContent.cta?.subtitle,
      buttonText: payload.ctaButtonText ?? homeContent.cta?.buttonText,
      buttonLink: payload.ctaButtonLink ?? homeContent.cta?.buttonLink,
    };

    // 4. Update Arrays (Sections & FAQs)
    const incomingSections = payload.homeSections || payload.sections;
    if (incomingSections !== undefined) {
      homeContent.sections = parseSections(incomingSections);
    }

    if (payload.faqs !== undefined) {
      homeContent.faqs = parseFaqs(payload.faqs);
    }

    await homeContent.save();

    res.status(200).json({
      success: true,
      message: "Home content updated successfully",
      homeContent,
    });
  } catch (error) {
    console.error("Update Home Content Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getHomeContent, updateHomeContent };