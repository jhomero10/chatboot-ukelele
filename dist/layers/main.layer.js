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
const handleHistory_1 = require("../utils/handleHistory");
const seller_flow_1 = require("../flows/seller.flow");
const confirm_flow_1 = require("../flows/confirm.flow");
const schedule_voley_flow_1 = require("../flows/schedule-voley.flow");
const schedule_futbol_flow_1 = require("../flows/schedule-futbol.flow");
/**
 * Determina que flujo va a iniciarse basado en el historial que previo entre el bot y el humano
 */
exports.default = (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { state, gotoFlow, extensions }) {
    const ai = extensions.ai;
    const history = (0, handleHistory_1.getHistoryParse)(state);
    const prompt = `Como una inteligencia artificial avanzada, tu tarea es analizar el contexto de una conversación y determinar cuál de las siguientes acciones es más apropiada para realizar:
    --------------------------------------------------------
    Historial de conversación:
    ${history}
    
    Únicas posibles acciones a realizar:
    1. RESERVA FUTBOL: Esta acción se debe realizar cuando el cliente expresa su deseo de reservar una cancha de futbol. 
    2. RESERVA VOLEY: Esta acción se debe realizar cuando el cliente expresa su deseo de reservar una cancha de voley.
    3. HABLAR: Esta acción se debe realizar cuando el cliente desea reservar una cancha de futbol o voley o necesita más información.
    4. CONFIRMAR: Esta acción se debe realizar cuando el cliente y el asistente virtual llegaron a un acuerdo mutuo proporcionando una fecha, dia y hora exacta sin conflictos de hora.
    -----------------------------
    Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.
    
    **Nota:** 
    - Debes seleccionar una de las siguientes acciones válidas: RESERVA FUTBOL, RESERVA VOLEY, HABLAR, CONFIRMAR. Si la intención del cliente no corresponde a ninguna de estas acciones, indica "ACCIÓN NO VÁLIDA".
    - **No puedes seleccionar "CONFIRMAR" si la hora solicitada está fuera del horario disponible o si la duración del evento solicitado excede la disponibilidad de la cancha**.
    - Si el cliente solicita una reserva de fútbol o voley por un tiempo que excede el horario permitido o la disponibilidad de la cancha, selecciona "RESERVA FUTBOL" o "RESERVA VOLEY" según corresponda, para indicar que la acción debe ser tomada pero que se necesita ajustar los horarios.
    
    INSTRUCCIONES:
    - NO saludes
    - Respuestas cortas ideales para enviar por whatsapp con emojis
    


    Respuesta ideal (RESERVA VOLEY|RESERVA FUTBOL|CONFIRMAR):`;
    const text = yield ai.createChat([
        {
            role: 'system',
            content: prompt
        }
    ]);
    if (text === null)
        return;
    if (text.includes('HABLAR'))
        return gotoFlow(seller_flow_1.flowSeller);
    if (text.includes('VOLEY'))
        return gotoFlow(schedule_voley_flow_1.flowScheduleVoley);
    if (text.includes('FUTBOL'))
        return gotoFlow(schedule_futbol_flow_1.flowScheduleFutbol);
    if (text.includes('CONFIRMAR'))
        return gotoFlow(confirm_flow_1.flowConfirm);
});
