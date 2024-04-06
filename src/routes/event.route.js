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
const event_controller_1 = require("../controllers/event.controller");
function eventRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Event
        fastify.post('/events', event_controller_1.createEventController);
        // Get All Events
        fastify.get('/events', event_controller_1.getEventsController);
        // Get Single Event by ID
        fastify.get('/events/:id', event_controller_1.findEventByIdController);
        // Update Event by ID
        fastify.put('/events/:id', event_controller_1.updateEventController);
        // Delete Event by ID
        fastify.delete('/events/:id', event_controller_1.deleteEventController);
    });
}
exports.default = eventRoutes;
