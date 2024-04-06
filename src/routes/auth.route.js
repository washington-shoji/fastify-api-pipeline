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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/register', auth_controller_1.registerController);
        fastify.post('/login', auth_controller_1.loginController);
        fastify.post('/refresh-token', auth_controller_1.refreshTokenController);
        fastify.post('/logout', auth_controller_1.logoutController);
    });
}
exports.default = authRoutes;
