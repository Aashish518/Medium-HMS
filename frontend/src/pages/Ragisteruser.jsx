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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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
        setError(null);

        if (name === "photo") {
            if (files[0]) {
                // Validate file type
                if (!files[0].type.startsWith('image/')) {
                    setError('Please select a valid image file.');
                    return;
                }
                // Validate file size (max 5MB)
                if (files[0].size > 5 * 1024 * 1024) {
                    setError('Image size should be less than 5MB.');
                    return;
                }
                setFormData({ ...formData, photo: files[0] });
                setPhotoPreview(URL.createObjectURL(files[0]));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        if (!formData.full_name.trim()) {
            setError('Full name is required.');
            return false;
        }
        if (!formData.mobile_no.trim()) {
            setError('Mobile number is required.');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required.');
            return false;
        }
        if (!formData.password.trim()) {
            setError('Password is required.');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (!formData.photo && !student) {
            setError('Please upload a photo.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            const formDataToSend = new FormData();

            for (let key in formData) {
                if (formData[key] !== null && formData[key] !== "") {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const response = await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/register`, formDataToSend);

            if (response.data.user.role === "student") {
                setSuccess("Student registered successfully!");
                setTimeout(() => {
                    navigate("/admindashboard/ragisteruser/studentroomfees", {
                        state: { userid: response.data.user._id }
                    });
                }, 2000);
            } else {
                setSuccess("User registered successfully!");
                setTimeout(() => {
                    navigate("/admindashboard");
                }, 2000);
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response) {
                setError(error.response.data.message || "Failed to register user.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'student': return '👨‍🎓';
            case 'admin': return '👨‍💼';
            case 'security-guard': return '🛡️';
            case 'cleaner': return '🧹';
            case 'coock': return '👨‍🍳';
            default: return '👤';
        }
    };

    return (
        <div className="UserRegister-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">📝</div>
                    <div className="header-text">
                        <h1 className="page-title">User Registration</h1>
                        <p className="page-subtitle">
                            {student ? 'Register student from merit list' : 'Register new user'}
                        </p>
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

            <div className="registration-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">📋</span>
                        Registration Form
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="UserRegister-form">
                    <div className="form-sections">
                        {/* Photo Section */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">📸</span>
                                Profile Photo
                            </h3>
                            <div className="photo-upload-container">
                                <div className="photo-preview-container">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Preview" className="photo-preview" />
                                    ) : (
                                        <div className="photo-placeholder">
                                            <span className="placeholder-icon">📷</span>
                                            <span className="placeholder-text">No photo selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="file-input-container">
                                    <input 
                                        type="file" 
                                        name="photo" 
                                        onChange={handleChange} 
                                        className="file-input"
                                        accept="image/*"
                                    />
                                    <label htmlFor="photo" className="file-input-label">
                                        <span className="label-icon">📁</span>
                                        <span className="label-text">Choose Photo</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">👤</span>
                                Personal Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input 
                                        type="text" 
                                        name="full_name" 
                                        placeholder="Enter full name" 
                                        value={formData.full_name} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stream</label>
                                    <input 
                                        type="text" 
                                        name="strime_name" 
                                        placeholder="Enter stream name" 
                                        value={formData.strime_name} 
                                        onChange={handleChange} 
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth *</label>
                                    <input 
                                        type="date" 
                                        name="birthdate" 
                                        value={formData.birthdate} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role *</label>
                                    <select 
                                        name="role" 
                                        value={formData.role} 
                                        onChange={handleChange} 
                                        className="form-select"
                                        required
                                    >
                                        <option value="student">👨‍🎓 Student</option>
                                        <option value="admin">👨‍💼 Admin</option>
                                        <option value="security-guard">🛡️ Security Guard</option>
                                        <option value="cleaner">🧹 Cleaner</option>
                                        <option value="coock">👨‍🍳 Cook</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">📞</span>
                                Contact Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Mobile Number *</label>
                                    <input 
                                        type="tel" 
                                        name="mobile_no" 
                                        placeholder="Enter mobile number" 
                                        value={formData.mobile_no} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">WhatsApp Number</label>
                                    <input 
                                        type="tel" 
                                        name="student_whatsapp_no" 
                                        placeholder="Enter WhatsApp number" 
                                        value={formData.student_whatsapp_no} 
                                        onChange={handleChange} 
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Enter email address" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password *</label>
                                    <div className="password-input-container">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            placeholder="Enter password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            className="form-input"
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            className="password-toggle"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">🏠</span>
                                Address Information
                            </h3>
                            <div className="form-group">
                                <label className="form-label">Address *</label>
                                <textarea 
                                    name="address" 
                                    placeholder="Enter complete address" 
                                    value={formData.address} 
                                    onChange={handleChange} 
                                    className="form-textarea"
                                    rows="3"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pincode *</label>
                                <input 
                                    type="text" 
                                    name="pincode" 
                                    placeholder="Enter pincode" 
                                    value={formData.pincode} 
                                    onChange={handleChange} 
                                    className="form-input"
                                    required 
                                />
                            </div>
                        </div>

                        {/* Parent Information */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">👨‍👩‍👧‍👦</span>
                                Parent Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Parent Mobile Number *</label>
                                    <input 
                                        type="tel" 
                                        name="parent_mobileno" 
                                        placeholder="Enter parent mobile number" 
                                        value={formData.parent_mobileno} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Parent Occupation *</label>
                                    <input 
                                        type="text" 
                                        name="parent_occupation" 
                                        placeholder="Enter parent occupation" 
                                        value={formData.parent_occupation} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Educational Information */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">🎓</span>
                                Educational Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">School/College Name *</label>
                                    <input 
                                        type="text" 
                                        name="school_or_college_name" 
                                        placeholder="Enter school/college name" 
                                        value={formData.school_or_college_name} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Education *</label>
                                    <input 
                                        type="text" 
                                        name="last_education" 
                                        placeholder="Enter last education" 
                                        value={formData.last_education} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Percentage *</label>
                                    <input 
                                        type="number" 
                                        name="last_education_percentage" 
                                        placeholder="Enter percentage" 
                                        value={formData.last_education_percentage} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        min="0"
                                        max="100"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="form-section">
                            <h3 className="section-subtitle">
                                <span className="subtitle-icon">📄</span>
                                Documents
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Marksheet *</label>
                                    <input 
                                        type="text" 
                                        name="marksheet" 
                                        placeholder="Enter marksheet details" 
                                        value={formData.marksheet} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Caste Certificate *</label>
                                    <input 
                                        type="text" 
                                        name="cast_certificate" 
                                        placeholder="Enter caste certificate details" 
                                        value={formData.cast_certificate} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Aadhar Card *</label>
                                    <input 
                                        type="text" 
                                        name="student_adhar_card" 
                                        placeholder="Enter Aadhar card number" 
                                        value={formData.student_adhar_card} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className={`register-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="button-icon">⏳</span>
                                    <span className="button-text">Registering...</span>
                                </>
                            ) : (
                                <>
                                    <span className="button-icon">{getRoleIcon(formData.role)}</span>
                                    <span className="button-text">Register User</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
