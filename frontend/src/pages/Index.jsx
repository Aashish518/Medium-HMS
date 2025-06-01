import React, { useEffect, useState } from 'react';
import { Slider } from '../components/slider';
import "../pages-css/Index.css";
import { Navbar } from '../components/Navbar';
import { Photocard } from '../components/Photocard';
import { Contactas } from './Contactas';
import { Popup } from '../components/Popup';
import axios from 'axios';

export const Index = () => {
    const [rules, setRules] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [foodDetails, setFoodDetails] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [guideline, setGuideline] = useState(null);
    
    const fetchGuideline = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/guideline");
                setGuideline(res.data);
            } catch (err) {
                console.error("Failed to fetch guideline:", err.response?.data?.message);
            }
        };

    const fetchReviews = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/allreview`);
                setReviews(res.data);
            } catch (err) {
                console.error('Error fetching reviews:', err.message);
            }
        };
    useEffect(() => {
        fetchHostelDetails();
        fetchReviews();
        fetchGuideline();
    }, []);

    const fetchHostelDetails = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/getallhosdetails");
            const data = res.data.allhosdetails[0];

            if (data) {
                setRules(data.hostel_rules || []);
                setPhotos(data.room_photos || []);
                setFoodDetails(data.food_details || []);
            }
        } catch (err) {
            console.error("Error fetching hostel details:", err);
        }
    };

    return (
        <>
            {/* Navigation Bar */}
            <Navbar />

            {/* Top Slider */}
            <Slider />

            <marquee behavior="scroll" direction="left" scrollamount="7">
                {guideline?.message || ""}
            </marquee>


            {/* Rules */}
            <div className='index-rule-containner'>
                <h1 className='index-rule'>Hostel Rules</h1>
                {rules.length > 0 ? (
                    rules.map((rule, index) => <p key={index}>{rule}</p>)
                ) : (
                    <p>No rules available</p>
                )}
            </div>

            {/* Photo Cards */}
            <div className='index-roomphoto'>Rooms Photos</div>
            <div className='photo-card-container'>
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <div key={index} className='photo-card'>
                            <img src={`${photo}`} alt={`Room ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <p>No room photos available</p>
                )}
            </div>

            {/* Food Menu */}
            <div className='index-menu'>Food Menu</div>
            <div className='menu-card-container'>
                {foodDetails.length > 0 ? (
                    foodDetails.map((dayItem, index) => (
                        <div key={index} className='index-card'>
                            <h3>{dayItem.day}</h3>
                            {dayItem.meals.map((meal, i) => (
                                <div key={i}>
                                    <strong data-time={meal.time}>{meal.meal_name}</strong>
                                    <ul>
                                        {meal.menu.map((item, j) => (
                                            <li key={j}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No food menu available</p>
                )}

            </div>

            {/* Reviews */}
            <div className='index-review'>Reviews</div>
            <div className="review-list">
                {reviews.map((review, index) => (
                    <div className="review-item" key={index}>
                        <h4 className="review-username">{review.userId.full_name}</h4>
                        <p className="review-comment">{review.comment}</p>
                        <p className="review-date">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            {/* Contact Section */}
            <Contactas />
            <Popup />
        </>
    );
};
