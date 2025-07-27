import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../pages-css/Manageallhosdetails.css";

export const Manageallhosdetails = () => {
    const [hosDetails, setHosDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);
    
    const [newRule, setNewRule] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFoodDay, setNewFoodDay] = useState("");
    const [newMealName, setNewMealName] = useState("");
    const [newMealTime, setNewMealTime] = useState("");
    const [newMealMenu, setNewMealMenu] = useState("");

    const fetchHosDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getallhosdetails`);
            setHosDetails(res.data.allhosdetails);
        } catch (error) {
            console.error(error);
            setError('Failed to load hostel details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchHosDetails();
    }, []);

    const handleAddRule = async () => {
        if (!newRule.trim()) {
            setError('Please enter a rule.');
            return;
        }
        
        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/rules`, { rule: newRule });
            setNewRule("");
            setSuccess('Rule added successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to add rule. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleAddRoomPhoto = async () => {
        if (!selectedFile) {
            setError('Please select a photo.');
            return;
        }
        
        const formData = new FormData();
        formData.append("room_photo", selectedFile);

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/roomphotos`, formData);
            setSelectedFile(null);
            setSuccess('Photo added successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to add photo. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleAddFoodDetail = async () => {
        if (!newFoodDay.trim() || !newMealName.trim() || !newMealTime.trim() || !newMealMenu.trim()) {
            setError('Please fill all food details.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);
            
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/fooddetails`, {
                day: newFoodDay,
                meal_name: newMealName,
                time: newMealTime,
                menu: newMealMenu.split(","),
            });
            setNewFoodDay("");
            setNewMealName("");
            setNewMealTime("");
            setNewMealMenu("");
            setSuccess('Food detail added successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to add food detail. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleDeleteRule = async (rule) => {
        if (!window.confirm(`Are you sure you want to delete this rule: "${rule}"?`)) {
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${rule}/rules`);
            setSuccess('Rule deleted successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to delete rule. Please try again.');
        }
    };

    const handleDeleteRoomPhoto = async (index) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) {
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${index}/roomphotos`);
            setSuccess('Photo deleted successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to delete photo. Please try again.');
        }
    };

    const handleDeleteFoodDetail = async (day) => {
        if (!window.confirm(`Are you sure you want to delete food details for "${day}"?`)) {
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${day}/fooddetails`);
            setSuccess('Food detail deleted successfully!');
            fetchHosDetails();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error(error);
            setError('Failed to delete food detail. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setError(null);
        } else {
            setError('Please select a valid image file.');
            e.target.value = null;
        }
    };

    if (isLoading) {
        return (
            <div className="manageallhosdetail-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Hostel Details...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="manageallhosdetail-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">🏢</div>
                    <div className="header-text">
                        <h1 className="page-title">Manage Hostel Details</h1>
                        <p className="page-subtitle">Manage rules, photos, and food details for your hostel</p>
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

            {/* Data display */}
            {hosDetails.length === 0 ? (
                <div className="empty-section">
                    <div className="empty-icon">📋</div>
                    <h2 className="empty-title">No Hostel Details Found</h2>
                    <p className="empty-text">Start by adding some rules, photos, or food details below.</p>
                </div>
            ) : (
                <div className="details-section">
                    {hosDetails.map((detail, index) => (
                        <div className="manageallhosdetail-card" key={index}>
                            <div className="card-header">
                                <h3 className="manageallhosdetail-title">
                                    <span className="title-icon">📋</span>
                                    Hostel Rules
                                </h3>
                            </div>
                            
                            {detail.hostel_rules.length === 0 ? (
                                <p className="empty-list">No rules added yet.</p>
                            ) : (
                                <ul className="manageallhosdetail-list">
                                    {detail.hostel_rules.map((rule, idx) => (
                                        <li key={idx} className="list-item">
                                            <span className="item-text">{rule}</span>
                                            <button 
                                                className="delete-button"
                                                onClick={() => handleDeleteRule(rule)}
                                            >
                                                <span className="button-icon">🗑️</span>
                                                <span className="button-text">Delete</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="card-header">
                                <h3 className="manageallhosdetail-title">
                                    <span className="title-icon">📸</span>
                                    Room Photos
                                </h3>
                            </div>
                            
                            {detail.room_photos.length === 0 ? (
                                <p className="empty-list">No photos added yet.</p>
                            ) : (
                                <div className="manageallhosdetail-photos">
                                    {detail.room_photos.map((photo, idx) => (
                                        <div key={idx} className="photo-container">
                                            <img
                                                src={photo}
                                                alt={`Room ${idx + 1}`}
                                                className="manageallhosdetail-photo"
                                            />
                                            <button 
                                                className="delete-button photo-delete"
                                                onClick={() => handleDeleteRoomPhoto(idx)}
                                            >
                                                <span className="button-icon">🗑️</span>
                                                <span className="button-text">Delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="card-header">
                                <h3 className="manageallhosdetail-title">
                                    <span className="title-icon">🍽️</span>
                                    Food Details
                                </h3>
                            </div>
                            
                            {detail.food_details.length === 0 ? (
                                <p className="empty-list">No food details added yet.</p>
                            ) : (
                                <ul className="manageallhosdetail-foodlist">
                                    {detail.food_details.map((food, idx) => (
                                        <li key={idx} className="food-item">
                                            <div className="food-header">
                                                <strong className="food-day">{food.day}</strong>
                                                <button 
                                                    className="delete-button"
                                                    onClick={() => handleDeleteFoodDetail(food.day)}
                                                >
                                                    <span className="button-icon">🗑️</span>
                                                    <span className="button-text">Delete</span>
                                                </button>
                                            </div>
                                            <ul className="meals-list">
                                                {food.meals.map((meal, mealIdx) => (
                                                    <li key={mealIdx} className="meal-item">
                                                        <span className="meal-name">{meal.meal_name}</span>
                                                        <span className="meal-time">at {meal.time}</span>
                                                        <span className="meal-menu">: {meal.menu.join(", ")}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Sections */}
            <div className="manageallhosdetail-card add-section">
                <div className="card-header">
                    <h3 className="manageallhosdetail-title">
                        <span className="title-icon">➕</span>
                        Add New Content
                    </h3>
                </div>

                <div className="add-content">
                    <div className="add-section-item">
                        <h4 className="add-title">
                            <span className="add-icon">📋</span>
                            Add Hostel Rule
                        </h4>
                        <div className="input-group">
                            <input
                                className="form-input"
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Enter a new rule..."
                                disabled={isSubmitting}
                            />
                            <button 
                                className={`add-button ${isSubmitting ? 'submitting' : ''}`}
                                onClick={handleAddRule}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">➕</span>
                                        <span className="button-text">Add Rule</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="add-section-item">
                        <h4 className="add-title">
                            <span className="add-icon">📸</span>
                            Add Room Photo
                        </h4>
                        <div className="input-group">
                            <input
                                type="file"
                                className="file-input"
                                onChange={handleFileChange}
                                accept="image/*"
                                disabled={isSubmitting}
                            />
                            <button 
                                className={`add-button ${isSubmitting ? 'submitting' : ''}`}
                                onClick={handleAddRoomPhoto}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">📤</span>
                                        <span className="button-text">Add Photo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="add-section-item">
                        <h4 className="add-title">
                            <span className="add-icon">🍽️</span>
                            Add Food Details
                        </h4>
                        <div className="food-form">
                            <div className="form-row">
                                <input
                                    className="form-input"
                                    value={newFoodDay}
                                    onChange={(e) => setNewFoodDay(e.target.value)}
                                    placeholder="Day (e.g., Monday)"
                                    disabled={isSubmitting}
                                />
                                <input
                                    className="form-input"
                                    value={newMealName}
                                    onChange={(e) => setNewMealName(e.target.value)}
                                    placeholder="Meal Name (e.g., Breakfast)"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-row">
                                <input
                                    className="form-input"
                                    value={newMealTime}
                                    onChange={(e) => setNewMealTime(e.target.value)}
                                    placeholder="Time (e.g., 8:00 AM)"
                                    disabled={isSubmitting}
                                />
                                <input
                                    className="form-input"
                                    value={newMealMenu}
                                    onChange={(e) => setNewMealMenu(e.target.value)}
                                    placeholder="Menu (comma separated)"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button 
                                className={`add-button full-width ${isSubmitting ? 'submitting' : ''}`}
                                onClick={handleAddFoodDetail}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Adding Food...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">🍽️</span>
                                        <span className="button-text">Add Food Detail</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
