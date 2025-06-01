const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { addstudents, getstudents, updatestudents } = require("../controller/student");

router.post(
    "/student",
    upload.fields([
        { name: "cast_certificate", maxCount: 1 },
        { name: "marksheet", maxCount: 1 },
        { name: "admission_document", maxCount: 1 },
        { name: "student_adhar_card", maxCount: 1 },
    ]),

    addstudents
);

router.get("/students", getstudents);

router.put("/students", updatestudents);


module.exports = router;
