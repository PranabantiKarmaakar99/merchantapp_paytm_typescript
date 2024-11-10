"use strict";
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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
exports.merchantRouter = (0, express_1.Router)();
// Merchant Sign Up
exports.merchantRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, companyName } = req.body;
    try {
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const merchant = yield tx.merchant.create({
                data: {
                    username,
                    password,
                    email,
                    companyName
                }
            });
            yield tx.merchAccount.create({
                data: {
                    userId: merchant.id,
                    balance: 0,
                    locked: 0
                }
            });
            res.status(200).json({
                message: "Merchant Signed Up Successfully"
            });
        }));
    }
    catch (e) {
        console.error("Sign-up error:", e);
        res.status(403).json({
            message: "Error while signing up"
        });
    }
}));
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
