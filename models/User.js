const mongoose = require("mongoose");
const { Schema } = mongoose;
const { db } = require("../services/database");

const userSchema = new Schema({
  // Primary information
  firstName: { 
    type: String, 
    required: [true, "FirstName value not provided"] 
  },
  lastName: { 
    type: String, 
    required: [true, "LastName value not provided"] 
  },
  email: { 
    type: String, 
    required: [true, "Email value not provided"], 
    unique: true, 
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },  
  roles: { 
    type: [String], 
    enum: { values: ['ADMIN', 'USER'], message: '{VALUE} is not a valid genre.' },
    required: [true, "roles value not provided"]
  },
  password: {
    type: String, 
    required: [true, "Password value not provided"],
    validate: {
      validator: (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password),
      message: 'Password must be at least 8 characters long and contain at least one capital letter and one digit.',
    },
  }
});

const User = db.model('users', userSchema);

module.exports = { User };