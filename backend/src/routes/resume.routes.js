const express = require("express");
const resumeController = require("../controllers/resume.controller");

const router = express.Router();

router.post("/", resumeController.createResume);
router.get("/:id", resumeController.getResume);

module.exports = router;
