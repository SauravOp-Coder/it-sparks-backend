import Setting from "../models/Setting.js";

const getSettings = async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  res.status(200).json({
    success: true,
    settings,
  });
};

const updateSettings = async (req, res) => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  const {
    phone,
    whatsapp,
    email,
    address,
    googleMapLink,
    googleReviewReadLink,
    googleReviewWriteLink,
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    seoCanonicalBase,
    siteName,
    socialLinks,
  } = req.body;

  settings.phone = phone ?? settings.phone;
  settings.whatsapp = whatsapp ?? settings.whatsapp;
  settings.email = email ?? settings.email;
  settings.address = address ?? settings.address;
  settings.googleMapLink = googleMapLink ?? settings.googleMapLink;
  settings.googleReviewReadLink =
    googleReviewReadLink ?? settings.googleReviewReadLink;
  settings.googleReviewWriteLink =
    googleReviewWriteLink ?? settings.googleReviewWriteLink;
  settings.seoTitle = seoTitle ?? settings.seoTitle;
  settings.seoDescription = seoDescription ?? settings.seoDescription;
  settings.seoKeywords = seoKeywords ?? settings.seoKeywords;
  settings.seoImage = seoImage ?? settings.seoImage;
  settings.seoCanonicalBase = seoCanonicalBase ?? settings.seoCanonicalBase;
  settings.siteName = siteName ?? settings.siteName;

  if (socialLinks) {
    settings.socialLinks = {
      ...settings.socialLinks,
      ...socialLinks,
    };
  }

  const updatedSettings = await settings.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    settings: updatedSettings,
  });
};

export { getSettings, updateSettings };