import { Link, useLocation } from 'react-router-dom';
import '../components-css/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Navbar = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlelogin = () => {
        if (token) {
            localStorage.removeItem("token");
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavClick = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Left side - Title */}
                <div className="navbar-left">
                    <Link to="/" className="logo-link" onClick={handleNavClick}>
                        <div className="logo-section">
                            <div className="logo-icon">🏠</div>
                            <h1 className="navbar-h1">Hostel Management</h1>
                        </div>
                    </Link>
                </div>

                {/* Right side - Navigation links and menu toggle */}
                <div className="navbar-right">
                    <input 
                        type="checkbox" 
                        id="menu-toggle" 
                        className="menu-toggle"
                        checked={isMenuOpen}
                        onChange={handleMenuToggle}
                    />
                    <label htmlFor="menu-toggle" className="menu-icon">
                        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                    </label>

                    <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                        <li>
                            <Link 
                                to="/" 
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                                onClick={handleNavClick}
                            >
                                <span className="nav-icon">🏠</span>
                                <span className="nav-text">Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/roomdetails" 
                                className={`nav-link ${isActive('/roomdetails') ? 'active' : ''}`}
                                onClick={handleNavClick}
                            >
                                <span className="nav-icon">🏢</span>
                                <span className="nav-text">Rooms Details</span>
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/profile" 
                                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                                onClick={handleNavClick}
                            >
                                <span className="nav-icon">👤</span>
                                <span className="nav-text">Profile</span>
                            </Link>
                        </li>
                        <li>
                            <button 
                                className={`navbar-button ${token ? 'logout' : 'login'}`} 
                                onClick={handlelogin}
                            >
                                <span className="button-icon">
                                    {token ? '🚪' : '🔑'}
                                </span>
                                <span className="button-text">
                                    {token ? "Logout" : "Login"}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
