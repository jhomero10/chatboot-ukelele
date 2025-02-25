"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("@bot-whatsapp/bot");
const conversational_layer_1 = __importDefault(require("../layers/conversational.layer"));
const main_layer_1 = __importDefault(require("../layers/main.layer"));
/**
* Este flow responde a cualquier palabra que escriban
*/
exports.default = (0, bot_1.addKeyword)(bot_1.EVENTS.WELCOME)
    .addAction(conversational_layer_1.default)
    .addAction(main_layer_1.default);
