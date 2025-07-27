import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../pages-css/Login.css";

export const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/login`, formData);
            if (res.data.user) {
                localStorage.setItem("token", res.data.token);
                navigate("/profile");
            }
        } catch (error) {
            console.error('Login Error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Header Section */}
                <div className="login-header">
                    <div className="logo-section">
                        <div className="logo-icon">🏠</div>
                        <h1 className="logo-text">Hostel Management</h1>
                    </div>
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to your account to continue</p>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">📧</span>
                            Email Address
                        </label>
                        <div className="input-container">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">🔒</span>
                            Password
                        </label>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                                autoComplete="current-password"
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

                    <button 
                        type="submit" 
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <span className="button-icon">🚀</span>
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="form-footer">
                        <p className="footer-text">
                            Don't have an account? 
                            <button 
                                type="button" 
                                className="link-button"
                                onClick={() => navigate("/ragisteruser")}
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};