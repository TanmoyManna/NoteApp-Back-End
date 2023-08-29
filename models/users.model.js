// this file will contain the chema of the user

const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true
    },
    userType: {
        type: String,
        required: true,
        default: "USER",
        enum: ['ADMIN', 'USER']
    },
    createdAt: {
        type: Date,
        default: () => {
            return Date.now()
        },
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now()
        }
    }
});
module.exports = mongoose.model("Users", usersSchema);