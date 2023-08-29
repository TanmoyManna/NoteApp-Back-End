const jwt = require("jsonwebtoken");
const authconfig = require("../configs/auth.config");
const Note = require("../models/notes.model");
const User = require("../models/users.model");

// Middleware to validate the access token
const verifytoken = (req, res, next) => {
  // if the token is present
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: "Access token is missing",
      status: 401
    });
  }

  // if the token is valid
  jwt.verify(token, authconfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid Access Token",
        status: 401
      });
    }
    // Fatch the userId from the token and set it to the request object
    req.userId = decoded.id;
    next();
  });
};

const checkUserType = async (req, res, next) => {
  const callingUser = await User.findById(req.userId);
  if (!callingUser) {
    return res.status(404).send({
      message: "Can't find your information right now. Please try again !",
      status: 404
    });
  }
  req.userType = callingUser.userType;
  next();
};

const isOwnerOrAdmin = async (req, res, next) => {
  const callingUser = await User.findById(req.userId);
  if (!callingUser) {
    return res.status(404).send({
      message: "Can't find your information right now. Please try again !",
      status: 404
    });
  }

  const noteTryingToAccess = await Note.findById(req.params.id);
  if (!noteTryingToAccess) {
    return res.status(404).send({
      message: "Note with the given id is not found",
      status: 401
    });
  }

  if (callingUser.userType == 'ADMIN') {
    next();
  }
  else{
    if (noteTryingToAccess.createdBy.equals(callingUser._id)) {
      next();
    } else {
      return res.status(403).send({
        message: "Only Admin and Owner of this Note is authorized",
        staus: 403
      });
    }
  }  
};

module.exports = {
  verifytoken: verifytoken,
  checkUserType: checkUserType,
  isOwnerOrAdmin: isOwnerOrAdmin,
};
