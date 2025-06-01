const Fee = require('../schema/fees');

exports.addfees = async (req, res) => {
    try {
        const fee = new Fee(req.body);
        const savedFee = await fee.save();
        res.status(201).json(savedFee);
    } catch (error) {
        res.status(500).json({ message: "Error adding fee", error });
    }
};

exports.getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find().populate('user_id');
        res.status(200).json(fees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fees", error });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        const deletedFee = await Fee.findByIdAndDelete(req.params.id);
        if (!deletedFee) return res.status(404).json({ message: "Fee not found" });
        res.status(200).json({ message: "Fee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting fee", error });
    }
};
