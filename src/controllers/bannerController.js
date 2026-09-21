import Banner from "../models/Banner.js";
import { cloudinary } from "../config/cloudinary.js";

const getBanners = async (req, res) => {
  const banners = await Banner.find({ isVisible: true }).sort({
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: banners.length,
    banners,
  });
};

const getBannersByPage = async (req, res) => {
  const banners = await Banner.find({
    page: req.params.page,
    isVisible: true,
  }).sort({
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: banners.length,
    banners,
  });
};

const getAdminBanners = async (req, res) => {
  const banners = await Banner.find().sort({
    page: 1,
    order: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: banners.length,
    banners,
  });
};

const getUploadedFile = (req, fieldName) => {
  return req.files?.[fieldName]?.[0] || null;
};

const createBanner = async (req, res) => {
  const {
    page,
    type,
    title,
    subtitle,
    buttonText,
    buttonLink,
    order,
    isVisible,
  } = req.body;

  if (!page) {
    res.status(400);
    throw new Error("Page is required");
  }

  const imageFile = getUploadedFile(req, "image");
  const mobileImageFile = getUploadedFile(req, "mobileImage");

  if (!imageFile) {
    res.status(400);
    throw new Error("Banner image is required");
  }

  const banner = await Banner.create({
    page,
    type: type || "page",
    title,
    subtitle,
    buttonText,
    buttonLink,
    order: order || 0,
    image: {
      url: imageFile.path,
      publicId: imageFile.filename,
    },
    mobileImage: mobileImageFile
      ? {
          url: mobileImageFile.path,
          publicId: mobileImageFile.filename,
        }
      : undefined,
    isVisible: isVisible === undefined ? true : isVisible === "true" || isVisible === true,
  });

  res.status(201).json({
    success: true,
    message: "Banner created successfully",
    banner,
  });
};

const updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  const {
    page,
    type,
    title,
    subtitle,
    buttonText,
    buttonLink,
    order,
    isVisible,
  } = req.body;

  banner.page = page ?? banner.page;
  banner.type = type ?? banner.type;
  banner.title = title ?? banner.title;
  banner.subtitle = subtitle ?? banner.subtitle;
  banner.buttonText = buttonText ?? banner.buttonText;
  banner.buttonLink = buttonLink ?? banner.buttonLink;
  banner.order = order ?? banner.order;

  if (isVisible !== undefined) {
    banner.isVisible = isVisible === "true" || isVisible === true;
  }

  const imageFile = getUploadedFile(req, "image");
  const mobileImageFile = getUploadedFile(req, "mobileImage");

  if (imageFile) {
    if (banner.image?.publicId) {
      await cloudinary.uploader.destroy(banner.image.publicId);
    }

    banner.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
  }

  if (mobileImageFile) {
    if (banner.mobileImage?.publicId) {
      await cloudinary.uploader.destroy(banner.mobileImage.publicId);
    }

    banner.mobileImage = {
      url: mobileImageFile.path,
      publicId: mobileImageFile.filename,
    };
  }

  const updatedBanner = await banner.save();

  res.status(200).json({
    success: true,
    message: "Banner updated successfully",
    banner: updatedBanner,
  });
};

const deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  if (banner.image?.publicId) {
    await cloudinary.uploader.destroy(banner.image.publicId);
  }

  if (banner.mobileImage?.publicId) {
    await cloudinary.uploader.destroy(banner.mobileImage.publicId);
  }

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
};

export {
  getBanners,
  getBannersByPage,
  getAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};