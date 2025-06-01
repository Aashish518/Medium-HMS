import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages-css/Managerooms.css';

export const Managerooms = () => {
    const [floors, setFloors] = useState([]);
    const [formData, setFormData] = useState({
        floor_number: '',
        room_number: '',
        total_beds: '',
        available_beds: ''
    });

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getrooms`);
            setFloors(res.data.rooms);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/addrooms`, formData);
            fetchRooms();
            setFormData({
                floor_number: '',
                room_number: '',
                total_beds: '',
                available_beds: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (floorid, roomid) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${floorid}/${roomid}/deleterooms`);
            fetchRooms();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="manage-room-container">
            <h1 className="manage-room-title">Manage Rooms</h1>

            <form className="manage-room-form" onSubmit={handleSubmit}>
                <input type="text" name="floor_number" value={formData.floor_number} onChange={handleChange} placeholder="Floor Number" required />
                <input type="text" name="room_number" value={formData.room_number} onChange={handleChange} placeholder="Room Number" required />
                <input type="number" name="total_beds" value={formData.total_beds} onChange={handleChange} placeholder="Total Beds" required />
                <input type="number" name="available_beds" value={formData.available_beds} onChange={handleChange} placeholder="Available Beds" required />
                <button type="submit">Add Room</button>
            </form>

            <div className="manage-room-list">
                {floors.map((floor) => (
                    <div key={floor._id} className="manage-floor">
                        <h2>Floor: {floor.floor_number}</h2>
                        <table className="room-table">
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Total Beds</th>
                                    <th>Available Beds</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {floor.rooms.map((room) => (
                                    <tr key={room._id}>
                                        <td>{room.room_number}</td>
                                        <td>{room.total_beds}</td>
                                        <td>{room.available_beds}</td>
                                        <td>
                                            <button onClick={() => handleDelete(floor._id, room._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};
