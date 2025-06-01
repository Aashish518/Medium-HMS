import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages-css/Admindashboard.css';
import { Navbar } from '../components/Navbar';

export const Admindashboard = () => {
    const navigate = useNavigate();

    const [guideline, setGuideline] = useState({
        message: '',
        admissionPeriod: { startDate: '', endDate: '' },
        meritPeriod: { startDate: '', endDate: '' },
        processPeriod: { startDate: '', endDate: '' }
    });


    const handleInputChange = (e, period, field) => {
        setGuideline(prev => ({
            ...prev,
            [period]: {
                ...prev[period],
                [field]: e.target.value
            }
        }));
    };

    const handleMessageChange = (e) => {
        setGuideline(prev => ({
            ...prev,
            message: e.target.value
        }));
    };

    const handleUpdateGuideline = async () => {
        try {
            await axios.put("http://localhost:8000/api/guideline", guideline);
            alert("Guideline updated successfully!");
        } catch (err) {
            console.error("Update failed:", err.response?.data?.message);
            alert("Failed to update guideline.");
        }
    };

    const handleDeleteGuideline = async() => {
        try {
            await axios.delete("http://localhost:8000/api/guideline");
            alert("Guideline delete successfully!");
        } catch (err) {
            console.error("delete failed:", err.response?.data?.message);
            alert("Failed to update guideline.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="admin-dashboard">
                <aside className="sidebar">
                    <h2>Admin Panel</h2>
                    <ul>
                        <li>Dashboard</li>
                        <li onClick={() => navigate("/admindashboard/manageallhosdetail")}>Manageall HOS detail</li>
                        <li onClick={() => navigate("/admindashboard/managerooms")}>Managerooms</li>
                        <li onClick={() => navigate("/admindashboard/managestudentapplication")}>Manage Student Application</li>
                        <li onClick={() => navigate("/admindashboard/managecomplaints")}>Manage Complaints</li>
                        <li onClick={() => navigate("/meritelistpage")}>Merit List</li>
                    </ul>
                </aside>

                <main className="main-content">
                    <header className="header">
                        <h1>Welcome, Admin</h1>
                        <button onClick={() => navigate("/admindashboard/ragisteruser")}>Register</button>
                    </header>

                    <div className="admission-period">
                        <h3>Message Guideline</h3>
                        <div className="date-range">
                            <input
                                type="text"
                                value={guideline.message}
                                onChange={handleMessageChange}
                            />
                        </div>
                    </div>

                    <div className="admission-period">
                        <h3>Admission Open</h3>
                        <div className="date-range">
                            <label>Start
                                <input
                                    type="date"
                                    value={guideline.admissionPeriod.startDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'admissionPeriod', 'startDate')}
                                />
                            </label>
                            <label>End
                                <input
                                    type="date"
                                    value={guideline.admissionPeriod.endDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'admissionPeriod', 'endDate')}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="merit-period">
                        <h3>Merit List</h3>
                        <div className="date-range">
                            <label>Start
                                <input
                                    type="date"
                                    value={guideline.meritPeriod.startDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'meritPeriod', 'startDate')}
                                />
                            </label>
                            <label>End
                                <input
                                    type="date"
                                    value={guideline.meritPeriod.endDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'meritPeriod', 'endDate')}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="process-period">
                        <h3>Admission Process</h3>
                        <div className="date-range">
                            <label>Start
                                <input
                                    type="date"
                                    value={guideline.processPeriod.startDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'processPeriod', 'startDate')}
                                />
                            </label>
                            <label>End
                                <input
                                    type="date"
                                    value={guideline.processPeriod.endDate?.split("T")[0] || ''}
                                    onChange={(e) => handleInputChange(e, 'processPeriod', 'endDate')}
                                />
                            </label>
                        </div>
                    </div>

                    <button className="update-btn" onClick={handleUpdateGuideline}>
                        Save / Update Guideline
                    </button>
                    <button className="update-btn" onClick={handleDeleteGuideline}>
                        Delete Guideline
                    </button>
                </main>
            </div>
        </>
    );
};
