import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/ManageComplaints.css";

export const Managecomplaints = () => {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getallcomplaints`);
            setComplaints(res.data.complaints);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (id) => {
        try {
            await axios.put(`${import.meta.env.VITE_BACK_LINK}/api/${id}/complaint`);
            fetchComplaints();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const pendingComplaints = complaints.filter(item => item.status === "Pending");

    return (
        <div className="ManageComplaints-container">
            <h1 className="ManageComplaints-heading">Manage Complaints</h1>

            {pendingComplaints.length === 0 ? (
                <p className="ManageComplaints-empty">No pending complaints.</p>
            ) : (
                <div className="ManageComplaints-list">
                    {pendingComplaints.map((item, index) => (
                        <div key={index} className="ManageComplaints-card">
                            <p><strong>Student:</strong> {item.student_id}</p>
                            <p><strong>Complaint:</strong> {item.complaint_text}</p>
                            <p><strong>Date:</strong> {new Date(item.complaint_date).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                            <button
                                onClick={() => handleStatusChange(item._id)}
                                className="ManageComplaints-button"
                            >
                                Mark as Resolved
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
