// Middleware to validate the User req body
const User = require("../models/users.model");

const validateUsersBody = async (req, res, next) => {
    if (!req.body.userName) {
        return res.status(400).send({
            message: "User Name is missing.",
            status: 400
        });
    }
    
    if(req.body.userName.length < 6){
        return res.status(400).send({
            message: "User Name should have at least 6 characters.",
            status: 400
        });
    }
    const checkUserName = await User.findOne({ userName: req.body.userName });
    if(checkUserName){
        return res.status(400).send({
            message: "User Name taken, Choose another User Name.",
            status: 400
        });
    }

    if (!req.body.email) {
        return res.status(400).send({
            message: "Email is missing.",
            status: 400
        });
    }
    const checkEmail = await User.findOne({ email: req.body.email });
    if(checkEmail){
        return res.status(400).send({
            message: "Email taken, Choose another Email.",
            status: 400
        });
    }

    if (!req.body.password) {
        return res.status(400).send({
            message: "Password is missing.",
            status: 400
        });
    }
    if(req.body.password < 6){
        return res.status(400).send({
            message: "Password should have at least 6 characters.",
            status: 400
        });
    }

    next();
};

module.exports = {
    validateUsersBody: validateUsersBody
};
