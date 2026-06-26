import Blog from "../models/Blog.js";
import createSlug from "../utils/createSlug.js";
import { cloudinary } from "../config/cloudinary.js";

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
  const blog = await Blog.findById(req.params.id);

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
    category,
    shortDescription,
    content,
    publishedDate,
    isVisible,
  } = req.body;

  if (!title || !category || !shortDescription || !content) {
    res.status(400);
    throw new Error(
      "Title, category, short description, and content are required"
    );
  }

  let slug = createSlug(title);

  const existingBlog = await Blog.findOne({ slug });

  if (existingBlog) {
    slug = `${slug}-${Date.now()}`;
  }

  const blog = await Blog.create({
    title,
    slug,
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
    category,
    shortDescription,
    content,
    publishedDate,
    isVisible,
  } = req.body;

  if (title && title !== blog.title) {
    blog.title = title;
    blog.slug = createSlug(title);
  }

  blog.category = category ?? blog.category;
  blog.shortDescription = shortDescription ?? blog.shortDescription;
  blog.content = content ?? blog.content;
  blog.publishedDate = publishedDate ?? blog.publishedDate;

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