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
const uploadfile_controller_1 = require("../controllers/uploadfile.controller");
function fileUploadRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Event
        fastify.post('/fupload', uploadfile_controller_1.uploadFileController);
        fastify.delete('/fdelete', uploadfile_controller_1.deleteFileController);
    });
}
exports.default = fileUploadRoutes;
