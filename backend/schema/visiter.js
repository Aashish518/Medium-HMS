const visitorSchema = new mongoose.Schema({
    visitor_name: { type: String, required: true },
    relation: { type: String, required: true },
    visit_date: { type: Date, required: true },
    in_time: { type: String, required: true },
    out_time: { type: String, required: true }
});

module.exports = mongoose.model('Visitor', visitorSchema);