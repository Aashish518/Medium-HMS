import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "../pages-css/Studentroomfees.css";

export const Studentroomfees = () => {
    const location = useLocation();
    const { userid } = location.state || {};
    const navigate = useNavigate();

    const [roomForm, setRoomForm] = useState({
        user_id: userid || "",
        floor_number: "",
        room_number: "",
        bed_number: "",
        available_beds: 1,
    });

    const [feeForm, setFeeForm] = useState({
        user_id: userid || "",
        amount: "",
        payment_date: "",
        payment_mode: "Cash",
        payment_status: "Complet",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);
    const [isSubmittingFee, setIsSubmittingFee] = useState(false);

    useEffect(() => {
        if (!userid) {
            setError('No student ID provided. Please go back and try again.');
        }
    }, [userid]);

    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        setRoomForm({ ...roomForm, [name]: value });
        setError(null);
    };

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        setFeeForm({ ...feeForm, [name]: value });
        setError(null);
    };

    const validateRoomForm = () => {
        if (!roomForm.floor_number.trim()) {
            setError('Floor number is required.');
            return false;
        }
        if (!roomForm.room_number.trim()) {
            setError('Room number is required.');
            return false;
        }
        if (!roomForm.bed_number.trim()) {
            setError('Bed number is required.');
            return false;
        }
        if (parseInt(roomForm.floor_number) < 1) {
            setError('Floor number must be at least 1.');
            return false;
        }
        if (parseInt(roomForm.bed_number) < 1) {
            setError('Bed number must be at least 1.');
            return false;
        }
        return true;
    };

    const validateFeeForm = () => {
        if (!feeForm.amount.trim()) {
            setError('Amount is required.');
            return false;
        }
        if (parseFloat(feeForm.amount) <= 0) {
            setError('Amount must be greater than 0.');
            return false;
        }
        if (!feeForm.payment_date.trim()) {
            setError('Payment date is required.');
            return false;
        }
        return true;
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();

        if (!validateRoomForm()) {
            return;
        }

        try {
            setIsSubmittingRoom(true);
            setError(null);
            setSuccess(null);

            const response = await axios.put(`${import.meta.env.VITE_BACK_LINK}/api/updaterooms`, roomForm);

            setSuccess('Room allocated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error("Error allocating room:", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Failed to allocate room. Please try again.");
        } finally {
            setIsSubmittingRoom(false);
        }
    };

    const handleFeeSubmit = async (e) => {
        e.preventDefault();

        if (!validateFeeForm()) {
            return;
        }

        try {
            setIsSubmittingFee(true);
            setError(null);
            setSuccess(null);

            const response = await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/fees`, feeForm);

            setSuccess('Fee payment added successfully!');
            setTimeout(() => {
                navigate("/admindashboard");
            }, 2000);
        } catch (error) {
            console.error("Error adding fee:", error.response?.data?.message || error.message);
            setError(error.response?.data?.message || "Failed to add fee payment. Please try again.");
        } finally {
            setIsSubmittingFee(false);
        }
    };

    const getPaymentModeIcon = (mode) => {
        switch (mode) {
            case 'Cash': return '💵';
            case 'UPI': return '📱';
            case 'Card': return '💳';
            default: return '💰';
        }
    };

    const getPaymentStatusColor = (status) => {
        return status === 'Complet' ? 'success' : 'warning';
    };

    if (isLoading) {
        return (
            <div className="components-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Student Room & Fees...</h2>
                </div>
            </div>
        );
    }

    if (error && !userid) {
        return (
            <div className="components-container">
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-title">Error Loading Page</h2>
                    <p className="error-text">{error}</p>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <span className="button-icon">←</span>
                        <span className="button-text">Go Back</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="components-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">🏠</div>
                    <div className="header-text">
                        <h1 className="page-title">Student Room & Fees</h1>
                        <p className="page-subtitle">Allocate room and manage fee payments for student</p>
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

            <div className="forms-section">
                {/* Room Allocation Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🏠</span>
                            Room Allocation
                        </h2>
                    </div>

                    <form onSubmit={handleRoomSubmit} className="components-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Floor Number *</label>
                                <input
                                    type="number"
                                    name="floor_number"
                                    placeholder="Enter floor number"
                                    value={roomForm.floor_number}
                                    onChange={handleRoomChange}
                                    className="form-input"
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Room Number *</label>
                                <input
                                    type="text"
                                    name="room_number"
                                    placeholder="Enter room number"
                                    value={roomForm.room_number}
                                    onChange={handleRoomChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Bed Number *</label>
                                <input
                                    type="number"
                                    name="bed_number"
                                    placeholder="Enter bed number"
                                    value={roomForm.bed_number}
                                    onChange={handleRoomChange}
                                    className="form-input"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className={`submit-button room-button ${isSubmittingRoom ? 'submitting' : ''}`}
                                disabled={isSubmittingRoom}
                            >
                                {isSubmittingRoom ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Allocating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">🏠</span>
                                        <span className="button-text">Allocate Room</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Fee Payment Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">💰</span>
                            Fee Payment
                        </h2>
                    </div>

                    <form onSubmit={handleFeeSubmit} className="components-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={feeForm.amount}
                                    onChange={handleFeeChange}
                                    className="form-input"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Date *</label>
                                <input
                                    type="date"
                                    name="payment_date"
                                    value={feeForm.payment_date}
                                    onChange={handleFeeChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Mode *</label>
                                <select
                                    name="payment_mode"
                                    value={feeForm.payment_mode}
                                    onChange={handleFeeChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="Cash">💵 Cash</option>
                                    <option value="UPI">📱 UPI</option>
                                    <option value="Card">💳 Card</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Status *</label>
                                <select
                                    name="payment_status"
                                    value={feeForm.payment_status}
                                    onChange={handleFeeChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="Complet">✅ Complete</option>
                                    <option value="Pending">⏳ Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className={`submit-button fee-button ${isSubmittingFee ? 'submitting' : ''}`}
                                disabled={isSubmittingFee}
                            >
                                {isSubmittingFee ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">💰</span>
                                        <span className="button-text">Pay Fee</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="actions-section">
                <button onClick={() => navigate(-1)} className="back-button">
                    <span className="button-icon">←</span>
                    <span className="button-text">Back to Dashboard</span>
                </button>
            </div>
        </div>
    );
};
