import express from "express";
// const auth = require("../controllers/authController");

import {login, signup} from "../controllers/authController"


const routes = express.Router();
// routes.post("/login", auth.login )
routes.get("/login", login )
routes.get("/signup", signup )

//
module.exports = routes;
