import {Request, Response, NextFunction } from "express"
import knex from "../models/connectionConfig"
import SystemError from "../helper/systemError"

export  const fundAccount = async (req: Request, res: Response, next: NextFunction) => {
   try {
     //1) deconstruct request body
     let { amount, user} = req.body
    
     
     //2) check if the amount is defined
     if (!amount || amount < 0 || typeof amount !== "number") {
         return next(new SystemError("Invalid request", 400))
     }
     //3) perform transaction
    await knex.transaction(async transact => {
        const balanceData = await transact.select("walletBalance", "_id").from("account").where("userId", user._id)
       const newBalance = balanceData[0].walletBalance + amount
       await transact("account").update("walletBalance", newBalance).where("_id", balanceData[0]._id)
       await transact("transactionHistory").insert({userId:user._id, balance: newBalance, amount: amount, type: "credit" })
       
      })

    return res.status(200).json({
        status: "success",
        message: "your transaction was successful",
      });
   } catch (error) {
    // console.log(error);
    return res.status(200).json({
        status: "success",
        message: "your transaction was not successful",
      });
   }
   

  
}

export  const transferFunds = async (req: Request, res: Response, next: NextFunction) => {
    try {
          //1) deconstruct request body
     let {designatedAccountId, amount, user} = req.body
     //2) check if the amount is defined
     if (!amount || !designatedAccountId || amount < 0 || designatedAccountId <= 0 || typeof amount !== "number" || typeof designatedAccountId !== "number") {
        return next(new SystemError("Invalid request", 400))
    }

      //3) perform transaction
      await knex.transaction(async transact => {

        const balanceData = await transact.select("walletBalance", "_id").from("account").where("userId", user._id)
        
        if (balanceData[0].walletBalance >= amount) {
           // deduct amount from user account and record it
            const newBalance = balanceData[0].walletBalance - amount
           await transact("account").update("walletBalance", newBalance).where("_id", balanceData[0]._id)
           
            await transact("transactionHistory").insert({userId:user._id, balance: newBalance, amount: amount, type: "debit" })
           // add amount to the designated account and record it
            const accountToTransfer = await transact.select("walletBalance", "_id").from("account").where("userId", designatedAccountId)
            const balanceAfterTransfer = accountToTransfer[0].walletBalance + amount
            await transact("account").update("walletBalance", balanceAfterTransfer).where("userId", designatedAccountId)
            await transact("transactionHistory").insert({userId: designatedAccountId, balance: balanceAfterTransfer, amount: amount, type: "credit" })
        }else {
          transact.rollback(new SystemError("Insufficient balance", 400))
        }
         
        })
        return res.status(200).json({
          status: "success",
          message: "your transaction was successful",
        });
 
    } catch (error) {
        // console.log(error);
        return res.status(200).json({
            status: "success",
            message: "your transaction was not successful",
          });
        
    }
  
}

export  const withdrawFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //1) deconstruct request body
    let { amount, user} = req.body;
   
    
    //2) check if the amount is defined
    if (!amount || amount < 0 || typeof amount !== "number") {
        return next(new SystemError("Invalid request", 400))
    }
    //3) perform transaction
   await knex.transaction(async transact => {
       const balanceData = await transact.select("walletBalance", "_id").from("account").where("userId", user._id)
       //check if balance is greater than amount and perform transaction
       if (balanceData[0].walletBalance >= amount) {
        const newBalance = balanceData[0].walletBalance - amount
        await transact("account").update("walletBalance", newBalance).where("_id", balanceData[0]._id)
        await transact("transactionHistory").insert({userId:user._id, balance: newBalance, amount: amount, type: "debit" })
       
        
       }else{
        transact.rollback(new SystemError("invalid amount provided", 400))
       }
     })
     return res.status(200).json({
      status: "success",
      message: "your withdrawal was successful",
    });

   
  } catch (error) {
  //  console.log(error);
   return res.status(200).json({
       status: "success",
       message: "your transaction was not successful due to insufficient balance",
     });
  }
}

export const paymentGateway = async (req: Request, res: Response, next: NextFunction) => {
  // this is where payment gateway integration can comes in
  console.log("process payment...");
  console.log("payment processing is successful");

  next()
  
}