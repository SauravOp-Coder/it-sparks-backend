import mongoose from "mongoose";
import Course from "../models/Course.js";
import { cloudinary } from "../config/cloudinary.js";
import createSlug from "../utils/createSlug.js";

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value === true || value === "true";
};

const parseSyllabus = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (error) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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

const parseDetailSections = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

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

const getUploadedFile = (req, fieldName) => {
  return req.files?.[fieldName]?.[0] || null;
};

const getCourses = async (req, res) => {
  const courses = await Course.find({ isVisible: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
};

const getAdminCourses = async (req, res) => {
  const courses = await Course.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    courses,
  });
};

const getCourseById = async (req, res) => {
  const identifier = req.params.id;

  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier, isVisible: true }
    : { slug: identifier, isVisible: true };

  const course = await Course.findOne(query);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    course,
  });
};

const createCourse = async (req, res) => {
  const {
    title,
    category,
    description,
    duration,
    mode,
    level,
    fees,
    isPopular,
    isVisible,
    syllabus,
    detailSections,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Course title is required");
  }

  const imageFile = getUploadedFile(req, "image");
  const brochureFile = getUploadedFile(req, "brochure");

  const course = await Course.create({
    title,
    slug: createSlug(title),
    category,
    description,
    duration,
    mode,
    level,
    syllabus: parseSyllabus(syllabus),
    detailSections: parseDetailSections(detailSections),
    image: imageFile
      ? {
          url: imageFile.path,
          publicId: imageFile.filename,
        }
      : undefined,
    brochure: brochureFile
      ? {
          url: brochureFile.path,
          publicId: brochureFile.filename,
          originalName: brochureFile.originalname,
        }
      : undefined,
    isPopular: parseBoolean(isPopular, false),
    isVisible: parseBoolean(isVisible, true),
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
};

const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const {
    title,
    category,
    description,
    duration,
    mode,
    level,
    isPopular,
    isVisible,
    syllabus,
    detailSections,
  } = req.body;

  if (title !== undefined) {
    course.title = title;
    course.slug = createSlug(title);
  }

  if (category !== undefined) course.category = category;
  if (description !== undefined) course.description = description;
  if (duration !== undefined) course.duration = duration;
  if (mode !== undefined) course.mode = mode;
  if (level !== undefined) course.level = level;

  if (syllabus !== undefined) {
    course.syllabus = parseSyllabus(syllabus);
  }

  if (detailSections !== undefined) {
    course.detailSections = parseDetailSections(detailSections);
  }

  if (isPopular !== undefined) {
    course.isPopular = parseBoolean(isPopular, false);
  }

  if (isVisible !== undefined) {
    course.isVisible = parseBoolean(isVisible, true);
  }

  const imageFile = getUploadedFile(req, "image");
  const brochureFile = getUploadedFile(req, "brochure");

  if (imageFile) {
    if (course.image?.publicId) {
      await cloudinary.uploader.destroy(course.image.publicId);
    }

    course.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
  }

  if (brochureFile) {
    if (course.brochure?.publicId) {
      await cloudinary.uploader.destroy(course.brochure.publicId, {
        resource_type: "raw",
      });
    }

    course.brochure = {
      url: brochureFile.path,
      publicId: brochureFile.filename,
      originalName: brochureFile.originalname,
    };
  }

  const updatedCourse = await course.save();

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course: updatedCourse,
  });
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  if (course.image?.publicId) {
    await cloudinary.uploader.destroy(course.image.publicId);
  }

  if (course.brochure?.publicId) {
    await cloudinary.uploader.destroy(course.brochure.publicId, {
      resource_type: "raw",
    });
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
};

export {
  getCourses,
  getAdminCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};