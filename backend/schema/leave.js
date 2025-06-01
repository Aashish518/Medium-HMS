const leaveSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    leave_reason: { type: String, required: true },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
});

module.exports = mongoose.model('LeaveApplication', leaveSchema);
