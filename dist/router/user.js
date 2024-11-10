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
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const prisma = new client_1.PrismaClient();
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findFirst({
        where: {
            username,
            password
        }
    });
    if (!user) {
        return res.json({
            message: "User not found."
        });
    }
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            id: user.id
        }, config_1.USER_JWT_PASS);
        return res.status(200).json({
            token
        });
    }
}));
exports.userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstName, lastName } = req.body;
    try {
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield tx.user.create({
                data: {
                    username,
                    password,
                    firstName,
                    lastName,
                }
            });
            yield tx.userAccount.create({
                data: {
                    userId: user.id,
                    balance: 0,
                    locked: 0
                }
            });
            res.status(200).json({
                message: "Signed Up Successfully"
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
//Add money from bank to user's wallet
exports.userRouter.post('/onramp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body;
    const account = yield prisma.userAccount.update({
        where: {
            userId
        },
        data: {
            balance: {
                increment: amount
            }
        }
    });
    if (!account) {
        return res.json({
            message: "Account doesn't exist"
        });
    }
    return res.json({
        message: "on Ramped"
    });
}));
//Transfer money from user's wallet to the merchant
exports.userRouter.post('/transfer', middleware_1.userAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //from input
    const { merchantid, amount } = req.body;
    //@ts-ignore
    const userid = req.id;
    const paymentDone = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userAccount = yield tx.userAccount.findFirst({
            where: {
                userId: userid
            }
        });
        if (((userAccount === null || userAccount === void 0 ? void 0 : userAccount.balance) || 0) < amount) {
            return false;
        }
        yield tx.merchAccount.update({
            where: {
                userId: merchantid
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });
        yield tx.userAccount.update({
            where: {
                userId: userid
            },
            data: { balance: {
                    decrement: amount
                }
            }
        });
        return true;
    }));
    if (paymentDone) {
        res.json({
            message: "payment done!"
        });
    }
    else {
        res.status(403).json({
            message: "insufficient funds"
        });
    }
}));
