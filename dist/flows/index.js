"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("@bot-whatsapp/bot");
const welcome_flow_1 = __importDefault(require("./welcome.flow"));
const seller_flow_1 = require("./seller.flow");
const schedule_futbol_flow_1 = require("./schedule-futbol.flow");
const confirm_flow_1 = require("./confirm.flow");
const schedule_voley_flow_1 = require("./schedule-voley.flow");
/**
 * Declaramos todos los flujos que vamos a utilizar
 */
exports.default = (0, bot_1.createFlow)([welcome_flow_1.default, seller_flow_1.flowSeller, schedule_futbol_flow_1.flowScheduleFutbol, schedule_voley_flow_1.flowScheduleVoley, confirm_flow_1.flowConfirm]);
