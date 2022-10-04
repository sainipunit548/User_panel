const mongoose = require("mongoose");
const validator = require("validator");

const User_Data = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        validate(email) {
            if (!validator.isEmail(email)){
                throw new Error("Invalid Email");
            }
        }
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
})

const User_Detail = new mongoose.model("User_Detail", User_Data);

module.exports = User_Detail;