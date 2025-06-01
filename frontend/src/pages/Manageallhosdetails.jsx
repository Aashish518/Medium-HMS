import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../pages-css/Manageallhosdetails.css";

export const Manageallhosdetails = () => {

    const [hosDetails, setHosDetails] = useState([]);
    const [newRule, setNewRule] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFoodDay, setNewFoodDay] = useState("");
    const [newMealName, setNewMealName] = useState("");
    const [newMealTime, setNewMealTime] = useState("");
    const [newMealMenu, setNewMealMenu] = useState("");

    const fetchHosDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_LINK}/api/getallhosdetails`);
            setHosDetails(res.data.allhosdetails);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchHosDetails();
    }, []);

    const handleAddRule = async () => {
        if (!newRule) return alert("Please enter a rule.");
        try {
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/rules`, { rule: newRule });
            setNewRule("");
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddRoomPhoto = async (id) => {
        if (!selectedFile) return alert("Please select a photo.");
        const formData = new FormData();
        formData.append("room_photo", selectedFile);

        try {
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/roomphotos`, formData);
            setSelectedFile(null);
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddFoodDetail = async () => {
        if (!newFoodDay || !newMealName || !newMealTime || !newMealMenu)
            return alert("Please fill all food details.");

        try {
            await axios.post(`${import.meta.env.VITE_BACK_LINK}/api/fooddetails`, {
                day: newFoodDay,
                meal_name: newMealName,
                time: newMealTime,
                menu: newMealMenu.split(","),
            });
            setNewFoodDay("");
            setNewMealName("");
            setNewMealTime("");
            setNewMealMenu("");
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteRule = async (name) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${name}/rules`);
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRoomPhoto = async (name) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${name}/roomphotos`);
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteFoodDetail = async (name) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACK_LINK}/api/${name}/fooddetails`);
            fetchHosDetails();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="manageallhosdetail-container">
                {hosDetails.map((detail, index) => (
                    <div className="manageallhosdetail-card" key={index}>
                        <h3 className="manageallhosdetail-title">Hostel Rules:</h3>
                        <ul className="manageallhosdetail-list">
                            {detail.hostel_rules.map((rule, idx) => (
                                <li key={idx}>{rule}<button onClick={() => handleDeleteRule(rule)}>Delete</button></li>
                            ))}
                        </ul>
                        <div className="manageallhosdetail-inline">
                            <input
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Add rule"
                            />
                            <button onClick={handleAddRule}>Add Rule</button>
                        </div>

                        <h3 className="manageallhosdetail-title">Room Photos:</h3>
                        <div className="manageallhosdetail-photos">
                            {detail.room_photos.map((photo, idx) => (
                                <div key={idx}>
                                    <img
                                        src={photo}
                                        alt={`room ${idx}`}
                                        className="manageallhosdetail-photo"
                                    />
                                    <button onClick={() => handleDeleteRoomPhoto(idx)}>Delete</button>
                                </div>
                            ))}
                        </div>
                        <div className="manageallhosdetail-inline">
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <button onClick={handleAddRoomPhoto}>Add Photo</button>
                        </div>

                        <h3 className="manageallhosdetail-title">Food Details:</h3>
                        <ul className="manageallhosdetail-foodlist">
                            {detail.food_details.map((food, idx) => (
                                <li key={idx}>
                                    <strong>{food.day}</strong>
                                    <ul>
                                        {food.meals.map((meal, mealIdx) => (
                                            <li key={mealIdx}>
                                                {meal.meal_name} at {meal.time}: {meal.menu.join(", ")}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={() => handleDeleteFoodDetail(food.day)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                        <div className="manageallhosdetail-foodform">
                            <input
                                value={newFoodDay}
                                onChange={(e) => setNewFoodDay(e.target.value)}
                                placeholder="Day"
                            />
                            <input
                                value={newMealName}
                                onChange={(e) => setNewMealName(e.target.value)}
                                placeholder="Meal Name"
                            />
                            <input
                                value={newMealTime}
                                onChange={(e) => setNewMealTime(e.target.value)}
                                placeholder="Time"
                            />
                            <input
                                value={newMealMenu}
                                onChange={(e) => setNewMealMenu(e.target.value)}
                                placeholder="Menu (comma separated)"
                            />
                            <button onClick={handleAddFoodDetail}>Add Food</button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};
