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
const event_address_controller_1 = require("../controllers/event-address.controller");
function eventAddressRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/events-address', event_address_controller_1.createEventAddressController);
        fastify.get('/events-address', event_address_controller_1.getEventsAddressesController);
        fastify.get('/events-address/:id', event_address_controller_1.findEventAddressByIdController);
        fastify.put('/events-address/:id', event_address_controller_1.updateEventAddressController);
        fastify.delete('/events-address/:id', event_address_controller_1.deleteEventAddressController);
    });
}
exports.default = eventAddressRoutes;
