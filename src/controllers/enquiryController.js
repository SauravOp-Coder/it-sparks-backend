import Enquiry from "../models/Enquiry.js";

const createEnquiry = async (req, res) => {
  const {
    name,
    fullName,
    mobile,
    number,
    phone,
    mobileNumber,
    contactNumber,
    email,
    interestedCourse,
    course,
    courseName,
    preferredMode,
    message,
    enquiryType,
    source,
  } = req.body;

  // Fallbacks for multiple potential request field variations
  const finalName = name || fullName;
  const finalMobile = mobile || number || phone || mobileNumber || contactNumber;
  const finalCourse = interestedCourse || course || courseName || "";

  if (!finalName || !finalMobile) {
    res.status(400);
    throw new Error("Full name and mobile number are required");
  }

  // Creates the database record combining fallback extraction and default constants
  const enquiry = await Enquiry.create({
    fullName: finalName, // mapped to standard schema field
    mobile: finalMobile,
    email: email || "",
    interestedCourse: finalCourse,
    preferredMode: preferredMode || "Not Selected",
    message: message || "",
    enquiryType: enquiryType || "General Enquiry",
    source: source || "Contact Form",
  });

  res.status(201).json({
    success: true,
    message: "Enquiry submitted successfully",
    enquiry,
  });
};

const getAdminEnquiries = async (req, res) => {
  const enquiries = await Enquiry.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: enquiries.length,
    enquiries,
  });
};

const updateEnquiryStatus = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  const { status } = req.body;

  if (!["New", "Contacted", "Closed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid enquiry status");
  }

  enquiry.status = status;

  const updatedEnquiry = await enquiry.save();

  res.status(200).json({
    success: true,
    message: "Enquiry status updated successfully",
    enquiry: updatedEnquiry,
  });
};

const deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  await enquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: "Enquiry deleted successfully",
  });
};

export {
  createEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};