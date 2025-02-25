import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import AIClass from "../services/ai";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";
import { getCurrentCalendar } from "../services/calendar";
import { getFullCurrentDate } from "src/utils/currentDate";
import { calendarsFutbol } from "src/utils/constants";

const PROMPT_SCHEDULE_FUTBOL =
    `Como ingeniero de inteligencia artificial especializado en la programación de reservas para cancha de futbol,
tu objetivo es analizar la conversación y determinar la intención del cliente de programar una reserva de una cancha de futbol, así como su preferencia de fecha y hora. 
La reserva durará como mínimo 1 hora. Solo puede ser programada entre las 5pm y las 11pm en intervalos de 1 hora, comenzando desde las 5:00 pm y finalizando a las 11:00 pm,
de lunes a domingo y solo para los siguientes 30 días.

Fecha de hoy: {CURRENT_DAY}

**Calendarios disponibles**:
-----------------------------------
${calendarsFutbol}
 

Reservas ya agendadas:
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
"¡Perfecto! Vamos a continuar el proceso para reservar tu cancha de futbol"
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
7. Especifica al usuario en cuál calendario se programó la reserva (campo "nombre"). 
8. NO se admitirán reservas en horarios donde los minutos no estén en 00.
9. Respuestas cortas, ideales para enviar por WhatsApp, con emojis.
10. Si el usuario no confirma, debes decir que se ha cancelado el proceso.
11. Si el usuario te confirma otro horario debes preguntarle si está seguro.
12. **SIEMPRE** debes preguntar si el cliente desea confirmar el horario.
13. **NO** se pueden reservar canchas antes de las 5 pm y despues de las 11pm
14. si la reserva inicia antes de las 5pm o termina después de las 11pm debes decirle al cliente que **NO** es posible agendar en ese horario

-----------------------------
Respuesta útil en primera persona:`

const generateSchedulePrompt = (summary: string, history: string) => {
    const nowDate = getFullCurrentDate()
    const mainPrompt = PROMPT_SCHEDULE_FUTBOL
        .replace('{AGENDA_ACTUAL}', summary)
        .replace('{HISTORIAL_CONVERSACION}', history)
        .replace('{CURRENT_DAY}', nowDate)

    return mainPrompt
}
 
const flowScheduleFutbol = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic }) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const list = await getCurrentCalendar(2)
    const promptSchedule = generateSchedulePrompt(list?.length ? list : 'ninguna', history)

    const text = await ai.createChat([
        {
            role: 'system',
            content: promptSchedule
        },
        {
            role: 'user',
            content: `Cliente pregunta: ${ctx.body}`
        }
    ], 'gpt-4')


    const textFinal = text.replace("reserva ha sido programada", "reserva podrá ser programada").replace("Vendedor:", "")

    await handleHistory({ content: textFinal, role: 'assistant' }, state)

    const chunks = textFinal.split(/(?<!\d)\.\s+/g);
    await state.update({ interest: "Reserva futbol", idParent: 2 })
    for (const chunk of chunks) {
        await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
    }

})

export { flowScheduleFutbol }