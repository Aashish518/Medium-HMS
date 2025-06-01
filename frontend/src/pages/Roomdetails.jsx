import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages-css/Roomdetails.css';

export const Roomdetails = () => {
    const [floors, setFloors] = useState([]);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getrooms`);
            setFloors(response.data.rooms);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className="rooms-container">
            <h1 className="rooms-title">Rooms List</h1>
            {floors.map((floor) => (
                <div key={floor._id} className="floor-section">
                    <h2>Floor: {floor.floor_number}</h2>
                    <div className="rooms-grid">
                        {floor.rooms.map((room) => (
                            <div className="room-card" key={room._id}>
                                <h3>Room {room.room_number}</h3>
                                <p><strong>Total Beds:</strong> {room.total_beds}</p>
                                <p><strong>Available Beds:</strong> {room.available_beds}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
