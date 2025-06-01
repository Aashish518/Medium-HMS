import { Link } from 'react-router-dom';
import '../components-css/Navbar.css';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handlelogin = () => {
        if (token) {
            localStorage.removeItem("token");
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h1 className="navbar-h1">Hostel Management</h1>
                </div>

                <input type="checkbox" id="menu-toggle" className="menu-toggle" />
                <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>

                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/roomdetails">Rooms Details</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                    <button className="navbar-button" onClick={handlelogin}>
                        {token ? "Logout" : "Login"}
                    </button>
                </ul>
            </div>
        </nav>
    );
};
