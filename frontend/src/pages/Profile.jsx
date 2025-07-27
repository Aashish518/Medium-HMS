import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import "../pages-css/Profile.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getuserdata();
    }, []);

    const getuserdata = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            if (res.data.userdata) {
                setProfile(res.data.userdata);
                setEditData(res.data.userdata);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            // Add your update API call here
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(profile);
    };

    const handlereview = () => {
        navigate("/review", { state: { userid: profile._id } });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="profile-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profilepage-container">
                {/* Sidebar */}
                <aside className="profilepage-sidebar">
                    <div className="sidebar-header">
                        <div className="logo-section">
                            <div className="logo-icon">🏠</div>
                            <h2 className="profilepage-logo">Hostel Management</h2>
                        </div>
                    </div>

                    <nav className="profilepage-nav">
                        {profile.role === "admin" ? (
                            <div className="nav-item admin-item" onClick={() => navigate("/admindashboard")}>
                                <span className="nav-icon">👨‍💼</span>
                                <span className="nav-text">Admin Dashboard</span>
                            </div>
                        ) : (
                            <>
                                <div className="nav-item" onClick={handlereview}>
                                    <span className="nav-icon">⭐</span>
                                    <span className="nav-text">Review</span>
                                </div>
                                <div className="nav-item" onClick={() => navigate("/complaints")}>
                                    <span className="nav-icon">📝</span>
                                    <span className="nav-text">Complaints</span>
                                </div>
                            </>
                        )}
                        <div className="nav-item logout-item" onClick={handleLogout}>
                            <span className="nav-icon">🚪</span>
                            <span className="nav-text">Logout</span>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="profilepage-main">
                    <div className="profilepage-card">
                        {/* Profile Header */}
                        <div className="profilepage-header">
                            <div className="profile-image-container">
                                <img
                                    src={profile.photo || "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="profilepage-picture"
                                />
                                <div className="profile-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">Online</span>
                                </div>
                            </div>
                            <h1 className="profile-name">{profile.full_name}</h1>
                            <p className="profile-role">{profile.role === "admin" ? "Administrator" : "Student"}</p>
                        </div>

                        {/* Profile Form */}
                        <div className="profilepage-form">
                            <div className="form-section">
                                <h3 className="section-title">
                                    <span className="section-icon">👤</span>
                                    Personal Information
                                </h3>
                                
                                <div className="profilepage-form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📝</span>
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={editData.full_name || ""}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    ) : (
                                        <div className="info-display">{profile.full_name}</div>
                                    )}
                                </div>

                                <div className="profilepage-form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📧</span>
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email || ""}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    ) : (
                                        <div className="info-display">{profile.email}</div>
                                    )}
                                </div>

                                <div className="profilepage-form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📱</span>
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="mobile_no"
                                            value={editData.mobile_no || ""}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    ) : (
                                        <div className="info-display">{profile.mobile_no}</div>
                                    )}
                                </div>

                                <div className="profilepage-form-group">
                                    <label className="form-label">
                                        <span className="label-icon">🎭</span>
                                        Role
                                    </label>
                                    <div className="info-display role-badge">
                                        {profile.role === "admin" ? "👨‍💼 Administrator" : "🎓 Student"}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="profile-actions">
                                {isEditing ? (
                                    <>
                                        <button className="profilepage-button save-button" onClick={handleUpdate}>
                                            <span className="button-icon">💾</span>
                                            Save Changes
                                        </button>
                                        <button className="profilepage-button cancel-button" onClick={handleCancel}>
                                            <span className="button-icon">❌</span>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className="profilepage-button edit-button" onClick={handleEdit}>
                                        <span className="button-icon">✏️</span>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

