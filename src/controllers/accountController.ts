import {Request, Response, NextFunction } from "express"
import knex from "../models/connectionConfig"
import SystemError from "../helper/systemError"

export  const fundAccount = async (req: Request, res: Response, next: NextFunction) => {
   try {
     //1) deconstruct request body
     let { amount, user} = req.body
    
     
     //2) check if the amount is defined
     if (!amount) {
         return next(new SystemError("Invalid request", 400))
     }
     amount = parseFloat(amount)
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
    console.log(error);
    return res.status(200).json({
        status: "success",
        message: "your transaction was successful",
      });
   }
   

  
}

export  const transferFunds = async (req: Request, res: Response, next: NextFunction) => {
    try {
          //1) deconstruct request body
     let {designatedAccountId, amount, user} = req.body
     //2) check if the amount is defined
     if (!amount) {
        return next(new SystemError("Invalid request", 400))
    }

    amount = parseFloat(amount)
      //3) perform transaction
      await knex.transaction(async transact => {

        const balanceData = await transact.select("walletBalance", "_id").from("account").where("userId", user._id)
        if (balanceData[0].walletBalance >= amount) {
            const newBalance = balanceData[0].walletBalance - amount
            await transact("account").update("walletBalance", newBalance).where("_id", balanceData[0]._id)
            await transact("transactionHistory").insert({userId:user._id, balance: newBalance, amount: amount, type: "debit" })

        }else {

        }
          const accountToTransfer = await transact.select("walletBalance", "_id").from("account").where("userId", designatedAccountId)
          const balanceAfterTransfer = accountToTransfer[0].walletBalance + amount
          await transact("account").update("walletBalance", balanceAfterTransfer).where("userId", designatedAccountId)
          await transact("transactionHistory").insert({userId: designatedAccountId, balance: balanceAfterTransfer, amount: amount, type: "credit" })
        })
 
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: "success",
            message: "your transaction was successful",
          });
        
    }
  
}

export  const withdrawFunds = async (req: Request, res: Response, next: NextFunction) => {
    
}