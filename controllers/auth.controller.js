// this file have the logic to signup and signin the users

const bcrypt = require("bcryptjs");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");

/**
 * Create a function to allow the user to signup
 *
 * when a user calls the endpoint:
 * POST notesapplication/api/v1/auth/signup  , router should call the below method
 */
exports.signup = async (req, res) => {
  // logic to handle the signup
  try {
    const userObj = {
      userName: req.body.userName,
      email: req.body.email,
      userType: req.body.userType,
      password: bcrypt.hashSync(req.body.password, 9),
    };

    if(req.body.userType){
      userObj['userType'] = req.body.userType;
    }

    const savedUser = await User.create(userObj);

    const postResponse = {
      _id: savedUser._id,
      userName: savedUser.userName,
      email: savedUser.email,
      userType: savedUser.userType,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    res.status(200).send({
      data: postResponse,
      status: 200,
      message: 'Account Created successfully'
    });
  } catch (err) {
    console.log("Error while registering user ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};

/**
 * Create a function to allow the user to signin
 *
 * when a user calls the endpoint:
 * POST notesapplication/api/v1/auth/signin  , router should call the below method
 */
exports.signin = async (req, res) => {
  try {
    const userNameFromReq = req.body.userName;
    const passwordFromReq = req.body.password;

    // Ensure the userName is valid
    const userSaved = await User.findOne({ userName: userNameFromReq });

    if (!userSaved) {
      return res.status(401).send({
        message: "User Name given is not correct",
        status: 500
      });
    }

    // Ensure password mathes
    // Req paword is in plain string
    // Database password is hashed
    // So we compare using the bcrypt
    const isValidPassword = bcrypt.compareSync(
      passwordFromReq,
      userSaved.password
    );

    if (!isValidPassword) {
      return res.status(401).send({
        message: "Incorrect password given",
        status: 500
      });
    }

    // We generate the access token (JWT based)
    const token = jwt.sign(
      {
        id: userSaved._id,
      },
      authconfig.secret,
      { expiresIn: "2h" }
    );

    // send the res back
    res.status(200).send({
      status: 200,
      data:
      {
        _id: userSaved._id,
        userName: userSaved.userName,
        email: userSaved.email,
        userType: userSaved.userType,
        accesstoken: token,
      },
      message: "Login successfully",
    });
  } catch (err) {
    console.log("Error while sign in ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};
