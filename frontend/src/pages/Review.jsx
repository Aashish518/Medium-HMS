import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/Review.css";
import { useLocation } from 'react-router-dom';

export const Review = () => {
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const { state } = useLocation();
    const userId = state?.userid;

    const MAX_COMMENT_LENGTH = 500;
    const remainingChars = MAX_COMMENT_LENGTH - comment.length;

    useEffect(() => {
        if (userId) {
            fetchReviews();
        } else {
            setError('User ID not found. Please login again.');
            setIsLoading(false);
        }
    }, [userId]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/review/${userId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err.message);
            setError('Failed to load reviews. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            setSubmitError('Please write a review before submitting.');
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/review`, {
                userId: userId, 
                comment: comment.trim()
            });
            setComment('');
            await fetchReviews();
        } catch (err) {
            console.error('Error adding review:', err.message);
            setSubmitError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_COMMENT_LENGTH) {
            setComment(value);
            setSubmitError(null);
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

    if (!userId) {
        return (
            <div className="review-container">
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-text">User ID Not Found</h2>
                    <p className="error-description">Please login again to access the review section.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="review-container">
            <div className="review-header">
                <div className="header-icon">⭐</div>
                <h1 className="review-title">Share Your Experience</h1>
                <p className="review-subtitle">Help others by sharing your thoughts about our hostel</p>
            </div>

            <div className="review-form-section">
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="form-header">
                        <h3 className="form-title">Write Your Review</h3>
                        <div className="char-counter">
                            <span className={`char-count ${remainingChars < 50 ? 'warning' : ''}`}>
                                {remainingChars} characters remaining
                            </span>
                        </div>
                    </div>
                    
                    <div className="textarea-container">
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Share your experience with our hostel... What did you like? What could be improved? Your feedback helps us provide better service!"
                            className="review-textarea"
                            required
                            maxLength={MAX_COMMENT_LENGTH}
                        />
                        <div className="textarea-footer">
                            <div className="textarea-icons">
                                <span className="icon">💭</span>
                                <span className="icon">📝</span>
                                <span className="icon">✨</span>
                            </div>
                        </div>
                    </div>

                    {submitError && (
                        <div className="submit-error">
                            <span className="error-icon">⚠️</span>
                            <span className="error-text">{submitError}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className={`review-button ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting || !comment.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="button-icon">⏳</span>
                                <span className="button-text">Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span className="button-icon">📤</span>
                                <span className="button-text">Submit Review</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="review-list-section">
                <div className="list-header">
                    <h2 className="list-title">Recent Reviews</h2>
                    <div className="review-count">
                        <span className="count-icon">📊</span>
                        <span className="count-text">{reviews.length} reviews</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-section">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading reviews...</p>
                    </div>
                ) : error ? (
                    <div className="error-section">
                        <div className="error-icon">⚠️</div>
                        <p className="error-text">{error}</p>
                        <button className="retry-button" onClick={fetchReviews}>
                            <span className="button-icon">🔄</span>
                            <span className="button-text">Try Again</span>
                        </button>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">📝</div>
                        <h3 className="empty-text">No Reviews Yet</h3>
                        <p className="empty-description">Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="review-list">
                        {reviews.map((review, index) => (
                            <div 
                                className="review-item" 
                                key={review._id || index}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="review-header">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <span className="avatar-icon">👤</span>
                                        </div>
                                        <div className="user-details">
                                            <h4 className="review-username">{review.userId?.full_name || 'Anonymous'}</h4>
                                            <span className="review-date">{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <span className="star-icon">⭐</span>
                                    </div>
                                </div>
                                
                                <div className="review-content">
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                                
                                <div className="review-footer">
                                    <div className="review-actions">
                                        <button className="action-button">
                                            <span className="action-icon">👍</span>
                                            <span className="action-text">Helpful</span>
                                        </button>
                                        <button className="action-button">
                                            <span className="action-icon">💬</span>
                                            <span className="action-text">Reply</span>
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
