import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../pages-css/Moreaboutstudent.css";

export const Moreaboutstudent = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const student = state;

    return (
        <div className="student-gallery-container">
            <h2>Student Details</h2>
            <div className="student-gallery">
                    <div className="student-card" key={student._id}>
                        <h3>{student.full_name}</h3>
                        <p><strong>Strime:</strong> {student.strime_name}</p>
                        <p><strong>Address:</strong> {student.address}</p>
                        <p><strong>Pincode:</strong> {student.pincode}</p>
                        <p><strong>Mobile No:</strong> {student.mobile_no}</p>
                        <p><strong>Parent No:</strong> {student.parent_mobileno}</p>
                        <p><strong>Birthdate:</strong> {new Date(student.birthdate).toLocaleDateString()}</p>
                        <p><strong>Last Education:</strong> {student.last_education}</p>
                        <p><strong>Education %:</strong> {student.last_education_percentage}%</p>
                        <p><strong>School/College:</strong> {student.school_or_college_name}</p>
                        <p><strong>Parent Occupation:</strong> {student.parent_occupation}</p>

                        <div className="student-photos">
                            <div>
                                <label>Cast Certificate:</label>
                                <img src={student.cast_certificate} alt="Cast Certificate" />
                            </div>
                            <div>
                                <label>Marksheet:</label>
                                <img src={student.marksheet} alt="Marksheet" />
                            </div>
                            <div>
                                <label>Admission Document:</label>
                                <img src={student.admission_document} alt="Admission Document" />
                            </div>
                            <div>
                                <label>Aadhar Card:</label>
                                <img src={student.student_adhar_card} alt="Aadhar Card" />
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};
