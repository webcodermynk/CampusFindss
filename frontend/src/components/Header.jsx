import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const NAV_ITEMS = [
    { label: 'Home', page: 'home' },
    { label: 'Lost Items', page: 'lostItems' },
    { label: 'Found Items', page: 'foundItems' },
    { label: 'Report Item', page: 'report' },
    { label: 'Contact', page: 'contact' }
];

const Header = ({ showPage, currentPage, userName, userEmail, onLogout, darkMode, toggleDarkMode }) => {
    const [showUserCard, setShowUserCard] = useState(false);
    const userCardRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getAvatarUrl = (email, name) => {
        if (!email) {
            return 'https://ui-avatars.com/api/?name=Guest&size=40&background=6c757d&color=ffffff&bold=true';
        }
        const initials = name ? name.split(' ').map(n => n[0]).join('') : 'U';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || initials)}&size=40&background=3498db&color=ffffff&bold=true`;
    };

    const avatarUrl = getAvatarUrl(userEmail, userName);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const userAvatar = document.querySelector('.user-avatar-button');
            if (userCardRef.current &&
                !userCardRef.current.contains(event.target) &&
                userAvatar &&
                !userAvatar.contains(event.target)
            ) {
                setShowUserCard(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleLinkClick = (page) => {
        showPage(page);
        setIsMenuOpen(false);
    };

    return (
        <div className="header-spacer">
            <nav className="app-navbar-fixed" role="navigation" aria-label="Main">
                <div className="app-header-container">

                    {/* Branding */}
                    <a className="app-branding" href="#" onClick={() => handleLinkClick('home')}>
                        <i className="fas fa-search me-2"></i>CampusFinds
                    </a>

                    {/* Mobile Toggler */}
                    <button
                        className={`navbar-toggler ${isMenuOpen ? 'is-active' : ''}`}
                        type="button"
                        aria-label="Toggle navigation"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="toggler-line"></span>
                        <span className="toggler-line"></span>
                    </button>

                    {/* Nav + User */}
                    <div className={`app-nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
                        <ul className="nav-list" role="menubar">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.page} role="none">
                                    <a
                                        role="menuitem"
                                        className={`nav-link-item ${currentPage === item.page ? 'active' : ''}`}
                                        href={`#${item.page}`}
                                        onClick={() => handleLinkClick(item.page)}
                                    >
                                        {item.label}
                                        <span className="link-underline"></span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Dark mode toggle + User avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {/* Dark mode toggle */}
                            <button
                                className={`dark-mode-toggle ${darkMode ? 'dark' : ''}`}
                                onClick={toggleDarkMode}
                                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                aria-label="Toggle dark mode"
                            />

                            <div className="user-profile-section" ref={userCardRef}>
                                <button
                                    className="user-avatar-button"
                                    onClick={() => setShowUserCard(!showUserCard)}
                                    aria-label="User menu"
                                >
                                    <img src={avatarUrl} alt={userName} className="user-avatar-image" />
                                </button>

                                {showUserCard && (
                                    <div className="user-card-popover">
                                        <p className="user-name-text">Hello, {userName}</p>
                                        <button
                                            className="logout-button"
                                            onClick={() => {
                                                setShowUserCard(false);
                                                onLogout && onLogout();
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    );
};

export default Header;
