const hosdetail = require("../schema/hos_details");

exports.addrules = async (req, res) => {
    try {
        const { rule } = req.body;

        const data = await hosdetail.find();

        if (data.length > 0) {
            const hostelDetail = data[0]; 
            hostelDetail.hostel_rules.push(rule);
            await hostelDetail.save();
        } else {
            const hostelDetail = new hosdetail({
                hostel_rules: rule
            });
            await hostelDetail.save();
        }

        res.status(201).json({ message: "Rules added/updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during setting rules" });
    }
};


exports.addroomphoto = async (req, res) => {
    try {
        const imagePath = req.file.path; 

        const data = await hosdetail.find();

        if (data.length > 0) {
            const hostelDetail = data[0];
            hostelDetail.room_photos.push(imagePath);
            await hostelDetail.save();
        } else {
            const hostelDetail = new hosdetail({
                room_photos: [imagePath]
            });
            await hostelDetail.save();
        }

        res.status(201).json({ message: "Room photo added successfully", imagePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during uploading photo" });
    }
};
  

exports.addfooddetail = async (req, res) => {
    try {
        const { day, meal_name, time, menu } = req.body;

        if (!day || !meal_name || !time || !menu) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const data = await hosdetail.find();

        let hostelDetail;
        if (data.length > 0) {
            hostelDetail = data[0];
        } else {
            hostelDetail = new hosdetail();
        }

        const existingDay = hostelDetail.food_details.find(
            (item) => item.day.toLowerCase() === day.toLowerCase()
        );

        if (existingDay) {
            const existingMeal = existingDay.meals.find(
                (meal) => meal.meal_name.toLowerCase() === meal_name.toLowerCase()
            );

            if (existingMeal) {
                existingMeal.menu.push(...menu);
            } else {
                existingDay.meals.push({
                    meal_name,
                    time,
                    menu
                });
            }
        } else {
            hostelDetail.food_details.push({
                day,
                meals: [
                    {
                        meal_name,
                        time,
                        menu
                    }
                ]
            });
        }

        await hostelDetail.save();

        res.status(201).json({ message: "Food detail added/updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during adding food detail" });
    }
};




exports.deleterule = async (req, res) => {
    try {
        const { name } = req.params;

        const data = await hosdetail.find();
        if (data.length === 0) {
            return res.status(404).json({ message: "No hostel data found" });
        }

        const hostelDetail = data[0];
        hostelDetail.hostel_rules = hostelDetail.hostel_rules.filter(rule => rule !== name);
        await hostelDetail.save();

        res.status(200).json({ message: "Rule deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during deleting rule" });
    }
};

exports.deleteroomphoto = async (req, res) => {
    try {
        const { name } = req.params;

        const data = await hosdetail.find();
        if (data.length === 0) {
            return res.status(404).json({ message: "No hostel data found" });
        }

        const hostelDetail = data[0];
        const photoList = hostelDetail.room_photos;

        if (name < 0 || name >= photoList.length) {
            return res.status(400).json({ message: "Invalid photo index" });
        }

        hostelDetail.room_photos.splice(name, 1);
        await hostelDetail.save();

        res.status(200).json({ message: "Room photo deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during deleting photo" });
    }
};
  
  

exports.deletefooddetail = async (req, res) => {
    try {
        const { name } = req.params; 
        console.log("Deleting food detail for day:", name);

        const data = await hosdetail.find();
        if (data.length === 0) {
            return res.status(404).json({ message: "No hostel data found" });
        }

        const hostelDetail = data[0];

        hostelDetail.food_details = hostelDetail.food_details.filter(
            (item) => item.day !== name
        );

        await hostelDetail.save();

        res.status(200).json({ message: `Food detail for ${name} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during deleting food detail" });
    }
};
  

exports.getallhosdetails = async(req,res) => {
    try {
        const allhosdetails = await hosdetail.find({});
        res.status(200).json({allhosdetails})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during get rules" });
    }
}