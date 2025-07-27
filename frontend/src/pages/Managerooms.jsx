import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages-css/Managerooms.css';

export const Managerooms = () => {
    const [floors, setFloors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [stats, setStats] = useState({
        totalRooms: 0,
        totalBeds: 0,
        availableBeds: 0,
        occupancyRate: 0
    });

    const [formData, setFormData] = useState({
        floor_number: '',
        room_number: '',
        total_beds: '',
        available_beds: ''
    });

    const fetchRooms = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getrooms`);
            setFloors(res.data.rooms);
            calculateStats(res.data.rooms);
        } catch (error) {
            console.error(error);
            setError('Failed to load rooms. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (roomsData) => {
        let totalRooms = 0;
        let totalBeds = 0;
        let availableBeds = 0;

        roomsData.forEach(floor => {
            totalRooms += floor.rooms.length;
            floor.rooms.forEach(room => {
                totalBeds += parseInt(room.total_beds);
                availableBeds += parseInt(room.available_beds);
            });
        });

        const occupancyRate = totalBeds > 0 ? ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1) : 0;

        setStats({
            totalRooms,
            totalBeds,
            availableBeds,
            occupancyRate
        });
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.floor_number.trim() || !formData.room_number.trim() || 
            !formData.total_beds.trim() || !formData.available_beds.trim()) {
            setError('Please fill all fields.');
            return;
        }

        if (parseInt(formData.available_beds) > parseInt(formData.total_beds)) {
            setError('Available beds cannot be more than total beds.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/addrooms`, formData);
            setSuccess('Room added successfully!');
            fetchRooms();
            setFormData({
                floor_number: '',
                room_number: '',
                total_beds: '',
                available_beds: ''
            });
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to add room. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (floorid, roomid, roomNumber) => {
        if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${floorid}/${roomid}/deleterooms`);
            setSuccess('Room deleted successfully!');
            fetchRooms();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to delete room. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="manage-room-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Rooms...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-room-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">🏠</div>
                    <div className="header-text">
                        <h1 className="page-title">Manage Rooms</h1>
                        <p className="page-subtitle">Add, view, and manage hostel rooms and their availability</p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            )}

            {success && (
                <div className="success-message">
                    <span className="success-icon">✅</span>
                    <span className="success-text">{success}</span>
                </div>
            )}

            <div className="stats-section">
                <h2 className="stats-title">Room Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🏢</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Total Rooms</h3>
                            <p className="stat-value">{stats.totalRooms}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🛏️</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Total Beds</h3>
                            <p className="stat-value">{stats.totalBeds}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Available Beds</h3>
                            <p className="stat-value">{stats.availableBeds}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Occupancy Rate</h3>
                            <p className="stat-value">{stats.occupancyRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="add-room-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">➕</span>
                        Add New Room
                    </h2>
                </div>
                
                <form className="manage-room-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Floor Number</label>
                            <input 
                                type="text" 
                                name="floor_number" 
                                value={formData.floor_number} 
                                onChange={handleChange} 
                                placeholder="Enter floor number" 
                                className="form-input"
                                disabled={isSubmitting}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Room Number</label>
                            <input 
                                type="text" 
                                name="room_number" 
                                value={formData.room_number} 
                                onChange={handleChange} 
                                placeholder="Enter room number" 
                                className="form-input"
                                disabled={isSubmitting}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Beds</label>
                            <input 
                                type="number" 
                                name="total_beds" 
                                value={formData.total_beds} 
                                onChange={handleChange} 
                                placeholder="Enter total beds" 
                                className="form-input"
                                disabled={isSubmitting}
                                min="1"
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Available Beds</label>
                            <input 
                                type="number" 
                                name="available_beds" 
                                value={formData.available_beds} 
                                onChange={handleChange} 
                                placeholder="Enter available beds" 
                                className="form-input"
                                disabled={isSubmitting}
                                min="0"
                                required 
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className={`add-room-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="button-icon">⏳</span>
                                <span className="button-text">Adding Room...</span>
                            </>
                        ) : (
                            <>
                                <span className="button-icon">➕</span>
                                <span className="button-text">Add Room</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="rooms-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">🏠</span>
                        Room Management
                    </h2>
                </div>

                {floors.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">🏠</div>
                        <h2 className="empty-title">No Rooms Found</h2>
                        <p className="empty-text">Start by adding some rooms using the form above.</p>
                    </div>
                ) : (
                    <div className="floors-container">
                        {floors.map((floor, floorIndex) => (
                            <div key={floor._id} className="manage-floor" style={{ animationDelay: `${floorIndex * 0.1}s` }}>
                                <div className="floor-header">
                                    <h3 className="floor-title">
                                        <span className="floor-icon">🏢</span>
                                        Floor {floor.floor_number}
                                    </h3>
                                    <div className="floor-stats">
                                        <span className="stat-item">
                                            <span className="stat-icon">🏠</span>
                                            <span className="stat-text">{floor.rooms.length} Rooms</span>
                                        </span>
                                    </div>
                                </div>
                                
                                {floor.rooms.length === 0 ? (
                                    <p className="empty-floor">No rooms on this floor.</p>
                                ) : (
                                    <div className="rooms-grid">
                                        {floor.rooms.map((room, roomIndex) => (
                                            <div key={room._id} className="room-card" style={{ animationDelay: `${(floorIndex * 0.1) + (roomIndex * 0.05)}s` }}>
                                                <div className="room-header">
                                                    <h4 className="room-title">Room {room.room_number}</h4>
                                                    <div className={`availability-badge ${room.available_beds === 0 ? 'full' : room.available_beds < room.total_beds ? 'partial' : 'available'}`}>
                                                        <span className="badge-icon">🛏️</span>
                                                        <span className="badge-text">
                                                            {room.available_beds === 0 ? 'Full' : room.available_beds === room.total_beds ? 'Available' : 'Partial'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="room-details">
                                                    <div className="detail-item">
                                                        <span className="detail-icon">🛏️</span>
                                                        <span className="detail-label">Total Beds:</span>
                                                        <span className="detail-value">{room.total_beds}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">✅</span>
                                                        <span className="detail-label">Available:</span>
                                                        <span className="detail-value">{room.available_beds}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">📊</span>
                                                        <span className="detail-label">Occupancy:</span>
                                                        <span className="detail-value">
                                                            {room.total_beds > 0 ? Math.round(((room.total_beds - room.available_beds) / room.total_beds) * 100) : 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="room-actions">
                                                    <button 
                                                        className="delete-room-button"
                                                        onClick={() => handleDelete(floor._id, room._id, room.room_number)}
                                                    >
                                                        <span className="button-icon">🗑️</span>
                                                        <span className="button-text">Delete Room</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
