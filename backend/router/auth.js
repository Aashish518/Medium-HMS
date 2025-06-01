const express = require("express");
const { register, login, getuser } = require("../controller/auth");
const router = express.Router();
const Authmid = require("../middleware/Authmid");
const upload = require("../middleware/upload"); 

router.post("/register", upload.single("photo"), register);
router.post("/login", login);

router.get("/getuser",Authmid,getuser);

module.exports = router;