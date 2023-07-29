import { Request, Response, NextFunction } from "express";
import SystemError from "./systemError";
const sendErrorDev = (err: SystemError, res: Response) =>{
    res.status(err.statusCode).json({ 
        status: err.status,
        message: err.message,
       stack: err.stack
    });
}
const sendErrorProd = (err:SystemError, res: Response) =>{
    if (err.isOperational) {
        res.status(err.statusCode).json({ 
            status: err.status,
            message: err.message,
            // stack: err.stack
        });
        
    }else{
        console.error('Error', err);
        res.status(500).json({ 
            status: 'error',
            message: 'something went wrong',
          
        });
    }
   
}


export const errorHandler = (err:SystemError , req: Request, res:Response, next: NextFunction) => {
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "500";


    if(process.env.NODE_ENV == 'development'){
        sendErrorDev(err, res)
    }else if(process.env.NODE_ENV == 'production'){
        
        sendErrorProd(err, res);
    }
    
}