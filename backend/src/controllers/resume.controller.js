const resumeService = require("../services/resume.service");

async function createResume(req, res, next) {
  try {
    const data = req.body;
    const id = await resumeService.createResume(data);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

async function getResume(req, res, next) {
  try {
    const { id } = req.params;
    const resume = await resumeService.getResume(id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createResume,
  getResume,
};
