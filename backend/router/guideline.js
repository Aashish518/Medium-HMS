const express = require("express");
const { createOrUpdateGuideline, deleteGuideline, getGuideline } = require("../controller/guideline");
const router = express.Router();

router.get("/guideline", getGuideline);

router.put("/guideline", createOrUpdateGuideline);

router.delete("/guideline", deleteGuideline);

module.exports = router;
