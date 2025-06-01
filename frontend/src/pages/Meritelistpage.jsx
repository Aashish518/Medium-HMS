import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages-css/Meritelistpage.css';

export const Meritelistpage = () => {
    const token = localStorage.getItem("token");
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    const getuserdata = async() => {
            try{
                const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getuser`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
    
                if (res.data.userdata) {
                    setUser(res.data.userdata);
                }   
            }catch (error) {
                console.error(error);
            }
        }

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/students`);
            const meritStudents = res.data.students.filter(
                (student) => student.merit_status === 'in_merit'
            );
            setStudents(meritStudents);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudents();
        getuserdata();
    }, []);

    const filteredStudents = students.filter((student) =>
        student.full_name.toLowerCase().includes(searchName.toLowerCase())
    );

    return (
        <div className="meritlistpage-container">
            <h1 className="meritlistpage-title">Merit List</h1>

            <div className="meritlistpage-searchbox">
                <input
                    type="text"
                    placeholder="Search by Name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="meritlistpage-input"
                />
            </div>

            <div className="meritlistpage-list">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student._id} className="meritlistpage-card">
                            <h2 className="meritlistpage-studentname">{student.full_name}</h2>
                            <p className="meritlistpage-detail">
                                <strong>Stream:</strong> {student.strime_name}
                            </p>
                            <p className="meritlistpage-detail">
                                <strong>Percentage:</strong> {student.last_education_percentage}%
                            </p>
                            <p className="meritlistpage-detail">
                                <strong>Contact:</strong> {student.mobile_no}
                            </p>
                            {user.role === "admin" ? (
                                <button
                                    onClick={() =>
                                        navigate("/admindashboard/ragisteruser", { state: { student } })
                                    }
                                    className="meritlistpage-button"
                                >
                                    Register This Student
                                </button>
                            ) : ("")}
                        </div>
                    ))
                ) : (
                    <p className="meritlistpage-nodata">No students found in merit list.</p>
                )}

            </div>
        </div>
    );
};
