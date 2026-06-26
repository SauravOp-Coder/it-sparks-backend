import Review from "../models/Review.js";
import { cloudinary } from "../config/cloudinary.js";

const getReviews = async (req, res) => {
  const reviews = await Review.find({ isVisible: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
};

const getAdminReviews = async (req, res) => {
  const reviews = await Review.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
};

const createReview = async (req, res) => {
  const { studentName, course, review, rating, isVisible } = req.body;

  if (!studentName || !review) {
    res.status(400);
    throw new Error("Student name and review are required");
  }

  const newReview = await Review.create({
    studentName,
    course,
    review,
    rating: rating || 5,
    image: req.file
      ? {
          url: req.file.path,
          publicId: req.file.filename,
        }
      : {
          url: "",
          publicId: "",
        },
    isVisible:
      isVisible === undefined ? true : isVisible === "true" || isVisible === true,
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review: newReview,
  });
};

const updateReview = async (req, res) => {
  const reviewItem = await Review.findById(req.params.id);

  if (!reviewItem) {
    res.status(404);
    throw new Error("Review not found");
  }

  const { studentName, course, review, rating, isVisible } = req.body;

  reviewItem.studentName = studentName ?? reviewItem.studentName;
  reviewItem.course = course ?? reviewItem.course;
  reviewItem.review = review ?? reviewItem.review;
  reviewItem.rating = rating ?? reviewItem.rating;

  if (req.file) {
    if (reviewItem.image?.publicId) {
      await cloudinary.uploader.destroy(reviewItem.image.publicId);
    }

    reviewItem.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  if (isVisible !== undefined) {
    reviewItem.isVisible = isVisible === "true" || isVisible === true;
  }

  const updatedReview = await reviewItem.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review: updatedReview,
  });
};

const deleteReview = async (req, res) => {
  const reviewItem = await Review.findById(req.params.id);

  if (!reviewItem) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (reviewItem.image?.publicId) {
    await cloudinary.uploader.destroy(reviewItem.image.publicId);
  }

  await reviewItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};

export {
  getReviews,
  getAdminReviews,
  createReview,
  updateReview,
  deleteReview,
};