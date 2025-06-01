import React, { useEffect, useState } from 'react';
import "../components-css/Popup.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Popup = () => {
    const navigate = useNavigate();
    const [guideline, setGuideline] = useState(null);

    const fetchGuideline = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/guideline");
            setGuideline(res.data);
        } catch (err) {
            console.error("Failed to fetch guideline:", err.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchGuideline();
    }, []);

    const isWithinPeriod = (startDateStr, endDateStr) => {
        const today = new Date();
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        return today >= startDate && today <= endDate;
    };

    const isAdmissionOpen = () => {
        if (!guideline) return false;
        const { admissionPeriod } = guideline;
        return isWithinPeriod(admissionPeriod.startDate, admissionPeriod.endDate);
    };

    const isMeritListOpen = () => {
        if (!guideline) return false;
        const { meritPeriod } = guideline;
        return isWithinPeriod(meritPeriod.startDate, meritPeriod.endDate);
    };

    return (
        <>
            <div className="open-admission-popup">
                {guideline && isAdmissionOpen() && (
                    <button onClick={() => navigate("/applyform")}>
                        🎉 Admissions Open — Apply Now!
                    </button>
                )}
                {guideline && isMeritListOpen() && (
                    <button onClick={() => navigate("/meritelistpage")}>
                        📜 Merit List — View Now!
                    </button>
                )}
            </div>
        </>
    );
};
