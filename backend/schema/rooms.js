const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    bed_number: { type: Number},
});


const roomSchema = new Schema({
    room_number: { type: String, required: true },
    total_beds: { type: Number, required: true },
    available_beds: { type: Number, required: true },
    students: [studentSchema]
});

const room = new Schema({
    floor_number: { type: String, required: true },
    rooms: [roomSchema]  
});

module.exports = mongoose.model('rooms', room);
