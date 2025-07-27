import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages-css/Managestudentapplication.css";

export const Managestudentapplication = () => {
    const [students, setStudents] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({
        totalStudents: 0,
        averagePercentage: 0,
        topStream: '',
        filteredCount: 0
    });
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/students`);
            const studentsNotInMerit = res.data.students.filter(
                (student) => student.merit_status !== "in_merit"
            );
            setStudents(studentsNotInMerit);
            setFilteredStudents(studentsNotInMerit);
            calculateStats(studentsNotInMerit);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError('Failed to load student applications. Please try again.');
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
            filteredCount: total
        });
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Update filtered count when filteredStudents changes
    useEffect(() => {
        setStats(prev => ({ ...prev, filteredCount: filteredStudents.length }));
    }, [filteredStudents.length]);

    const handleFilter = () => {
        if (filterValue === "") {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(
                (student) =>
                    parseFloat(student.last_education_percentage) >= parseFloat(filterValue)
            );
            setFilteredStudents(filtered);
        }
    };

    const clearFilter = () => {
        setFilterValue("");
        setFilteredStudents(students);
    };

    const viewdetail = (studentdata) => {
        navigate("/moreaboutstudent", { state: studentdata });
    };

    const handleShortList = async () => {
        if (filteredStudents.length === 0) {
            setError('No students to shortlist. Please adjust your filter criteria.');
            return;
        }

        if (!window.confirm(`Are you sure you want to shortlist ${filteredStudents.length} students?`)) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);

            const ids = filteredStudents.map(student => student._id);
            console.log("Sending IDs:", ids);

            await axios.put(`${import.meta.env.VITE_BACK_LINK}/api/students`, {
                ids: ids
            });

            setSuccess(`${filteredStudents.length} students have been shortlisted successfully!`);
            fetchStudents();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error("Error updating merit status:", error);
            setError("Failed to update merit status. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPercentageColor = (percentage) => {
        const percent = parseFloat(percentage);
        if (percent >= 90) return 'excellent';
        if (percent >= 80) return 'good';
        if (percent >= 70) return 'average';
        return 'below-average';
    };

    if (isLoading) {
        return (
            <div className="student-table-container">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <h2 className="loading-text">Loading Student Applications...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="student-table-container">
            <header className="page-header">
                <div className="header-content">
                    <div className="header-icon">📋</div>
                    <div className="header-text">
                        <h1 className="page-title">Manage Student Applications</h1>
                        <p className="page-subtitle">Review and shortlist student applications for merit list</p>
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

            <div className="stats-section">
                <h2 className="stats-title">Application Statistics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3 className="stat-title">Total Applications</h3>
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
                            <h3 className="stat-title">Filtered Results</h3>
                            <p className="stat-value">{stats.filteredCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">🔍</span>
                        Filter Applications
                    </h2>
                </div>
                
                <div className="filter-container">
                    <div className="filter-input-group">
                        <span className="filter-icon">📊</span>
                        <input
                            type="number"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="Enter minimum percentage"
                            className="filter-input"
                            min="0"
                            max="100"
                        />
                        <button onClick={handleFilter} className="filter-button">
                            <span className="button-icon">🔍</span>
                            <span className="button-text">Filter</span>
                        </button>
                        {filterValue && (
                            <button onClick={clearFilter} className="clear-button">
                                <span className="button-icon">✕</span>
                                <span className="button-text">Clear</span>
                            </button>
                        )}
                    </div>
                    <div className="filter-info">
                        <span className="filter-count">Showing {filteredStudents.length} of {students.length} applications</span>
                    </div>
                </div>
            </div>

            <div className="applications-section">
                <div className="section-header">
                    <h2 className="section-title">
                        <span className="title-icon">👥</span>
                        Student Applications
                    </h2>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="empty-section">
                        <div className="empty-icon">📋</div>
                        <h2 className="empty-title">
                            {filterValue ? 'No Applications Found' : 'No Applications Available'}
                        </h2>
                        <p className="empty-text">
                            {filterValue 
                                ? `No applications found with ${filterValue}% or higher. Try adjusting your filter criteria.`
                                : 'There are currently no student applications to review.'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Full Name</th>
                                        <th>Stream</th>
                                        <th>Last Education</th>
                                        <th>Percentage</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student._id} className="student-row" style={{ animationDelay: `${index * 0.05}s` }}>
                                            <td className="serial-number">{index + 1}</td>
                                            <td className="student-name">{student.full_name}</td>
                                            <td className="student-stream">{student.strime_name || 'Not specified'}</td>
                                            <td className="student-education">{student.last_education}</td>
                                            <td className="student-percentage">
                                                <span className={`percentage-badge ${getPercentageColor(student.last_education_percentage)}`}>
                                                    {student.last_education_percentage}%
                                                </span>
                                            </td>
                                            <td className="student-actions">
                                                <button 
                                                    onClick={() => viewdetail(student)}
                                                    className="details-button"
                                                >
                                                    <span className="button-icon">👁️</span>
                                                    <span className="button-text">View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bulk-actions">
                            <button 
                                onClick={handleShortList}
                                className={`shortlist-button ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting || filteredStudents.length === 0}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="button-icon">⏳</span>
                                        <span className="button-text">Shortlisting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="button-icon">✅</span>
                                        <span className="button-text">
                                            Shortlist {filteredStudents.length} Students
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
