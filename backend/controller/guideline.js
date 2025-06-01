const Guideline = require("../schema/guideline")

exports.getGuideline = async (req, res) => {
    try {
        const guideline = await Guideline.findOne();
        if (!guideline) {
            return res.status(404).json({ message: "No guideline found." });
        }
        res.status(200).json(guideline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOrUpdateGuideline = async (req, res) => {
    try {
        const data = req.body;
        const existing = await Guideline.findOne();
        

        if (existing) {
            const updated = await Guideline.findByIdAndUpdate(existing._id, data, { new: true });
            return res.status(200).json({ message: "Guideline updated successfully.", guideline: updated });
        } else {
            const newGuideline = await Guideline.create(data);
            res.status(201).json({ message: "Guideline created successfully.", guideline: newGuideline });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGuideline = async (req, res) => {
    try {
        const existing = await Guideline.findOne();
        if (!existing) {
            return res.status(404).json({ message: "No guideline found to delete." });
        }
        await Guideline.findByIdAndDelete(existing._id);
        res.status(200).json({ message: "Guideline deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
