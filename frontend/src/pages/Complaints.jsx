import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../pages-css/Complaints.css";

export const Complaints = () => {
    const token = localStorage.getItem("token");

    const [complaintText, setComplaintText] = useState("");
    const [complaints, setComplaints] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8000/api/complaint`,
                { complaint_text: complaintText },  
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            
            alert("Complaint send successfully!");
            fetchComplaints();
            setComplaintText("");
        } catch (error) {
            console.error(error);
            alert("Failed to add complaint.");
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/complaint`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
            setComplaints(res.data.complaints);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
            fetchComplaints();
    }, []);

    return (
        <div className="ComplaintsPage-container">
            <h1 className="ComplaintsPage-heading">Student Complaints</h1>

            <form className="ComplaintsPage-form" onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter your complaint"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    className="ComplaintsPage-textarea"
                    required
                ></textarea>
                <button type="submit" className="ComplaintsPage-button">Submit Complaint</button>
            </form>

            {complaints.length > 0 && (
                <div className="ComplaintsPage-list">
                    <h2 className="ComplaintsPage-subheading">Your Complaints</h2>
                    {complaints.map((item, index) => (
                        <div key={index} className="ComplaintsPage-card">
                            <p><strong>Complaint:</strong> {item.complaint_text}</p>
                            <p><strong>Status:</strong> {item.status}</p>
                            <p><strong>Date:</strong> {new Date(item.complaint_date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
