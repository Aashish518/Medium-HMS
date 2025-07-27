import React, { useEffect, useState } from 'react';
import "../components-css/Popup.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Popup = () => {
    const navigate = useNavigate();
    const [guideline, setGuideline] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const fetchGuideline = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/guideline`);
            setGuideline(res.data);
        } catch (err) {
            console.error("Failed to fetch guideline:", err.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchGuideline();
        // Add a small delay to make the popup appear smoothly
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        
        return () => clearTimeout(timer);
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

    const handleAdmissionClick = () => {
        navigate("/applyform");
    };

    const handleMeritListClick = () => {
        navigate("/meritelistpage");
    };

    return (
        <>
            <div className="open-admission-popup">
                {guideline && isAdmissionOpen() && isVisible && (
                    <button 
                        onClick={handleAdmissionClick}
                        className="admission-button"
                        aria-label="Apply for admission"
                    >
                        <span>
                            🎉 Admissions Open — Apply Now!
                        </span>
                    </button>
                )}
                {guideline && isMeritListOpen() && isVisible && (
                    <button 
                        onClick={handleMeritListClick}
                        className="merit-button"
                        aria-label="View merit list"
                    >
                        <span>
                            📜 Merit List — View Now!
                        </span>
                    </button>
                )}
            </div>
        </>
    );
};
