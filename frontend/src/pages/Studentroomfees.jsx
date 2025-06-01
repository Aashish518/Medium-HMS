import React, { useState } from "react";
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
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
        available_beds:1,
    });

    const [feeForm, setFeeForm] = useState({
        user_id: userid || "",
        amount: "",
        payment_date: "",
        payment_mode: "Cash",
        payment_status: "Complet",
    });

    const handleRoomChange = (e) => {
        const { name, value } = e.target;
        setRoomForm({ ...roomForm, [name]: value });
    };

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        setFeeForm({ ...feeForm, [name]: value });
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:8000/api/updaterooms`, roomForm);

            alert("Room allocated successfully!");
        } catch (error) {
            console.error("Error allocating room:", error.response?.data?.message || error.message);
            alert("Failed to allocate room.");
        }
    };
    

    const handleFeeSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/api/fees`, feeForm);

            alert("Fee added successfully:", response.data);
            navigate("/admindashboard");
        } catch (error) {
            console.error("Error adding fee:", error.response?.data?.message || error.message);
        }
    };


    return (
        <div className="components-container">
            <h2 className="components-title">Student Room Allocation</h2>
            <form onSubmit={handleRoomSubmit} className="components-form">
                <input
                    type="number"
                    name="floor_number"
                    placeholder="Floor Number"
                    value={roomForm.floor_number}
                    onChange={handleRoomChange}
                    className="components-input"
                    required
                />
                <input
                    type="text"
                    name="room_number"
                    placeholder="Room Number"
                    value={roomForm.room_number}
                    onChange={handleRoomChange}
                    className="components-input"
                    required
                />
                <input
                    type="number"
                    name="bed_number"
                    placeholder="Bed Number"
                    value={roomForm.bed_number}
                    onChange={handleRoomChange}
                    className="components-input"
                    required
                />
                <button type="submit" className="components-button">
                    Allocate Room
                </button>
            </form>

            <h2 className="components-title">Student Fee Payment</h2>
            <form onSubmit={handleFeeSubmit} className="components-form">
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={feeForm.amount}
                    onChange={handleFeeChange}
                    className="components-input"
                    required
                />
                <input
                    type="date"
                    name="payment_date"
                    value={feeForm.payment_date}
                    onChange={handleFeeChange}
                    className="components-input"
                    required
                />
                <select
                    name="payment_mode"
                    value={feeForm.payment_mode}
                    onChange={handleFeeChange}
                    className="components-select"
                    required
                >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                </select>
                <select
                    name="payment_status"
                    value={feeForm.payment_status}
                    onChange={handleFeeChange}
                    className="components-select"
                    required
                >
                    <option value="Complet">Complete</option>
                    <option value="Pending">Pending</option>
                </select>
                <button type="submit" className="components-button">
                    Pay Fee
                </button>
            </form>
        </div>
    );
};
