import React, { useState } from 'react';

const Footer = ({ showPage }) => {
    const [rating, setRating] = useState(0);

    return (
        <footer className="pt-5 pb-3">
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-lg-4 mb-4">
                        <h5>About CampusFinds</h5>
                        <p>
                            A platform dedicated to helping students recover lost items and return found belongings to their rightful owners.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-4 mb-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" onClick={() => showPage('home')}>Home</a></li>
                            <li><a href="#" onClick={() => showPage('lostItems')}>Lost Items</a></li>
                            <li><a href="#" onClick={() => showPage('foundItems')}>Found Items</a></li>
                            <li><a href="#" onClick={() => showPage('report')}>Report Item</a></li>
                            <li><a href="#" onClick={() => showPage('contact')}>Contact</a></li>
                        </ul>
                    </div>

                    {/* Feedback & Rating Section */}
                    <div className="col-lg-4 mb-4">
                        <h5>Feedback & Rating</h5>
                        <p className="mb-2">We value your thoughts! Share your feedback below:</p>
                        <textarea
                            className="form-control mb-2"
                            rows="2"
                            placeholder="Write your feedback..."
                        ></textarea>

                        <div className="d-flex align-items-center mb-2">
                            <span className="me-2">Rate us:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`fa-star fa ${rating >= star ? "fas text-warning" : "far text-muted"}`}
                                    style={{ cursor: "pointer", marginRight: "5px" }}
                                    onClick={() => setRating(star)}
                                ></i>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-sm">Submit Feedback</button>
                    </div>
                </div>

                <hr />

                {/* Footer Bottom */}
                <div className="text-center">
                    <p className="mb-1">&copy; 2025 CampusFinds. All rights reserved.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                        Built with ❤️ by <strong>Rohit Negi</strong> & <strong>Mayank Aneja</strong>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
