const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    meal_name: { type: String, required: true, enum: ["breakfast", "lunch","dinner"] },
    time: { type: String, required: true },
    menu: [{ type: String, required: true }]
});

const DayFoodDetailSchema = new mongoose.Schema({
    day: {
        type: String, required: true, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    },
    meals: [MealSchema]
});

const HostelDetailSchema = new mongoose.Schema({
    hostel_rules: [{ type: String }],
    room_photos: [{ type: String }],
    food_details: [DayFoodDetailSchema]
});

module.exports = mongoose.model("HostelDetail", HostelDetailSchema);
