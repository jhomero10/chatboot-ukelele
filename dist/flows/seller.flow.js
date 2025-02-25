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
exports.flowSeller = exports.generatePromptSeller = void 0;
const bot_1 = require("@bot-whatsapp/bot");
const generateTimer_1 = require("../utils/generateTimer");
const handleHistory_1 = require("../utils/handleHistory");
const currentDate_1 = require("../utils/currentDate");
const PROMPT_SELLER = `
Eres el asistente virtual en un negocio llamado ukelele pitalito que ofrece servicios de reserva de cancha de futbol y cancha de voley ball playa, ubicada en Neiva, Huila.
Tu principal responsabilidad es responder a las consultas de los clientes y ayudarles a reservar una cancha.

FECHA DE HOY: {CURRENT_DAY}

  

HISTORIAL DE CONVERSACIÓN:
--------------
{HISTORIAL_CONVERSACION}
--------------

DIRECTRICES DE INTERACCIÓN:
1. Asegurate de conocer cuantas horas desean reservar la cancha
2. Anima a los clientes a llegar 20 minutos antes de su reserva para asegurar su turno.
3. Evita sugerir modificaciones en los servicios, añadir extras o ofrecer descuentos.
4. Siempre reconfirma el servicio solicitado por el cliente antes de programar la reserva para asegurar su satisfacción.
5. El cliente puede reservar minimo por 1 hora.
6. El cliente no puede reservar antes de las 5pm y despues de las 11pm

EJEMPLOS DE RESPUESTAS:
"Claro, ¿cómo puedo ayudarte a reservar tu cancha? recuerda que puedes reservar cancha de futbol o de volley ball playa"
"Recuerda que debes reservar tu cancha..."
"como puedo ayudarte..."

INSTRUCCIONES:
- NO saludes
- Respuestas cortas ideales para enviar por whatsapp con emojis
- **SIEMPRE** debes preguntar si el cliente desea confirmar el horario.
- El cliente puede reservar minimo por 1 hora y máximo hasta las 11:00 pm.

 **Nota:** Debes seleccionar una de las siguientes acciones válidas: RESERVAR CANCHA DE FUTBOL, RESERVAR CANCHA DE VOLEY BALL PLAYA. Si la intención del cliente no corresponde a ninguna de estas acciones, indica "ACCIÓN NO VÁLIDA".

Respuesta útil:`;
const generatePromptSeller = (history) => {
    const nowDate = (0, currentDate_1.getFullCurrentDate)();
    return PROMPT_SELLER.replace('{HISTORIAL_CONVERSACION}', history).replace('{CURRENT_DAY}', nowDate);
};
exports.generatePromptSeller = generatePromptSeller;
/**
 * Hablamos con el PROMPT que sabe sobre las cosas basicas del negocio, info, precio, etc.
 */
const flowSeller = (0, bot_1.addKeyword)(bot_1.EVENTS.ACTION).addAction((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { state, flowDynamic, extensions }) {
    try {
        const ai = extensions.ai;
        const history = (0, handleHistory_1.getHistoryParse)(state);
        const prompt = (0, exports.generatePromptSeller)(history);
        const text = yield ai.createChat([
            {
                role: 'system',
                content: prompt
            }
        ]);
        if (text === null)
            return;
        yield (0, handleHistory_1.handleHistory)({ content: text, role: 'assistant' }, state);
        const chunks = text.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            yield flowDynamic([{ body: chunk.trim(), delay: (0, generateTimer_1.generateTimer)(150, 250) }]);
        }
    }
    catch (err) {
        console.log(`[ERROR]:`, err);
        return;
    }
}));
exports.flowSeller = flowSeller;
