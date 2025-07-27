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

    const [filePreviews, setFilePreviews] = useState({
        cast_certificate: null,
        marksheet: null,
        admission_document: null,
        student_adhar_card: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
                setError('Please select a valid image or PDF file.');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should be less than 5MB.');
                return;
            }

            setFiles({ ...files, [name]: file });
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFilePreviews({ ...filePreviews, [name]: e.target.result });
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreviews({ ...filePreviews, [name]: null });
            }
        }
        setError(null);
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
        if (!formData.last_education_percentage.trim()) {
            setError('Education percentage is required.');
            return false;
        }
        if (parseFloat(formData.last_education_percentage) < 0 || parseFloat(formData.last_education_percentage) > 100) {
            setError('Education percentage must be between 0 and 100.');
            return false;
        }
        if (!files.cast_certificate || !files.marksheet || !files.admission_document || !files.student_adhar_card) {
            setError('All documents are required.');
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

            const data = new FormData();

            for (const key in formData) {
                data.append(key, formData[key]);
            }

            for (const key in files) {
                if (files[key]) {
                    data.append(key, files[key]);
                }
            }

            const response = await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/student`, data);
            
            setSuccess('Application submitted successfully!');
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Error adding student:", error);
            setError(error.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getDocumentIcon = (documentType) => {
        switch (documentType) {
            case 'cast_certificate': return '📋';
            case 'marksheet': return '📊';
            case 'admission_document': return '📝';
            case 'student_adhar_card': return '🆔';
            default: return '📄';
        }
    };

    const getDocumentLabel = (documentType) => {
        switch (documentType) {
            case 'cast_certificate': return 'Caste Certificate';
            case 'marksheet': return 'Marksheet';
            case 'admission_document': return 'Admission Document';
            case 'student_adhar_card': return 'Aadhar Card';
            default: return 'Document';
        }
    };

    if (isLoading) {
        return (
            <div className="form-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Submitting Application...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">📝</div>
                    <div className="header-text">
                        <h1 className="page-title">Student Application Form</h1>
                        <p className="page-subtitle">Submit your application for hostel admission</p>
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

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="application-form">
                {/* Personal Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">👤</span>
                            Personal Information
                        </h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input 
                                type="text" 
                                name="full_name" 
                                placeholder="Enter your full name" 
                                value={formData.full_name}
                                onChange={handleChange} 
                                className="form-input"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Stream Name</label>
                            <input 
                                type="text" 
                                name="strime_name" 
                                placeholder="Enter your stream" 
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
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">📞</span>
                            Contact Information
                        </h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Mobile Number *</label>
                            <input 
                                type="tel" 
                                name="mobile_no" 
                                placeholder="Enter your mobile number" 
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
                                placeholder="Enter your WhatsApp number" 
                                value={formData.student_whatsapp_no}
                                onChange={handleChange} 
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Parent Mobile Number *</label>
                            <input 
                                type="tel" 
                                name="parent_mobileno" 
                                placeholder="Enter parent's mobile number" 
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
                                placeholder="Enter parent's occupation" 
                                value={formData.parent_occupation}
                                onChange={handleChange} 
                                className="form-input"
                                required 
                            />
                        </div>
                    </div>
                </div>

                {/* Address Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🏠</span>
                            Address Information
                        </h2>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Address *</label>
                        <textarea 
                            name="address" 
                            placeholder="Enter your complete address" 
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

                {/* Educational Information Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🎓</span>
                            Educational Information
                        </h2>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Last Education *</label>
                            <input 
                                type="text" 
                                name="last_education" 
                                placeholder="Enter your last education" 
                                value={formData.last_education}
                                onChange={handleChange} 
                                className="form-input"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Education Percentage *</label>
                            <input 
                                type="number" 
                                name="last_education_percentage" 
                                placeholder="Enter percentage" 
                                value={formData.last_education_percentage}
                                onChange={handleChange} 
                                className="form-input"
                                min="0"
                                max="100"
                                step="0.01"
                                required 
                            />
                        </div>

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
                    </div>
                </div>

                {/* Documents Section */}
                <div className="form-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">📄</span>
                            Required Documents
                        </h2>
                    </div>

                    <div className="documents-grid">
                        {Object.keys(files).map((fileKey) => (
                            <div key={fileKey} className="document-upload">
                                <div className="document-header">
                                    <span className="document-icon">{getDocumentIcon(fileKey)}</span>
                                    <label className="document-label">{getDocumentLabel(fileKey)} *</label>
                                </div>
                                
                                <div className="file-input-container">
                                    <input 
                                        type="file" 
                                        name={fileKey} 
                                        onChange={handleFileChange} 
                                        className="file-input"
                                        accept="image/*,.pdf"
                                        required 
                                    />
                                    <label htmlFor={fileKey} className="file-input-label">
                                        <span className="label-icon">📁</span>
                                        <span className="label-text">Choose File</span>
                                    </label>
                                </div>

                                {filePreviews[fileKey] && (
                                    <div className="file-preview">
                                        <img src={filePreviews[fileKey]} alt={getDocumentLabel(fileKey)} className="preview-image" />
                                    </div>
                                )}

                                {files[fileKey] && !filePreviews[fileKey] && (
                                    <div className="file-info">
                                        <span className="file-name">{files[fileKey].name}</span>
                                        <span className="file-size">({(files[fileKey].size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className={`submit-button ${isLoading ? 'submitting' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="button-icon">⏳</span>
                                <span className="button-text">Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span className="button-icon">📝</span>
                                <span className="button-text">Submit Application</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
