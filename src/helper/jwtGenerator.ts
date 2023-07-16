import jwt from "jsonwebtoken"

export const TokenGenerator  = (id: number) => {
  return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};