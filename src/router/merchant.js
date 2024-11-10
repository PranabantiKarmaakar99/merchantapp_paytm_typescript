"use strict";
// import {Router} from 'express';
// import {PrismaClient} from '@prisma/client';
// import jwt from "jsonwebtoken";
// import { JWT_PASS, MERCHANT_JWT_PASS, USER_JWT_PASS } from '../../config';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantRouter = void 0;
// const prisma = new PrismaClient();
// export const merchantRouter = Router();
// merchantRouter.post('/signin', async(req:any,res:any)=>{
//     const {username,password} = req.body;
//        const merchant = await prisma.merchant.findFirst({
//             where:{
//                 username,
//                 password
//             }
//         });
//         if (!merchant) {
//             res.status(403).json({
//                 message:"Error while signing up"
//             })
//         if (merchant) {
//             const token = jwt.sign ({
//                 id:merchant.id
//             },MERCHANT_JWT_PASS)
//         return res.status(200).json({
//             token:token
//         })
//         }}});
// merchantRouter.post('/signup', async(req,res)=>{
//     const {username,password,email,companyName} = req.body;
//     try{ 
//         await prisma.merchant.create({
//             data:{
//                 username,
//                 password,
//                 email,
//                 companyName
//             }
//         })
//         res.status(200).json({
//             message:"User Signed Up!"
//         })
//     }
//     catch(e){
//         res.status(403).json({
//             message: "Error while signing up",
//         })
//     }
// });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
exports.merchantRouter = (0, express_1.Router)();
// Merchant Sign In
exports.merchantRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const merchant = yield prisma.merchant.findFirst({
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
        const token = jsonwebtoken_1.default.sign({ id: merchant.id }, config_1.MERCHANT_JWT_PASS, { expiresIn: '1h' } // Optionally set token expiration
        );
        return res.status(200).json({
            token: token
        });
    }
    catch (error) {
        console.error("Sign-in error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Merchant Sign Up
exports.merchantRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, companyName } = req.body;
    try {
        yield prisma.merchant.create({
            data: {
                username,
                password,
                email,
                companyName
            }
        });
        return res.status(200).json({
            message: "User signed up successfully!"
        });
    }
    catch (error) {
        console.error("Sign-up error:", error);
        res.status(403).json({
            message: "Error while signing up"
        });
    }
}));
