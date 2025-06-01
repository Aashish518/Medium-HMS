const express = require("express");
const router = express.Router();
const Authmid = require("../middleware/Authmid");
const { addcomplaints, getcomplaints, getallcomplaints, updatecomplaints } = require("../controller/complaints");

router.post("/complaint", Authmid, addcomplaints);

router.get("/complaint", Authmid, getcomplaints);

router.put("/:id/complaint", updatecomplaints);

router.get("/getallcomplaints", getallcomplaints);

module.exports = router;
