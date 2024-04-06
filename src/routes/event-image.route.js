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
const event_image_controller_1 = require("../controllers/event-image.controller");
function eventImageRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Event
        fastify.post('/event-image', event_image_controller_1.createEventImageController);
        fastify.put('/event-image/:id', event_image_controller_1.updateEventImageController);
        fastify.get('/event-image/:id', event_image_controller_1.findByIdEventImageController);
        fastify.delete('/event-image/:id', event_image_controller_1.deleteEventImageController);
    });
}
exports.default = eventImageRoutes;
