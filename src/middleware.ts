import {NextFunction, Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import { USER_JWT_PASS,MERCHANT_JWT_PASS } from './config';


export const userAuthMiddleware =(req:any,res:any, next:NextFunction)=> {

    const token = req.headers["authorization"] as unknown as string;

    const verified = jwt.verify(token,USER_JWT_PASS);


    if (verified) {

        //@ts-ignore
        req.id = verified.id;
        next();
        return;
    }
    else {
        return res.status(403).json({
            message:"Error while authentication!"
        })
    }

    


}

export const merchantAuthMiddleware =(req:any,res:any, next:NextFunction)=> {

    const token = req.headers["authorization"] as unknown as string;

    const verified = jwt.verify(token,MERCHANT_JWT_PASS) ;


    if (verified) {

        //@ts-ignore
        req.id = verified.id;
        next();
        return;
    }
    else {
        return res.status(403).json({
            message:"Error while authentication!"
        })
    }

    


}