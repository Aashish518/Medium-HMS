const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    strime_name: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    student_whatsapp_no: {
        type: String,
        required: true
    },
    parent_mobileno: {
        type: String,
        required: true
    },
    parent_occupation: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    last_education: {
        type: String,
        required: true
    },
    last_education_percentage: {
        type: String,
        required: true
    },
    school_or_college_name: {
        type: String,
        required: true
    },
    cast_certificate: {
        type: String, 
        required: true
    },
    marksheet: {
        type: String,
        required: true
    },
    admission_document: {
        type: String, 
        required: true
    },
    student_adhar_card: {
        type: String, 
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    merit_status: {
        type: String,
        enum: ['in_merit', 'not_in_merit'],
        default: 'not_in_merit',
        required: true
    }
    
});

module.exports = mongoose.model('Student', StudentSchema);
