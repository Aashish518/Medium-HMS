import React, { useState } from "react";
import axios from "axios";
import "../pages-css/Applyform.css"
import { useNavigate } from 'react-router-dom';

export const Applyform = () => {
    const [formData, setFormData] = useState({
        strime_name: "",
        full_name: "",
        address: "",
        pincode: "",
        mobile_no: "",
        student_whatsapp_no: "",
        parent_mobileno: "",
        parent_occupation: "",
        birthdate: "",
        last_education: "",
        last_education_percentage: "",
        school_or_college_name: "",
    });

    const [files, setFiles] = useState({
        cast_certificate: null,
        marksheet: null,
        admission_document: null,
        student_adhar_card: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        for (const key in formData) {
            data.append(key, formData[key]);
        }

        for (const key in files) {
            if (files[key]) {
                data.append(key, files[key]);
            }
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/student`, data);
            alert("apply successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student.");
        }
    };

    return (
        <div className="form-container">
            <h2>Apply New Student</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="text" name="strime_name" placeholder="Stream Name" onChange={handleChange} required />
                <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required />
                <input type="text" name="mobile_no" placeholder="Mobile Number" onChange={handleChange} required />
                <input type="text" name="student_whatsapp_no" placeholder="WhatsApp Number" onChange={handleChange} required />
                <input type="text" name="parent_mobileno" placeholder="Parent's Mobile Number" onChange={handleChange} required />
                <input type="text" name="parent_occupation" placeholder="Parent's Occupation" onChange={handleChange} required />
                <input type="date" name="birthdate" onChange={handleChange} required />
                <input type="text" name="last_education" placeholder="Last Education" onChange={handleChange} required />
                <input type="text" name="last_education_percentage" placeholder="Last Education Percentage" onChange={handleChange} required />
                <input type="text" name="school_or_college_name" placeholder="School/College Name" onChange={handleChange} required />

                <label>Cast Certificate</label>
                <input type="file" name="cast_certificate" onChange={handleFileChange} required />
                <label>Marksheet</label>
                <input type="file" name="marksheet" onChange={handleFileChange} required />
                <label>Admission Document</label>
                <input type="file" name="admission_document" onChange={handleFileChange} required />
                <label>Aadhar Card</label>
                <input type="file" name="student_adhar_card" onChange={handleFileChange} required />

                <button type="submit">Apply</button>
            </form>
        </div>
    );
};
