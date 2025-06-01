const express = require("express");
const router = express.Router();
const Authmid = require("../middleware/Authmid");
const { getrooms, addrooms, updateroom, deleteroom } = require("../controller/rooms");

router.get("/getrooms", getrooms);

router.post("/addrooms", addrooms);

router.put("/updaterooms", updateroom);

router.delete("/:floorid/:roomid/deleterooms", deleteroom);

module.exports = router;
