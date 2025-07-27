import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages-css/Moreaboutstudent.css";

export const Moreaboutstudent = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [student, setStudent] = useState(state);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (!student) {
            setError('No student data available. Please go back and try again.');
        }
    }, [student]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleImageClick = (imageSrc, title) => {
        setSelectedImage({ src: imageSrc, title });
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const getPercentageColor = (percentage) => {
        const percent = parseFloat(percentage);
        if (percent >= 90) return 'excellent';
        if (percent >= 80) return 'good';
        if (percent >= 70) return 'average';
        return 'below-average';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="student-gallery-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Student Details...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="student-gallery-container">
                <div className="error-section">
                    <div className="error-icon">⚠️</div>
                    <h2 className="error-title">Error Loading Student Details</h2>
                    <p className="error-text">{error}</p>
                    <button onClick={handleGoBack} className="back-button">
                        <span className="button-icon">←</span>
                        <span className="button-text">Go Back</span>
                    </button>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="student-gallery-container">
                <div className="empty-section">
                    <div className="empty-icon">👤</div>
                    <h2 className="empty-title">No Student Data</h2>
                    <p className="empty-text">No student information is available to display.</p>
                    <button onClick={handleGoBack} className="back-button">
                        <span className="button-icon">←</span>
                        <span className="button-text">Go Back</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="student-gallery-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">👤</div>
                    <div className="header-text">
                        <h1 className="page-title">Student Details</h1>
                        <p className="page-subtitle">Comprehensive information about the student</p>
                    </div>
                </div>
            </header>

            <div className="student-details-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">📋</span>
                        Personal Information
                    </h2>
                </div>

                <div className="student-card">
                    <div className="student-header">
                        <div className="student-avatar">
                            <span className="avatar-icon">👨‍🎓</span>
                        </div>
                        <div className="student-info">
                            <h3 className="student-name">{student.full_name}</h3>
                            <div className="student-meta">
                                <span className="student-stream">{student.strime_name || 'Stream not specified'}</span>
                                <span className={`student-percentage ${getPercentageColor(student.last_education_percentage)}`}>
                                    {student.last_education_percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="student-details-grid">
                        <div className="detail-section">
                            <h4 className="section-subtitle">
                                <span className="subtitle-icon">📍</span>
                                Contact Information
                            </h4>
                            <div className="detail-items">
                                <div className="detail-item">
                                    <span className="detail-icon">📱</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Mobile Number</span>
                                        <span className="detail-value">{student.mobile_no || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📞</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Parent Mobile</span>
                                        <span className="detail-value">{student.parent_mobileno || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">🏠</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Address</span>
                                        <span className="detail-value">{student.address || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📮</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Pincode</span>
                                        <span className="detail-value">{student.pincode || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h4 className="section-subtitle">
                                <span className="subtitle-icon">🎓</span>
                                Educational Information
                            </h4>
                            <div className="detail-items">
                                <div className="detail-item">
                                    <span className="detail-icon">📅</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Date of Birth</span>
                                        <span className="detail-value">{formatDate(student.birthdate)}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">🎓</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Last Education</span>
                                        <span className="detail-value">{student.last_education || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">📊</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Education Percentage</span>
                                        <span className={`detail-value percentage-badge ${getPercentageColor(student.last_education_percentage)}`}>
                                            {student.last_education_percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">🏫</span>
                                    <div className="detail-content">
                                        <span className="detail-label">School/College</span>
                                        <span className="detail-value">{student.school_or_college_name || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-icon">👨‍👩‍👧‍👦</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Parent Occupation</span>
                                        <span className="detail-value">{student.parent_occupation || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="documents-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">📄</span>
                        Student Documents
                    </h2>
                </div>

                <div className="student-photos">
                    <div className="document-card" onClick={() => handleImageClick(student.cast_certificate, 'Caste Certificate')}>
                        <div className="document-icon">📋</div>
                        <label className="document-label">Caste Certificate</label>
                        {student.cast_certificate ? (
                            <img src={student.cast_certificate} alt="Caste Certificate" className="document-image" />
                        ) : (
                            <div className="document-placeholder">
                                <span className="placeholder-icon">📄</span>
                                <span className="placeholder-text">No document</span>
                            </div>
                        )}
                    </div>

                    <div className="document-card" onClick={() => handleImageClick(student.marksheet, 'Marksheet')}>
                        <div className="document-icon">📊</div>
                        <label className="document-label">Marksheet</label>
                        {student.marksheet ? (
                            <img src={student.marksheet} alt="Marksheet" className="document-image" />
                        ) : (
                            <div className="document-placeholder">
                                <span className="placeholder-icon">📄</span>
                                <span className="placeholder-text">No document</span>
                            </div>
                        )}
                    </div>

                    <div className="document-card" onClick={() => handleImageClick(student.admission_document, 'Admission Document')}>
                        <div className="document-icon">📝</div>
                        <label className="document-label">Admission Document</label>
                        {student.admission_document ? (
                            <img src={student.admission_document} alt="Admission Document" className="document-image" />
                        ) : (
                            <div className="document-placeholder">
                                <span className="placeholder-icon">📄</span>
                                <span className="placeholder-text">No document</span>
                            </div>
                        )}
                    </div>

                    <div className="document-card" onClick={() => handleImageClick(student.student_adhar_card, 'Aadhar Card')}>
                        <div className="document-icon">🆔</div>
                        <label className="document-label">Aadhar Card</label>
                        {student.student_adhar_card ? (
                            <img src={student.student_adhar_card} alt="Aadhar Card" className="document-image" />
                        ) : (
                            <div className="document-placeholder">
                                <span className="placeholder-icon">📄</span>
                                <span className="placeholder-text">No document</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="actions-section">
                <button onClick={handleGoBack} className="back-button">
                    <span className="button-icon">←</span>
                    <span className="button-text">Back to Applications</span>
                </button>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{selectedImage.title}</h3>
                            <button className="modal-close" onClick={closeImageModal}>
                                <span className="close-icon">✕</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <img src={selectedImage.src} alt={selectedImage.title} className="modal-image" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
