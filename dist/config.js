"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MERCHANT_JWT_PASS = exports.USER_JWT_PASS = exports.JWT_PASS = void 0;
exports.JWT_PASS = process.env.JWT_PASS || '123123';
exports.USER_JWT_PASS = exports.JWT_PASS + 'user';
exports.MERCHANT_JWT_PASS = exports.JWT_PASS + 'merchant';
