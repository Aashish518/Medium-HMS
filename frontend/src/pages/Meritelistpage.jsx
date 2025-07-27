import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages-css/Meritelistpage.css';

export const Meritelistpage = () => {
    const token = localStorage.getItem("token");
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        averagePercentage: 0,
        topStream: '',
        searchResults: 0
    });
    const navigate = useNavigate();

    const getuserdata = async() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })

            if (res.data.userdata) {
                setUser(res.data.userdata);
            }   
        } catch (error) {
            console.error(error);
            setError('Failed to load user data. Please try again.');
        }
    }

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/students`);
            const meritStudents = res.data.students.filter(
                (student) => student.merit_status === 'in_merit'
            );
            setStudents(meritStudents);
            calculateStats(meritStudents);
        } catch (err) {
            console.error(err);
            setError('Failed to load merit list. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (studentsData) => {
        const total = studentsData.length;
        const averagePercentage = total > 0 
            ? (studentsData.reduce((sum, student) => sum + parseFloat(student.last_education_percentage || 0), 0) / total).toFixed(1)
            : 0;
        
        // Find most common stream
        const streamCounts = {};
        studentsData.forEach(student => {
            const stream = student.strime_name || 'Unknown';
            streamCounts[stream] = (streamCounts[stream] || 0) + 1;
        });
        const topStream = Object.keys(streamCounts).reduce((a, b) => 
            streamCounts[a] > streamCounts[b] ? a : b, 'Unknown');

        setStats({
            totalStudents: total,
            averagePercentage,
            topStream,
            searchResults: total
        });
    };

    useEffect(() => {
        fetchStudents();
        getuserdata();
    }, []);

    const filteredStudents = students.filter((student) =>
        student.full_name.toLowerCase().includes(searchName.toLowerCase())
    );

    // Update search results count
    React.useEffect(() => {
        setStats(prev => ({ ...prev, searchResults: filteredStudents.length }));
    }, [filteredStudents.length]);

    const handleRegisterStudent = (student) => {
        if (window.confirm(`Are you sure you want to register ${student.full_name}?`)) {
            navigate("/admindashboard/ragisteruser", { state: { student } });
        }
    };

    if (isLoading) {
        return (
            <div className="meritlistpage-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Merit List...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="meritlistpage-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">🏆</div>
                    <div className="header-text">
                        <h1 className="page-title">Merit List</h1>
                        <p className="page-subtitle">View and manage students in the merit list</p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            )}

            <div className="stats-section">
                <h2 className="stats-title">Merit List Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Total Students</h3>
                            <p className="stat-value">{stats.totalStudents}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Average Percentage</h3>
                            <p className="stat-value">{stats.averagePercentage}%</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎓</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Top Stream</h3>
                            <p className="stat-value">{stats.topStream}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔍</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Search Results</h3>
                            <p className="stat-value">{stats.searchResults}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="search-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">🔍</span>
                        Search Students
                    </h2>
                </div>
                
                <div className="search-container">
                    <div className="search-input-group">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="search-input"
                        />
                        {searchName && (
                            <button 
                                onClick={() => setSearchName('')}
                                className="clear-search-button"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="students-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">👥</span>
                        Merit List Students
                    </h2>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">📋</div>
                        <h2 className="empty-title">
                            {searchName ? 'No Students Found' : 'No Students in Merit List'}
                        </h2>
                        <p className="empty-text">
                            {searchName 
                                ? `No students found matching "${searchName}". Try a different search term.`
                                : 'There are currently no students in the merit list.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="students-grid">
                        {filteredStudents.map((student, index) => (
                            <div key={student._id} className="student-card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="student-header">
                                    <div className="student-info">
                                        <h3 className="student-name">{student.full_name}</h3>
                                        <div className="merit-badge">
                                            <span className="badge-icon">🏆</span>
                                            <span className="badge-text">Merit Student</span>
                                        </div>
                                    </div>
                                    <div className="percentage-display">
                                        <span className="percentage-value">{student.last_education_percentage}%</span>
                                        <span className="percentage-label">Score</span>
                                    </div>
                                </div>
                                
                                <div className="student-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">🎓</span>
                                        <span className="detail-label">Stream:</span>
                                        <span className="detail-value">{student.strime_name || 'Not specified'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📱</span>
                                        <span className="detail-label">Contact:</span>
                                        <span className="detail-value">{student.mobile_no || 'Not provided'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-icon">📧</span>
                                        <span className="detail-label">Email:</span>
                                        <span className="detail-value">{student.email || 'Not provided'}</span>
                                    </div>
                                </div>
                                
                                {user.role === "admin" && (
                                    <div className="student-actions">
                                        <button
                                            onClick={() => handleRegisterStudent(student)}
                                            className="register-button"
                                        >
                                            <span className="button-icon">📝</span>
                                            <span className="button-text">Register This Student</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
