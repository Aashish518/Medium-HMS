const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    complaint_text: { type: String, required: true },
    complaint_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
});

module.exports = mongoose.model('Complaint', complaintSchema);
  