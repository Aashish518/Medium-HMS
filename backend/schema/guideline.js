const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true
    },
    admissionPeriod: {
        startDate: { type: Date },
        endDate: { type: Date}
    },
    meritPeriod: {
        startDate: { type: Date},
        endDate: { type: Date}
    },
    processPeriod: {
        startDate: { type: Date},
        endDate: { type: Date}
    }
}, { timestamps: true });  

const Guideline = mongoose.model('Guideline', guidelineSchema);

module.exports = Guideline;
