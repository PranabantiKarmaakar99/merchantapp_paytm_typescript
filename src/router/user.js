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
const config_1 = require("../../config");
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
            message: "User not find."
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
        yield prisma.user.create({
            data: {
                username,
                password,
                firstName,
                lastName
            }
        });
        res.status(200).json({
            message: "Signed Up Successfully"
        });
    }
    catch (e) {
        res.status(403).json({
            message: "Error while signing up"
        });
    }
}));
