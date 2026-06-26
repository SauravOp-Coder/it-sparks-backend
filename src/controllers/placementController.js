import Placement from "../models/Placement.js";
import { cloudinary } from "../config/cloudinary.js";

const getPlacements = async (req, res) => {
  const placements = await Placement.find({ isVisible: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: placements.length,
    placements,
  });
};

const getAdminPlacements = async (req, res) => {
  const placements = await Placement.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: placements.length,
    placements,
  });
};

const createPlacement = async (req, res) => {
  const {
    studentName,
    course,
    company,
    role,
    package: packageValue,
    year,
    isVisible,
  } = req.body;

  if (!studentName || !company) {
    res.status(400);
    throw new Error("Student name and company are required");
  }

  const placement = await Placement.create({
    studentName,
    course,
    company,
    role,
    package: packageValue,
    year,
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
    message: "Placement record created successfully",
    placement,
  });
};

const updatePlacement = async (req, res) => {
  const placement = await Placement.findById(req.params.id);

  if (!placement) {
    res.status(404);
    throw new Error("Placement record not found");
  }

  const {
    studentName,
    course,
    company,
    role,
    package: packageValue,
    year,
    isVisible,
  } = req.body;

  placement.studentName = studentName ?? placement.studentName;
  placement.course = course ?? placement.course;
  placement.company = company ?? placement.company;
  placement.role = role ?? placement.role;
  placement.package = packageValue ?? placement.package;
  placement.year = year ?? placement.year;

  if (req.file) {
    if (placement.image?.publicId) {
      await cloudinary.uploader.destroy(placement.image.publicId);
    }

    placement.image = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  if (isVisible !== undefined) {
    placement.isVisible = isVisible === "true" || isVisible === true;
  }

  const updatedPlacement = await placement.save();

  res.status(200).json({
    success: true,
    message: "Placement record updated successfully",
    placement: updatedPlacement,
  });
};

const deletePlacement = async (req, res) => {
  const placement = await Placement.findById(req.params.id);

  if (!placement) {
    res.status(404);
    throw new Error("Placement record not found");
  }

  if (placement.image?.publicId) {
    await cloudinary.uploader.destroy(placement.image.publicId);
  }

  await placement.deleteOne();

  res.status(200).json({
    success: true,
    message: "Placement record deleted successfully",
  });
};

export {
  getPlacements,
  getAdminPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
};