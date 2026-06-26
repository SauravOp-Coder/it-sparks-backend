import Course from "../models/Course.js";
import Blog from "../models/Blog.js";
import Review from "../models/Review.js";
import Placement from "../models/Placement.js";
import Gallery from "../models/Gallery.js";
import Enquiry from "../models/Enquiry.js";
import Banner from "../models/Banner.js";

const getDashboardStats = async (req, res) => {
  const [
    totalCourses,
    visibleCourses,
    totalBlogs,
    totalReviews,
    totalPlacements,
    totalGallery,
    totalBanners,
    totalEnquiries,
    newEnquiries,
    contactedEnquiries,
    closedEnquiries,
  ] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ isVisible: true }),
    Blog.countDocuments(),
    Review.countDocuments(),
    Placement.countDocuments(),
    Gallery.countDocuments(),
    Banner.countDocuments(),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "New" }),
    Enquiry.countDocuments({ status: "Contacted" }),
    Enquiry.countDocuments({ status: "Closed" }),
  ]);

  const latestEnquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    stats: {
      totalCourses,
      visibleCourses,
      totalBlogs,
      totalReviews,
      totalPlacements,
      totalGallery,
      totalBanners,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      closedEnquiries,
    },
    latestEnquiries,
  });
};

export { getDashboardStats };