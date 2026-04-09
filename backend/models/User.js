// File: ../models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true },
    // 🌟 ADDED: Role field with default 'user'
    role: { 
        type: String, 
        default: "user", 
        enum: ['user', 'admin'], 
        required: true 
    },
    // 🌟 ADDED: Status field with default 'active'
    status: { 
        type: String, 
        default: "active", 
        enum: ['active', 'suspended'], 
        required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);