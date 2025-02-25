import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowConfirm } from "../flows/confirm.flow"
import { flowScheduleFutbol } from "src/flows/schedule-futbol.flow"
import { flowScheduleVoley } from "src/flows/schedule-voley.flow"

/**
 * Determina que flujo va a iniciarse basado en el historial que previo entre el bot y el humano
 */
export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
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
    


    Respuesta ideal (RESERVA VOLEY|RESERVA FUTBOL|CONFIRMAR):`

    const text = await ai.createChat([
        {
            role: 'system',
            content: prompt
        }
    ])
    if (text.includes('HABLAR')) return gotoFlow(flowSeller)
    if (text.includes('VOLEY')) return gotoFlow(flowScheduleVoley)
    if (text.includes('FUTBOL')) return gotoFlow(flowScheduleFutbol)
    if (text.includes('CONFIRMAR')) return gotoFlow(flowConfirm)
}