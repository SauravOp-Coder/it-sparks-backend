import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import createSlug from "../utils/createSlug.js";
import { cloudinary } from "../config/cloudinary.js";

const resolveUniqueSlug = async (desiredSlug, excludeId = null) => {
  let slug = createSlug(desiredSlug);

  const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
  const existing = await Blog.findOne(query);

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
};

const getBlogs = async (req, res) => {
  const blogs = await Blog.find({ isVisible: true }).sort({
    publishedDate: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: blogs.length,
    blogs,
  });
};

const getAdminBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: blogs.length,
    blogs,
  });
};

const getSingleBlog = async (req, res) => {
  const identifier = req.params.id;

  const query = mongoose.Types.ObjectId.isValid(identifier)
    ? { _id: identifier, isVisible: true }
    : { slug: identifier, isVisible: true };

  const blog = await Blog.findOne(query);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.status(200).json({
    success: true,
    blog,
  });
};

const createBlog = async (req, res) => {
  const {
    title,
    slug,
    category,
    shortDescription,
    content,
    publishedDate,
    isVisible,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  if (!title || !category || !shortDescription || !content) {
    res.status(400);
    throw new Error(
      "Title, category, short description, and content are required"
    );
  }

  const finalSlug = await resolveUniqueSlug(
    slug && slug.trim() ? slug : title
  );

  const blog = await Blog.create({
    title,
    slug: finalSlug,
    category,
    shortDescription,
    content,
    image: req.file
      ? {
          url: req.file.path,
          publicId: req.file.filename,
        }
      : {
          url: "",
          publicId: "",
        },
    publishedDate: publishedDate || Date.now(),
    isVisible:
      isVisible === undefined ? true : isVisible === "true" || isVisible === true,
    metaTitle: metaTitle || "",
    metaDescription: metaDescription || "",
    metaKeywords: metaKeywords || "",
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
};

const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const {
    title,
    slug,
    category,
    shortDescription,
    content,
    publishedDate,
    isVisible,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  if (title && title !== blog.title) {
    blog.title = title;
  }

  // Slug is now independently editable, same as courses
  if (slug !== undefined) {
    const desiredSlug = slug.trim() ? slug : title || blog.title;

    if (createSlug(desiredSlug) !== blog.slug) {
      blog.slug = await resolveUniqueSlug(desiredSlug, blog._id);
    }
  }

  blog.category = category ?? blog.category;
  blog.shortDescription = shortDescription ?? blog.shortDescription;
  blog.content = content ?? blog.content;
  blog.publishedDate = publishedDate ?? blog.publishedDate;

  if (metaTitle !== undefined) blog.metaTitle = metaTitle;
  if (metaDescription !== undefined) blog.metaDescription = metaDescription;
  if (metaKeywords !== undefined) blog.metaKeywords = metaKeywords;

  if (req.file) {
    if (blog.image?.publicId) {
      await cloudinary.uploader.destroy(blog.image.publicId);
    }

    blog.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  if (isVisible !== undefined) {
    blog.isVisible = isVisible === "true" || isVisible === true;
  }

  const updatedBlog = await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.image?.publicId) {
    await cloudinary.uploader.destroy(blog.image.publicId);
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};

export {
  getBlogs,
  getAdminBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};