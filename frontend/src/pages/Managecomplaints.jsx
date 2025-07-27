import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/Managecomplaints.css";

export const Managecomplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [stats, setStats] = useState({
        totalComplaints: 0,
        pendingComplaints: 0,
        resolvedComplaints: 0,
        resolutionRate: 0
    });

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getallcomplaints`);
            setComplaints(res.data.complaints);
            calculateStats(res.data.complaints);
        } catch (error) {
            console.error(error);
            setError('Failed to load complaints. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (complaintsData) => {
        const total = complaintsData.length;
        const pending = complaintsData.filter(item => item.status === "Pending").length;
        const resolved = complaintsData.filter(item => item.status === "Resolved").length;
        const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

        setStats({
            totalComplaints: total,
            pendingComplaints: pending,
            resolvedComplaints: resolved,
            resolutionRate
        });
    };

    const handleStatusChange = async (id, studentName) => {
        if (!window.confirm(`Are you sure you want to mark the complaint from ${studentName} as resolved?`)) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.put(`${import.meta.env.VITE_BACK_LINK}/api/${id}/complaint`);
            setSuccess('Complaint marked as resolved successfully!');
            fetchComplaints();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to update complaint status. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'pending';
            case 'Resolved':
                return 'resolved';
            default:
                return 'pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return '⏳';
            case 'Resolved':
                return '✅';
            default:
                return '⏳';
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const pendingComplaints = complaints.filter(item => item.status === "Pending");
    const resolvedComplaints = complaints.filter(item => item.status === "Resolved");

    if (isLoading) {
        return (
            <div className="ManageComplaints-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Complaints...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="ManageComplaints-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">⚠️</div>
                    <div className="header-text">
                        <h1 className="page-title">Manage Complaints</h1>
                        <p className="page-subtitle">Review and resolve student complaints efficiently</p>
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
                <h2 className="stats-title">Complaint Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Total Complaints</h3>
                            <p className="stat-value">{stats.totalComplaints}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Pending</h3>
                            <p className="stat-value">{stats.pendingComplaints}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Resolved</h3>
                            <p className="stat-value">{stats.resolvedComplaints}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Resolution Rate</h3>
                            <p className="stat-value">{stats.resolutionRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="complaints-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">⏳</span>
                        Pending Complaints
                    </h2>
                </div>

                {pendingComplaints.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">🎉</div>
                        <h2 className="empty-title">No Pending Complaints</h2>
                        <p className="empty-text">All complaints have been resolved! Great job!</p>
                    </div>
                ) : (
                    <div className="complaints-grid">
                        {pendingComplaints.map((item, index) => (
                            <div key={item._id} className="complaint-card pending" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="complaint-header">
                                    <div className="complaint-info">
                                        <h3 className="complaint-title">Complaint #{item._id.slice(-6)}</h3>
                                        <div className={`status-badge ${getStatusColor(item.status)}`}>
                                            <span className="badge-icon">{getStatusIcon(item.status)}</span>
                                            <span className="badge-text">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="complaint-date">
                                        {formatDate(item.complaint_date)}
                                    </div>
                                </div>
                                
                                <div className="complaint-content">
                                    <div className="detail-item">
                                        <span className="detail-icon">👤</span>
                                        <span className="detail-label">Student ID:</span>
                                        <span className="detail-value">{item.student_id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📝</span>
                                        <span className="detail-label">Complaint:</span>
                                        <span className="detail-value complaint-text">{item.complaint_text}</span>
                                    </div>
                                </div>
                                
                                <div className="complaint-actions">
                                    <button
                                        onClick={() => handleStatusChange(item._id, item.student_id)}
                                        className={`resolve-button ${isSubmitting ? 'submitting' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="button-icon">⏳</span>
                                                <span className="button-text">Resolving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="button-icon">✅</span>
                                                <span className="button-text">Mark as Resolved</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {resolvedComplaints.length > 0 && (
                <div className="resolved-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">✅</span>
                            Resolved Complaints
                        </h2>
                    </div>
                    
                    <div className="complaints-grid">
                        {resolvedComplaints.slice(0, 5).map((item, index) => (
                            <div key={item._id} className="complaint-card resolved" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="complaint-header">
                                    <div className="complaint-info">
                                        <h3 className="complaint-title">Complaint #{item._id.slice(-6)}</h3>
                                        <div className={`status-badge ${getStatusColor(item.status)}`}>
                                            <span className="badge-icon">{getStatusIcon(item.status)}</span>
                                            <span className="badge-text">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="complaint-date">
                                        {formatDate(item.complaint_date)}
                                    </div>
                                </div>
                                
                                <div className="complaint-content">
                                    <div className="detail-item">
                                        <span className="detail-icon">👤</span>
                                        <span className="detail-label">Student ID:</span>
                                        <span className="detail-value">{item.student_id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📝</span>
                                        <span className="detail-label">Complaint:</span>
                                        <span className="detail-value complaint-text">{item.complaint_text}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {resolvedComplaints.length > 5 && (
                        <div className="show-more-section">
                            <p className="show-more-text">
                                Showing 5 of {resolvedComplaints.length} resolved complaints
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
