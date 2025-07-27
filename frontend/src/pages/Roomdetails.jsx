import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages-css/Roomdetails.css';

export const Roomdetails = () => {
    const [floors, setFloors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRooms = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getrooms`);
            setFloors(response.data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError('Failed to load room details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const getAvailabilityColor = (available, total) => {
        const percentage = (available / total) * 100;
        if (percentage === 0) return '#ef4444'; // Red - No availability
        if (percentage <= 25) return '#f59e0b'; // Orange - Low availability
        if (percentage <= 50) return '#eab308'; // Yellow - Medium availability
        return '#10b981'; // Green - High availability
    };

    const getAvailabilityText = (available, total) => {
        const percentage = (available / total) * 100;
        if (percentage === 0) return 'Fully Occupied';
        if (percentage <= 25) return 'Limited Availability';
        if (percentage <= 50) return 'Moderate Availability';
        return 'Good Availability';
    };

    if (isLoading) {
        return (
            <div className="rooms-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Room Details...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rooms-container">
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-text">{error}</h2>
                    <button className="retry-button" onClick={fetchRooms}>
                        <span className="button-icon">🔄</span>
                        <span className="button-text">Try Again</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rooms-container">
            <div className="rooms-header">
                <div className="header-icon">🏢</div>
                <h1 className="rooms-title">Room Details</h1>
                <p className="rooms-subtitle">Explore available rooms across all floors</p>
            </div>

            {floors.length === 0 ? (
                <div className="empty-section">
                    <div className="empty-icon">🏠</div>
                    <h2 className="empty-text">No Rooms Available</h2>
                    <p className="empty-description">Check back later for room updates</p>
                </div>
            ) : (
                <div className="floors-container">
                    {floors.map((floor, floorIndex) => (
                        <div key={floor._id} className="floor-section">
                            <div className="floor-header">
                                <div className="floor-icon">🏢</div>
                                <h2 className="floor-title">Floor {floor.floor_number}</h2>
                                <div className="floor-stats">
                                    <span className="stat-item">
                                        <span className="stat-icon">🚪</span>
                                        <span className="stat-text">{floor.rooms.length} Rooms</span>
                                    </span>
                                </div>
                            </div>
                            
                            <div className="rooms-grid">
                                {floor.rooms.map((room, roomIndex) => {
                                    const availabilityColor = getAvailabilityColor(room.available_beds, room.total_beds);
                                    const availabilityText = getAvailabilityText(room.available_beds, room.total_beds);
                                    
                                    return (
                                        <div 
                                            className="room-card" 
                                            key={room._id}
                                            style={{ animationDelay: `${roomIndex * 0.1}s` }}
                                        >
                                            <div className="room-header">
                                                <div className="room-icon">🚪</div>
                                                <h3 className="room-title">Room {room.room_number}</h3>
                                                <div 
                                                    className="availability-badge"
                                                    style={{ backgroundColor: availabilityColor }}
                                                >
                                                    {availabilityText}
                                                </div>
                                            </div>
                                            
                                            <div className="room-details">
                                                <div className="detail-item">
                                                    <span className="detail-icon">🛏️</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Total Beds</span>
                                                        <span className="detail-value">{room.total_beds}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="detail-item">
                                                    <span className="detail-icon">✅</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Available Beds</span>
                                                        <span className="detail-value">{room.available_beds}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="detail-item">
                                                    <span className="detail-icon">📊</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Occupancy</span>
                                                        <span className="detail-value">
                                                            {Math.round(((room.total_beds - room.available_beds) / room.total_beds) * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="room-actions">
                                                <button className="view-details-button">
                                                    <span className="button-icon">👁️</span>
                                                    <span className="button-text">View Details</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
