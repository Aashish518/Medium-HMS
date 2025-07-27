import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages-css/Admindashboard.css';
import { Navbar } from '../components/Navbar';

export const Admindashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRooms: 0,
        totalComplaints: 0,
        totalApplications: 0
    });

    const [guideline, setGuideline] = useState({
        message: '',
        admissionPeriod: { startDate: '', endDate: '' },
        meritPeriod: { startDate: '', endDate: '' },
        processPeriod: { startDate: '', endDate: '' }
    });

    useEffect(() => {
        fetchGuideline();
        fetchStats();
    }, []);

    const fetchGuideline = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/guideline`);
            if (response.data.guideline) {
                setGuideline(response.data.guideline);
            }
        } catch (err) {
            console.error('Error fetching guideline:', err);
            setError('Failed to load guideline data.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Mock stats - replace with actual API calls
            setStats({
                totalStudents: 150,
                totalRooms: 45,
                totalComplaints: 12,
                totalApplications: 89
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleInputChange = (e, period, field) => {
        setGuideline(prev => ({
            ...prev,
            [period]: {
                ...prev[period],
                [field]: e.target.value
            }
        }));
    };

    const handleMessageChange = (e) => {
        setGuideline(prev => ({
            ...prev,
            message: e.target.value
        }));
    };

    const handleUpdateGuideline = async () => {
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.put(`${import.meta.env.VITE_BACK_LINK}/api/guideline`, guideline);
            setSuccess('Guideline updated successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Update failed:", err.response?.data?.message);
            setError('Failed to update guideline. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteGuideline = async() => {
        if (!window.confirm('Are you sure you want to delete the guideline? This action cannot be undone.')) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/guideline`);
            setSuccess('Guideline deleted successfully!');
            setGuideline({
                message: '',
                admissionPeriod: { startDate: '', endDate: '' },
                meritPeriod: { startDate: '', endDate: '' },
                processPeriod: { startDate: '', endDate: '' }
            });
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Delete failed:", err.response?.data?.message);
            setError('Failed to delete guideline. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="admin-dashboard">
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <h2 className="loading-text">Loading Admin Dashboard...</h2>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="admin-dashboard">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="admin-icon">👨‍💼</div>
                        <h2 className="sidebar-title">Admin Panel</h2>
                    </div>
                    
                    <nav className="sidebar-nav">
                        <ul className="nav-list">
                            <li className="nav-item active">
                                <span className="nav-icon">📊</span>
                                <span className="nav-text">Dashboard</span>
                            </li>
                            <li className="nav-item" onClick={() => navigate("/admindashboard/manageallhosdetail")}>
                                <span className="nav-icon">🏢</span>
                                <span className="nav-text">Manage HOS Details</span>
                            </li>
                            <li className="nav-item" onClick={() => navigate("/admindashboard/managerooms")}>
                                <span className="nav-icon">🏠</span>
                                <span className="nav-text">Manage Rooms</span>
                            </li>
                            <li className="nav-item" onClick={() => navigate("/admindashboard/managestudentapplication")}>
                                <span className="nav-icon">📝</span>
                                <span className="nav-text">Student Applications</span>
                            </li>
                            <li className="nav-item" onClick={() => navigate("/admindashboard/managecomplaints")}>
                                <span className="nav-icon">⚠️</span>
                                <span className="nav-text">Manage Complaints</span>
                            </li>
                            <li className="nav-item" onClick={() => navigate("/meritelistpage")}>
                                <span className="nav-icon">📋</span>
                                <span className="nav-text">Merit List</span>
                            </li>
                        </ul>
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-button" onClick={handleLogout}>
                            <span className="button-icon">🚪</span>
                            <span className="button-text">Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    <header className="header">
                        <div className="header-content">
                            <div className="welcome-section">
                                <h1 className="welcome-title">Welcome, Admin</h1>
                                <p className="welcome-subtitle">Manage your hostel system efficiently</p>
                            </div>
                            <button className="register-button" onClick={() => navigate("/admindashboard/ragisteruser")}>
                                <span className="button-icon">➕</span>
                                <span className="button-text">Register User</span>
                            </button>
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
                        <h2 className="stats-title">System Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-content">
                                    <h3 className="stat-title">Total Students</h3>
                                    <p className="stat-value">{stats.totalStudents}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🏠</div>
                                <div className="stat-content">
                                    <h3 className="stat-title">Total Rooms</h3>
                                    <p className="stat-value">{stats.totalRooms}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-content">
                                    <h3 className="stat-title">Complaints</h3>
                                    <p className="stat-value">{stats.totalComplaints}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📝</div>
                                <div className="stat-content">
                                    <h3 className="stat-title">Applications</h3>
                                    <p className="stat-value">{stats.totalApplications}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="guideline-section">
                        <h2 className="section-title">Guideline Management</h2>
                        
                        <div className="guideline-form">
                            <div className="form-group">
                                <h3 className="form-title">Message Guideline</h3>
                                <div className="input-container">
                                    <textarea
                                        className="message-input"
                                        placeholder="Enter your guideline message here..."
                                        value={guideline.message}
                                        onChange={handleMessageChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <h3 className="form-title">Admission Period</h3>
                                <div className="date-range">
                                    <div className="date-input">
                                        <label className="date-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.admissionPeriod.startDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'admissionPeriod', 'startDate')}
                                        />
                                    </div>
                                    <div className="date-input">
                                        <label className="date-label">End Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.admissionPeriod.endDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'admissionPeriod', 'endDate')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <h3 className="form-title">Merit List Period</h3>
                                <div className="date-range">
                                    <div className="date-input">
                                        <label className="date-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.meritPeriod.startDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'meritPeriod', 'startDate')}
                                        />
                                    </div>
                                    <div className="date-input">
                                        <label className="date-label">End Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.meritPeriod.endDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'meritPeriod', 'endDate')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <h3 className="form-title">Admission Process Period</h3>
                                <div className="date-range">
                                    <div className="date-input">
                                        <label className="date-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.processPeriod.startDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'processPeriod', 'startDate')}
                                        />
                                    </div>
                                    <div className="date-input">
                                        <label className="date-label">End Date</label>
                                        <input
                                            type="date"
                                            className="date-field"
                                            value={guideline.processPeriod.endDate?.split("T")[0] || ''}
                                            onChange={(e) => handleInputChange(e, 'processPeriod', 'endDate')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    className={`update-button ${isSubmitting ? 'submitting' : ''}`}
                                    onClick={handleUpdateGuideline}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="button-icon">⏳</span>
                                            <span className="button-text">Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="button-icon">💾</span>
                                            <span className="button-text">Save / Update Guideline</span>
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    className="delete-button"
                                    onClick={handleDeleteGuideline}
                                    disabled={isSubmitting}
                                >
                                    <span className="button-icon">🗑️</span>
                                    <span className="button-text">Delete Guideline</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};
