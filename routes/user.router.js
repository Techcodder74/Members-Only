import express from "express";
import Uc from "../controllers/user.controller.js"

import authenticate from "../middleware/authenticated.middleware.js"
const Router = express.Router();
Router.route("/signup")
      .get(Uc.getSignup)
      .post(Uc.postSignup)

Router.route("/login")
      .get(Uc.getlogin)
      .post(Uc.postlogin)

Router.route("/joinClub")
      .get(authenticate, Uc.getjoinClub)
      .post(authenticate, Uc.postjoinClub);

Router.get("/logout", authenticate, Uc.logout);







export default Router;
