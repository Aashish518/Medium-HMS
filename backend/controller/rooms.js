const Room = require('../schema/rooms');

exports.getrooms = async (req, res) => {
    try {
        const rooms = await Room.find();
  
      res.json({ rooms });
    } catch (error) {
      console.error('Fetch Rooms Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.addrooms = async (req, res) => {
    try {
        const { floor_number, room_number, total_beds, available_beds } = req.body;

        let floor = await Room.findOne({ floor_number });

        if (!floor) {
            floor = new Room({ floor_number, rooms: [] });
        }

        const existingRoom = floor.rooms.find(r => r.room_number === room_number);
        if (existingRoom) {
            return res.status(400).json({ message: "Room already exists on this floor with the same number" });
        }

        floor.rooms.push({
            room_number,
            total_beds,
            available_beds,
            students: []
        });

        await floor.save();

        res.status(201).json({ message: "Room added successfully", floor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during add room" });
    }
};

exports.deleteroom = async (req, res) => {
    try {
        const { floorid, roomid } = req.params;

        const floor = await Room.findById(floorid);
        if (!floor) {
            return res.status(404).json({ message: "Floor not found" });
        }

        const roomIndex = floor.rooms.findIndex(r => r._id.toString() === roomid);
        if (roomIndex === -1) {
            return res.status(404).json({ message: "Room not found on this floor" });
        }

        floor.rooms.splice(roomIndex, 1);
        await floor.save();

        res.status(200).json({ message: "Room deleted successfully", floor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during delete room" });
    }
};

exports.updateroom = async (req, res) => {
    try {
        const { floor_number, room_number, user_id, bed_number, available_beds } = req.body;

        const floor = await Room.findOne({ floor_number });
        if (!floor) {
            return res.status(404).json({ message: "Floor not found" });
        }

        const room = floor.rooms.find(r => r.room_number === room_number);
        if (!room) {
            return res.status(404).json({ message: "Room not found on this floor" });
        }

        room.students.push({
            user_id,
            bed_number
        });

        room.available_beds -= available_beds;

        await floor.save();

        res.status(200).json({ message: "Student added to room and available beds updated", room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during room update" });
    }
};
