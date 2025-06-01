const express = require("express");
const router = express.Router();
const Authmid = require("../middleware/Authmid");
const { addfees, getAllFees, deleteFee } = require("../controller/fees");

router.post("/fees", addfees);

router.get("/fees", getAllFees);

router.delete("/fees", deleteFee)

module.exports = router;