import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import "../pages-css/Profile.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
    const token = localStorage.getItem("token");
    const [profile, setProfile] = useState("");
    const navigate = useNavigate();
    console.log(profile)

    useEffect(() => {
        getuserdata();
    },[])

    const getuserdata = async() => {
        try{
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getuser`, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })

            if (res.data.userdata) {
                setProfile(res.data.userdata);
            }
        }catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        alert('Profile updated successfully!');
    };

    const handlereview = () => {
        navigate("/review", { state: { userid: profile._id } });
    };
    

    return (
        <>
        <Navbar/>
        <div className="profilepage-container">
            <aside className="profilepage-sidebar">
                <h2 className="profilepage-logo">MyApp</h2>
                    <nav className="profilepage-nav">
                        {profile.role === "admin" ? (
                            <a onClick={() => navigate("/admindashboard")}>Admin Dashboard</a>
                        ) : (
                            <>
                                <div onClick={handlereview}>Review</div>
                                    <a onClick={() => navigate("/complaints")}>Complaints</a>
                            </>
                        )}
                    </nav>
            </aside>

            <main className="profilepage-main">
                <div className="profilepage-card">
                    <div className="profilepage-header">
                        <img
                            src={profile.photo}
                            alt="Profile"
                            className="profilepage-picture"
                        />
                    </div>

                    <div className="profilepage-form">
                        <div className="profilepage-form-group">
                                <label>Name:{profile.full_name}</label>
                        </div>

                        <div className="profilepage-form-group">
                                <label>Email:{profile.email}</label>
                        </div>

                        <div className="profilepage-form-group">
                                <label>Phone:{profile.mobile_no}</label>
                        </div>

                        <div className="profilepage-form-group">
                                <label>Role:{profile.role}</label>
                        </div>

                    </div>
                </div>
            </main>
            </div>
        </>
    );
};

