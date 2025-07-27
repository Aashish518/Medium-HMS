import React from 'react';
import "../pages-css/Contactas.css";

export const Contactas = () => {
    const handleEmailClick = () => {
        window.location.href = "mailto:contact@hostelmanagement.com";
    };

    const handlePhoneClick = () => {
        window.location.href = "tel:+1234567890";
    };

    const handleLocationClick = () => {
        // You can add actual coordinates here
        window.open("https://maps.google.com", "_blank");
    };

    return (
        <>
            <div id="contact" className="contact-section">
                <div className="contact-container">
                    {/* Header Section */}
                    <div className="contact-header">
                        <h2 className="contact-name">Contact Us</h2>
                        <p className="contact-description">
                            For inquiries, feel free to reach out to us. We're here to help you with all your hostel-related questions.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div className="contact-cards">
                        {/* Email Card */}
                        <div className="contact-card email-card" onClick={handleEmailClick}>
                            <div className="card-icon">📧</div>
                            <h3 className="card-title">Email Us</h3>
                            <p className="card-description">Send us an email for general inquiries</p>
                            <span className="card-link">contact@hostelmanagement.com</span>
                        </div>

                        {/* Phone Card */}
                        <div className="contact-card phone-card" onClick={handlePhoneClick}>
                            <div className="card-icon">📞</div>
                            <h3 className="card-title">Call Us</h3>
                            <p className="card-description">Speak directly with our team</p>
                            <span className="card-link">+1 (234) 567-8900</span>
                        </div>

                        {/* Location Card */}
                        <div className="contact-card location-card" onClick={handleLocationClick}>
                            <div className="card-icon">📍</div>
                            <h3 className="card-title">Visit Us</h3>
                            <p className="card-description">Find our location on the map</p>
                            <span className="card-link">123 Hostel Street, City</span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="contact-info">
                        <div className="info-item">
                            <span className="info-icon">🕒</span>
                            <span className="info-text">Available 24/7 for urgent matters</span>
                        </div>
                        <div className="info-item">
                            <span className="info-icon">⚡</span>
                            <span className="info-text">Quick response within 2 hours</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};