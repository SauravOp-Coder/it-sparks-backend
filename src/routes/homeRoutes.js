const express = require("express");
const router = express.Router();
const { getHomeContent, updateHomeContent } = require("../controllers/homeController");
// const upload = require("../middleware/upload"); // Multer instance

router.get("/", getHomeContent);
router.put("/", updateHomeContent); // add upload.single("heroImage") here if handling uploads

module.exports = router;