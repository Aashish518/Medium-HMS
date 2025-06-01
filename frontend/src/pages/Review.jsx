import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/Review.css";
import { useLocation } from 'react-router-dom';

export const Review = () => {
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const { state } = useLocation();
    const userId = state.userid;
    console.log(userId,reviews)

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/review/${userId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/review', {
                userId: userId, 
                comment: comment
            });
            setComment('');
            fetchReviews(); 
        } catch (err) {
            console.error('Error adding review:', err.message);
        }
    };

    return (
        <div className="review-container">
            <h1 className="review-title">Share Your Review</h1>
            <form onSubmit={handleSubmit} className="review-form">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="review-textarea"
                    required
                />
                <button type="submit" className="review-button">Submit</button>
            </form>

            <div className="review-list">
                {reviews.map((review, index) => (
                    <div className="review-item" key={index}>
                        <h4 className="review-username">{review.userId.full_name}</h4>
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-date">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};
