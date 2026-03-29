// src/pages/login/RegisterPage.jsx (Updated)

import React, { useState } from "react";
import axios from "axios";

const RegisterPage = ({ showPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId
      });
      if (res.status === 201) {
        alert("✅ Registration successful! Please login.");
        showPage("login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="p-0"> 
      
      {/* PROFESSIONAL TITLE: Used a deeper color and heavier font weight */}
      <h3 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '700' }}>
        Create Student Profile
      </h3> 

      <form onSubmit={handleSubmit}>
        {/* INPUT FIELDS: Using mb-2 for compactness and adding custom professional borders/focus styles (assuming global CSS handles .form-control:focus for a modern blue glow) */}
        <div className="mb-2">
          <input id="name" type="text" className="form-control rounded-pill px-3 py-2" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input id="email" type="email" className="form-control rounded-pill px-3 py-2" placeholder="Institutional Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input id="password" type="password" className="form-control rounded-pill px-3 py-2" placeholder="Create Password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <input id="confirmPassword" type="password" className="form-control rounded-pill px-3 py-2" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div className="mb-4"> {/* Increased mb-4 here for better visual separation before the button */}
          <input id="studentId" type="text" className="form-control rounded-pill px-3 py-2" placeholder="Student ID (Required)" value={formData.studentId} onChange={handleChange} required />
        </div>
        
        {/* BUTTON: Changed to rounded-pill and added a subtle shadow for a modern CTA look */}
        <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 shadow-sm" style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
          REGISTER ACCOUNT
        </button>
      </form>

      <hr className="my-4 text-muted" /> {/* Separator for visual clarity */}
      
      {/* LOGIN LINK: Cleaned up link styling and centered text */}
      <p className="text-center text-muted m-0 small">
        Already have an account? 
        <button 
          type="button" 
          className="btn btn-link p-0 ms-1 fw-semibold text-decoration-none" 
          onClick={() => showPage("login")} 
          style={{ color: '#007bff' }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;