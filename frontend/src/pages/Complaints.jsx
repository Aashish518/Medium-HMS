import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/Complaints.css";

export const Complaints = () => {
    const token = localStorage.getItem("token");
    const [complaintText, setComplaintText] = useState("");
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const MAX_COMPLAINT_LENGTH = 1000;
    const remainingChars = MAX_COMPLAINT_LENGTH - complaintText.length;

    useEffect(() => {
        if (token) {
            fetchComplaints();
        } else {
            setError('Please login to access the complaints section.');
            setIsLoading(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) {
            setSubmitError('Please write a complaint before submitting.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);
            
            const res = await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/complaint`,
                { complaint_text: complaintText.trim() },  
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setSubmitSuccess(true);
            setComplaintText("");
            await fetchComplaints();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error('Error submitting complaint:', error);
            setSubmitError('Failed to submit complaint. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchComplaints = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/complaint`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setComplaints(res.data.complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
            setError('Failed to load complaints. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplaintChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_COMPLAINT_LENGTH) {
            setComplaintText(value);
            setSubmitError(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#f59e0b'; // Orange
            case 'in progress':
                return '#3b82f6'; // Blue
            case 'resolved':
                return '#10b981'; // Green
            case 'rejected':
                return '#ef4444'; // Red
            default:
                return '#64748b'; // Gray
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '⏳';
            case 'in progress':
                return '🔄';
            case 'resolved':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '📋';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    if (!token) {
        return (
            <div className="complaints-container">
                <div className="error-section">
                    <div className="error-icon">🔒</div>
                    <h2 className="error-text">Authentication Required</h2>
                    <p className="error-description">Please login to access the complaints section.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="complaints-container">
            <div className="complaints-header">
                <div className="header-icon">📝</div>
                <h1 className="complaints-title">Submit Your Complaint</h1>
                <p className="complaints-subtitle">We're here to help resolve your concerns</p>
            </div>

            <div className="complaint-form-section">
                <form className="complaint-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h3 className="form-title">Write Your Complaint</h3>
                        <div className="char-counter">
                            <span className={`char-count ${remainingChars < 100 ? 'warning' : ''}`}>
                                {remainingChars} characters remaining
                            </span>
                        </div>
                    </div>
                    
                    <div className="textarea-container">
                        <textarea
                            placeholder="Please describe your complaint in detail... What happened? When did it occur? How can we help resolve this issue?"
                            value={complaintText}
                            onChange={handleComplaintChange}
                            className="complaint-textarea"
                            required
                            maxLength={MAX_COMPLAINT_LENGTH}
                        />
                        <div className="textarea-footer">
                            <div className="textarea-icons">
                                <span className="icon">📋</span>
                                <span className="icon">⚠️</span>
                                <span className="icon">💬</span>
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className="submit-error">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">{submitError}</span>
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="submit-success">
                            <span className="success-icon">✅</span>
                            <span className="success-text">Complaint submitted successfully!</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`complaint-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting || !complaintText.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="button-icon">⏳</span>
                                <span className="button-text">Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span className="button-icon">📤</span>
                                <span className="button-text">Submit Complaint</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="complaints-list-section">
                <div className="list-header">
                    <h2 className="list-title">Your Complaints</h2>
                    <div className="complaints-count">
                        <span className="count-icon">📊</span>
                        <span className="count-text">{complaints.length} complaints</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading complaints...</p>
                    </div>
                ) : error ? (
                    <div className="error-section">
                        <div className="error-icon">⚠️</div>
                        <p className="error-text">{error}</p>
                        <button className="retry-button" onClick={fetchComplaints}>
                            <span className="button-icon">🔄</span>
                            <span className="button-text">Try Again</span>
                        </button>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">📝</div>
                        <h3 className="empty-text">No Complaints Yet</h3>
                        <p className="empty-description">Submit your first complaint above</p>
                    </div>
                ) : (
                    <div className="complaints-list">
                        {complaints.map((complaint, index) => (
                            <div 
                                className="complaint-item" 
                                key={complaint._id || index}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="complaint-header">
                                    <div className="complaint-info">
                                        <div className="complaint-icon">
                                            <span className="icon">📋</span>
                                        </div>
                                        <div className="complaint-details">
                                            <h4 className="complaint-id">Complaint #{complaint._id?.slice(-6) || index + 1}</h4>
                                            <span className="complaint-date">{formatDate(complaint.complaint_date)}</span>
                                        </div>
                                    </div>
                                    <div 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(complaint.status) }}
                                    >
                                        <span className="status-icon">{getStatusIcon(complaint.status)}</span>
                                        <span className="status-text">{complaint.status || 'Pending'}</span>
                                    </div>
                                </div>
                                
                                <div className="complaint-content">
                                    <p className="complaint-text">{complaint.complaint_text}</p>
                                </div>
                                
                                <div className="complaint-footer">
                                    <div className="complaint-actions">
                                        <button className="action-button">
                                            <span className="action-icon">👁️</span>
                                            <span className="action-text">View Details</span>
                                        </button>
                                        <button className="action-button">
                                            <span className="action-icon">💬</span>
                                            <span className="action-text">Follow Up</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
