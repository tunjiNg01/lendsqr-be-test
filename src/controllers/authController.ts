import { Request, Response, NextFunction } from "express";
import  systemError  from "../helper/systemError"
import knex from "../models/connectionConfig";
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken"; 
import { promisify } from "util";
import User from "../models/User"
import { TokenGenerator } from "../helper/jwtGenerator";
const {genSalt, hash} = bcrypt


/**
 * Login controller
 */
export const login = async (req: Request, res: Response, next:NextFunction) => {
  try {
    let { email, password } = req.body;
    email = email.trim()

    //1) check if the request body contains email and password
    if (!email || !password) {
      return next(new systemError("Please, enter your email and password", 400));
    }
   //2) Validate if password pattern is correct
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regexEmail) || email === "") {
       return next(
            new systemError("Invalid Request! Email address is invalid", 400)
        );
      }

    //3) fetch user with the email provided

    let result: Array<User> = await knex.select("email", "password", "_id").from("customer").where("email", email)

    //4) find if user with email exist
    if (result.length === 0 ) {
         return next(new systemError("User with this email does not exist", 404));
      } 
    
    //5) find if the password provided is correct
      if ( !(await bcrypt.compare(password, result[0].password))) {
        return next(new systemError("Invalid email or password", 400));
      }
    //6) Generate authentication token with JWT
    
    let token = TokenGenerator(result[0]._id)

    return res.status(200).json({
      status: "success",
      message: "logged in succesfully",
      token
    });
  } catch (error) {
    return next(new systemError("something went wrong", 400))
  }
   
  };
/**
 * Signup controller
 */
  export const signup = async (req: Request, res: Response, next:NextFunction) => {
    try {
      //1) deconstruct the request body
      let { email, password, firstname, lastname, address, country } = req.body;
      email = email.trim()
      //2) Check if user already exist

      let result: Array<User> = await knex.select("email").from("customer").where("email", email)


       //3) find if user with email exist
       if (result.length !== 0 ) {
         return next(new systemError("User with this email already exist", 400));
       } 
      //4) ash the password
      const salt = await genSalt(12);
      password = await hash(password, salt)
      //5) save user credential to db
      let newUserId = await knex("customer").insert({ email, password, firstname, lastname, address, country })
      //6) initialize wallet
      await knex("account").insert({ userId:newUserId , walletBalance:0.00 })
     return res.status(200).json({
       status: "success",
       message: "account created in succesfully"
     });

    } catch (error) {
      console.log(error);
      return next(new systemError("something went wrong", 400))
    }
   
  };

  /**
 * Token validator 
 */

  export const tokenValidator = async (req:Request, res:Response, next:NextFunction) => {
    try {
      let token;
     
      
   
      //1) Abstract the token from the authorization
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
    //2) check if token exist
      if (!token) {
        return next(new systemError("Unauthorize Request", 401));
      }
      //3) verify token
      let decodedId: any = jwt.verify(token, `${process.env.JWT_SECRET}`);
      
      let result: Array<User> = await knex.select().from("customer").where("_id",decodedId.id)
      if (result.length === 0 ) {
        return next(new systemError("User does not exist", 401));
      }
    
      req.body.user = result[0];
      next();
    } catch (error) {
      console.log(error);
      return next(new systemError("something went wrong", 400))
      
    }
   
  };