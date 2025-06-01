const express = require("express");
const { addrules, addroomphoto, addfooddetail, deleterule, deleteroomphoto, deletefooddetail, getallhosdetails,   } = require("../controller/hos_details");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/rules", addrules);
router.post("/roomphotos", upload.single("room_photo"), addroomphoto);
router.post("/fooddetails", addfooddetail);

router.delete("/:name/rules", deleterule);
router.delete("/:name/roomphotos", deleteroomphoto);
router.delete("/:name/fooddetails", deletefooddetail);

router.get("/getallhosdetails", getallhosdetails);


module.exports = router;