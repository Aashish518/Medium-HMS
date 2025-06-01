const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    photo: {
        type: String,
        required:true
    },
    strime_name: {
        type: String,
    },
    full_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    pincode: {
        type: String,
    },
    mobile_no: {
        type: String,
    },
    student_whatsapp_no: {
        type: String,
    },
    parent_mobileno: {
        type: String,
    },
    parent_occupation: {
        type: String,
    },
    birthdate: {
        type: Date,
    },
    school_or_college_name: {
        type: String,
    },
    last_education: {
        type: String,
    },
    last_education_percentage: {
        type: String,
    },
    marksheet: {
        type: String,
    },
    cast_certificate: {
        type: String,
    },
    student_adhar_card: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'security-guard', 'cleaner','coock'],
        default: 'student',
        required: true
    },
})

module.exports = mongoose.model("users", userSchema);