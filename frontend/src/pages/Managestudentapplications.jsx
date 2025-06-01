import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../pages-css/Managestudentapplication.css";

export const Managestudentapplication = () => {
    const [students, setStudents] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/students`);
            const studentsNotInMerit = res.data.students.filter(
                (student) => student.merit_status !== "in_merit"
            );
            setStudents(studentsNotInMerit);
            setFilteredStudents(studentsNotInMerit);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };
    

    useEffect(() => {
        fetchStudents();
    }, []);

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

    const viewdetail = (studentdata) => {
        navigate("/moreaboutstudent", { state: studentdata });
    }

    const handleShortList = async () => {
        try {
            const ids = filteredStudents.map(student => student._id);
            console.log("Sending IDs:", ids);

            await axios.put(`http://localhost:8000/api/students`, {
                ids: ids
            });

            alert("Students merit status updated successfully!");
            fetchStudents();
        } catch (error) {
            console.error("Error updating merit status:", error);
            alert("Failed to update merit status.");
        }
    };



    return (
        <div className="student-table-container">
            <h2>Student Records</h2>

            <div className="filter-section">
                <input
                    type="number"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Enter % to filter"
                />
                <button onClick={handleFilter}>Filter</button>
                <label>Count: {filteredStudents.length}</label>
                <div><button onClick={handleShortList}>ShortList</button></div>
            </div>

            <table className="student-table">
                <thead>
                    <tr>
                        <th>Sr.</th>
                        <th>Full Name</th>
                        <th>Strime Name</th>
                        <th>Last Education</th>
                        <th>Last Education %</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student, index) => (
                        <tr key={student._id}>
                            <td>{index + 1}</td>
                            <td>{student.full_name}</td>
                            <td>{student.strime_name}</td>
                            <td>{student.last_education}</td>
                            <td>{student.last_education_percentage}%</td>
                            <td>
                                <button onClick={() => viewdetail(student)}>More Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
