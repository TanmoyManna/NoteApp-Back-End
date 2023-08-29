/**
 * This will have the logic to route the request to different controllers
 */

const authController = require("../controllers/auth.controller");
const userMiddleWare = require("../middlewares/user.middleware");

module.exports = (app) => {

    /**
     * Define the route for sign up
     * 
     * POST /notesapplication/api/v1/auth/signup -> auth controller sign up method
     */
    app.post("/notesapplication/api/v1/auth/signup", [userMiddleWare.validateUsersBody], authController.signup);


    /**
    * Define the route for sign in
    * 
    * POST /notesapplication/api/v1/auth/signin -> auth controller sign up method
    */
    app.post("/notesapplication/api/v1/auth/signin", authController.signin);

}