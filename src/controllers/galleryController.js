import Gallery from "../models/Gallery.js";
import { cloudinary } from "../config/cloudinary.js";

const getGalleryItems = async (req, res) => {
  const galleryItems = await Gallery.find({ isVisible: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: galleryItems.length,
    galleryItems,
  });
};

const getAdminGalleryItems = async (req, res) => {
  const galleryItems = await Gallery.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: galleryItems.length,
    galleryItems,
  });
};

const createGalleryItem = async (req, res) => {
  const { title, category, isVisible } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Gallery title is required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Gallery image is required");
  }

  const galleryItem = await Gallery.create({
    title,
    category,
    image: {
      url: req.file.path,
      publicId: req.file.filename,
    },
    isVisible: isVisible === undefined ? true : isVisible === "true" || isVisible === true,
  });

  res.status(201).json({
    success: true,
    message: "Gallery image uploaded successfully",
    galleryItem,
  });
};

const updateGalleryItem = async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  const { title, category, isVisible } = req.body;

  galleryItem.title = title ?? galleryItem.title;
  galleryItem.category = category ?? galleryItem.category;

  if (isVisible !== undefined) {
    galleryItem.isVisible = isVisible === "true" || isVisible === true;
  }

  if (req.file) {
    if (galleryItem.image?.publicId) {
      await cloudinary.uploader.destroy(galleryItem.image.publicId);
    }

    galleryItem.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const updatedGalleryItem = await galleryItem.save();

  res.status(200).json({
    success: true,
    message: "Gallery item updated successfully",
    galleryItem: updatedGalleryItem,
  });
};

const deleteGalleryItem = async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error("Gallery item not found");
  }

  if (galleryItem.image?.publicId) {
    await cloudinary.uploader.destroy(galleryItem.image.publicId);
  }

  await galleryItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gallery item deleted successfully",
  });
};

export {
  getGalleryItems,
  getAdminGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};