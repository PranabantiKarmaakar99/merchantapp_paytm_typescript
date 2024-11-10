import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
import jwt from "jsonwebtoken";
import { USER_JWT_PASS } from '../config';
import {userAuthMiddleware} from "../middleware";

const prisma = new PrismaClient();
export const userRouter = Router();


userRouter.post('/signin',async(req:any,res:any) => {

const {username, password} = req.body;

const user = await prisma.user.findFirst({
    where:{
        username,
        password
    }
});

if (!user) {
    return res.json({
        message:"User not found."
    })
}

if (user) {
    const token = jwt.sign({
        id:user.id
    },USER_JWT_PASS);

    return res.status(200).json({
        token
    })
}

})

userRouter.post('/signup',async(req,res)=>{

    const {username,password,firstName,lastName} = req.body;

    try{
        

        await prisma.$transaction(async(tx)=>{



        const user = await tx.user.create({
            data:{
                username,
                password,
                firstName,
                lastName,
                

            }
        })

        await tx.userAccount.create({
            data:{

                userId:user.id,
                balance:0,
                locked:0

            }
        })

        res.status(200).json({
            message:
            "Signed Up Successfully"
        }) })

    }catch(e){
        console.error("Sign-up error:", e);
        res.status(403).json({
            message:
                "Error while signing up"
            
        })

    }



    
})


//Add money from bank to user's wallet
userRouter.post('/onramp',async(req:any,res:any)=>{
     
    const {userId,amount} = req.body;

  const account = await prisma.userAccount.update({

        where:{
            userId
        },
        data :{
            balance:{
                increment:amount
            }
        }


    })

    if (!account) {
        return res.json({
            message:"Account doesn't exist"
        })
    }

    return res.json({
        message:"on Ramped"
    })





})

//Transfer money from user's wallet to the merchant

userRouter.post('/transfer',userAuthMiddleware,async (req,res)=>{
     

    //from input
    const {merchantid , amount} = req.body;

    //@ts-ignore
    const userid = req.id;

     const paymentDone =await prisma.$transaction(async(tx)=>{

       const userAccount = await tx.userAccount.findFirst({
           where:{
            userId:userid
           } 
        })

        if ((userAccount?.balance||0)<amount) {
            return false
        }

        await tx.merchAccount.update({
            where:{
                userId:merchantid
            },
            data:{
                balance:{
                    increment:amount
                }
            }

        })

        await tx.userAccount.update({
            where:{

                userId:userid

            },
            data:{ balance:{

                decrement:amount

            }
                
            }
        })
        
        return true
    });

    if (paymentDone) {
        res.json({
            message:"payment done!"
        })
    }
    else {
        res.status(403).json({
            message:"insufficient funds"
        })
    }


})












