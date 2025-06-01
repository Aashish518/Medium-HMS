const complaint = require("../schema/complaints");

exports.addcomplaints = async (req, res) => {
    try {
        const {complaint_text} = req.body;

        if (!complaint_text || complaint_text.trim() === "") {
            return res.status(400).json({ error: "complaint_text is required" });
        }

        const complaintData = new complaint({
            student_id:req.user,
            complaint_text,
        });

        await complaintData.save();

        res.status(200).json({ message: "Complaint added successfully", complaintData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}


exports.getcomplaints = async (req, res) => {
    try {
        const complaints = await complaint.find({ student_id: req.user });

        if (complaints.length === 0) {
            return res.status(404).json({ message: "No complaints found for this student." });
        }

        res.status(200).json({complaints});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

exports.getallcomplaints = async(req, res) => {
    try {
        const complaints = await complaint.find({});
        res.status(200).json({ complaints })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}


exports.updatecomplaints = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedComplaint = await complaint.findByIdAndUpdate(id, { status:"Resolved" }, { new: true });

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Status updated", updatedComplaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


