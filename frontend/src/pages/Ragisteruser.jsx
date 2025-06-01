import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import "../pages-css/Ragisteruser.css";

export const Ragisteruser = () => {
    const location = useLocation();
    const { student } = location.state || "";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        photo: null,
        strime_name: "",
        full_name: "",
        address: "",
        pincode: "",
        mobile_no: "",
        student_whatsapp_no: "",
        parent_mobileno: "",
        parent_occupation: "",
        birthdate: "",
        school_or_college_name: "",
        last_education: "",
        last_education_percentage: "",
        marksheet: "",
        cast_certificate: "",
        student_adhar_card: "",
        email: "",
        password: "",
        role: "student"
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        if (student) {
            setFormData(prev => ({
                ...prev,
                ...student,
                birthdate: student.birthdate ? student.birthdate.slice(0, 10) : "", // format for date input
            }));
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "photo") {
            setFormData({ ...formData, photo: files[0] });
            setPhotoPreview(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();

            for (let key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post(`http://localhost:8000/api/register`,formDataToSend);

            if (response.data.user.role ==="student") {
                alert("Student registered successfully!");
                navigate("/admindashboard/ragisteruser/studentroomfees", {
                    state: { userid: response.data.user._id }
                });
            } else {
                navigate("/admindashboard")
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response) {
                alert(error.response.data.message || "Failed to register student.");
            } else {
                alert("Something went wrong.");
            }
        }
    };
    

    return (
        <div className="UserRegister-container">
            <h2 className="UserRegister-heading">Student Registration</h2>
            <form onSubmit={handleSubmit} className="UserRegister-form">
                <div className="UserRegister-photo-preview">
                    {photoPreview && <img src={photoPreview} alt="Preview" />}
                </div>
                <input type="file" name="photo" onChange={handleChange} className="UserRegister-input" />

                <input type="text" name="strime_name" placeholder="Strime Name" value={formData.strime_name} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="UserRegister-input" required />

                <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="mobile_no" placeholder="Mobile No" value={formData.mobile_no} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="student_whatsapp_no" placeholder="Student WhatsApp No" value={formData.student_whatsapp_no} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="parent_mobileno" placeholder="Parent Mobile No" value={formData.parent_mobileno} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="parent_occupation" placeholder="Parent Occupation" value={formData.parent_occupation} onChange={handleChange} className="UserRegister-input" required />

                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="school_or_college_name" placeholder="School/College Name" value={formData.school_or_college_name} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="last_education" placeholder="Last Education" value={formData.last_education} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="last_education_percentage" placeholder="Last Education %" value={formData.last_education_percentage} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="marksheet" placeholder="Marksheet" value={formData.marksheet} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="cast_certificate" placeholder="Caste Certificate" value={formData.cast_certificate} onChange={handleChange} className="UserRegister-input" required />

                <input type="text" name="student_adhar_card" placeholder="Student Aadhar Card" value={formData.student_adhar_card} onChange={handleChange} className="UserRegister-input" required />

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="UserRegister-input" />

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="UserRegister-input" />

                <select name="role" value={formData.role} onChange={handleChange} className="UserRegister-select" required>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="security-guard">Security Guard</option>
                    <option value="cleaner">Cleaner</option>
                    <option value="coock">Cook</option>
                </select>

                <button type="submit" className="UserRegister-button">Register</button>
            </form>
        </div>
    );
};
