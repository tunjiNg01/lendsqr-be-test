import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
const app: Express = express()
import authRoute from "./routes/authRoute"
import accountRoute from "./routes/accountRoute"
import SystemError from "./helper/systemError";
import { errorHandler } from "./helper/errorHandler";

app.use(helmet())
app.use(cors({origin: true}))



// LIMITING NUMBER OF CALL FROM ONE IP

let limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: "Too many Request from this IP Address try again in an hour",
  });

  app.use("/api", limiter);

// TO ACCESS THE BODY
app.use(express.json());
// cookie parser
app.use(cookieParser());
// log route to the console in develepment mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


  
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/account", accountRoute )
// captured all routes
app.all("*", (req, res, next) => {
    next(new SystemError(`can't find ${req.originalUrl} on this server!`, 400));
  });

app.use(errorHandler);
export default app
