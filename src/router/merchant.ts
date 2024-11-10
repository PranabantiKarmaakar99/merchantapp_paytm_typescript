
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken";
import { MERCHANT_JWT_PASS } from '../config';

const prisma = new PrismaClient();
export const merchantRouter = Router();



// Merchant Sign Up


merchantRouter.post('/signup',async(req,res)=>{

    const {username,password,email,companyName} = req.body;

    try{
        

        await prisma.$transaction(async(tx)=>{



        const merchant = await tx.merchant.create({
            data:{
                username,
                password,
                email,
                companyName
                

            }
        })

        await tx.merchAccount.create({
            data:{

                userId:merchant.id,
                balance:0,
                locked:0

            }
        })

        res.status(200).json({
            message:
            "Merchant Signed Up Successfully"
        }) })

    }catch(e){
        console.error("Sign-up error:", e);
        res.status(403).json({
            message:
                "Error while signing up"
            
        })

    }



    
})

// Merchant Sign In
merchantRouter.post('/signin', async (req:any, res:any) => {
    const { username, password } = req.body;

    try {
        const merchant = await prisma.merchant.findFirst({
            where: {
                username,
                password
            }
        });

        if (!merchant) {
            return res.status(403).json({
                message: "Error while signing in. Invalid credentials."
            });
        }

        const token = jwt.sign(
            { id: merchant.id },
            MERCHANT_JWT_PASS,
            { expiresIn: '1h' } // Optionally set token expiration
        );

        return res.status(200).json({
            token: token
        });
    } catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



