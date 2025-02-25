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
exports.flowScheduleVoley = void 0;
const bot_1 = require("@bot-whatsapp/bot");
const handleHistory_1 = require("../utils/handleHistory");
const generateTimer_1 = require("../utils/generateTimer");
const calendar_1 = require("../services/calendar");
const constants_1 = require("../utils/constants");
const currentDate_1 = require("../utils/currentDate");
const PROMPT_SCHEDULE = `
Como ingeniero de inteligencia artificial especializado en la programación de reservas de canchas de voley ball playa,
tu objetivo es analizar la conversación y determinar la intención del cliente de programar una reserva de una cancha de voley ball playa, así como su preferencia de fecha y hora. 
La reserva durará mínimo 1 hora y solo puede ser programada entre las 5pm y las 11pm en intervalos de 1 hora empezando desde las 5:00 pm y finalizando a las 10:00 pm,
de lunes a domingo y solo para los siguientes 30 días.

Fecha de hoy: {CURRENT_DAY}


**Calendarios disponibles**:
----------------------------------
${constants_1.calendarVoley}



Citas ya agendadas:
-----------------------------------
{AGENDA_ACTUAL}

Historial de Conversacion:
-----------------------------------
{HISTORIAL_CONVERSACION}

Ejemplos de respuestas adecuadas para sugerir horarios y verificar disponibilidad:
----------------------------------
"Por supuesto, tengo un espacio disponible mañana, ¿a qué hora te resulta más conveniente?"
"Sí, tengo un espacio disponible hoy, ¿a qué hora te resulta más conveniente?"
"Ciertamente, tengo varios huecos libres esta semana. Por favor, indícame el día y la hora que prefieres."

Ejemplos de respuestas adecuadas para confirmar horarios:
----------------------------------
"¡Perfecto! Vamos a continuar el proceso para programar tu reserva de voley playa"
"¡Solo quedan unos pocos pasos!"

INSTRUCCIONES:
1. **NO** saludes.
2. **Itera sobre todos los calendarios disponibles** en el orden en que están listados.
3. Debes tener en cuenta que las reservas no pueden pasar de las 11 pm, es decir si se intenta reservar a las 10 pm solo se podrá reservar 1 hora.
4. Para cada calendario:
    - **Verifica si la hora solicitada está disponible** en el calendario correspondiente.
    - Si la hora solicitada ya está reservada en un calendario, **continúa verificando en los demás calendarios** antes de responder que no hay disponibilidad.
    - Si la hora solicitada está disponible, **responde con la confirmación de la reserva**
5. Si encuentras un calendario con disponibilidad, **ofrece la hora solicitada** al usuario, especificando el nombre del calendario en el que se puede programar.
6. Si no hay disponibilidad en ninguno de los calendarios, sugiere otro horario disponible.
7. Especifica al usuario en cuál calendario se reservó (campo "nombre"). 
8. NO se admitirán reservas en horarios donde los minutos no estén en 00.
9. Respuestas cortas, ideales para enviar por WhatsApp, con emojis.
10. Si el usuario no confirma, debes decir que se ha cancelado el proceso.
11. Si el usuario te confirma otro horario debes preguntarle si está seguro 
12. **SIEMPRE** debes preguntar si el cliente desea confirmar el horario. 
13. **NO** se pueden reservar canchas antes de las 5 pm y despues de las 11pm
14. si la reserva inicia antes de las 5pm o termina después de las 11pm debes decirle al cliente que **NO** es posible agendar en ese horario

-----------------------------
Respuesta útil en primera persona:`;
const generateSchedulePrompt = (summary, history) => {
    const nowDate = (0, currentDate_1.getFullCurrentDate)();
    const mainPrompt = PROMPT_SCHEDULE
        .replace('{AGENDA_ACTUAL}', summary)
        .replace('{HISTORIAL_CONVERSACION}', history)
        .replace('{CURRENT_DAY}', nowDate);
    return mainPrompt;
};
const flowScheduleVoley = (0, bot_1.addKeyword)(bot_1.EVENTS.ACTION).addAction((ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { extensions, state, flowDynamic }) {
    const ai = extensions.ai;
    const history = (0, handleHistory_1.getHistoryParse)(state);
    const list = yield (0, calendar_1.getCurrentCalendar)(1);
    const promptSchedule = generateSchedulePrompt((list === null || list === void 0 ? void 0 : list.length) ? list : 'ninguna', history);
    const text = yield ai.createChat([
        {
            role: 'system',
            content: promptSchedule
        },
        {
            role: 'user',
            content: `Cliente pregunta: ${ctx.body}`
        }
    ], 'gpt-4');
    if (text === null)
        return;
    const textFinal = text.replace("ha sido programada", "podrá ser programada").replace("Vendedor:", "");
    yield (0, handleHistory_1.handleHistory)({ content: textFinal, role: 'assistant' }, state);
    const chunks = textFinal.split(/(?<!\d)\.\s+/g);
    yield state.update({ interest: "Reserva voley", idParent: 1 });
    for (const chunk of chunks) {
        yield flowDynamic([{ body: chunk.trim(), delay: (0, generateTimer_1.generateTimer)(150, 250) }]);
    }
}));
exports.flowScheduleVoley = flowScheduleVoley;
