import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import AIClass from "../services/ai";
import { clearHistory, handleHistory, getHistoryParse } from "../utils/handleHistory";
import { getFullCurrentDate } from "../utils/currentDate";
import { appToCalendar, getCurrentCalendar } from "src/services/calendar";
import { calendarVoley, calendarsFutbol, getCalendar } from "src/utils/constants";

const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};
const generatePromptToFormatDate = (history: string, agendaActual: string, availableCalendar: string) => {
    const prompt = `Fecha de Hoy:${getFullCurrentDate()}, Basado en el Historial de conversacion: 
    ${history}
    ----------------

    **Calendarios disponibles**:
    -----------------------------------
    ${availableCalendar}

    Citas ya agendadas:
    -----------------------------------
    ${agendaActual}
    ----------------
    fecha: yyyy / dd / mm hh:mm  horas: cantidad de horas calendario: idCalendar
    ----------------
    INSTRUCCIONES:
    - NO repitas agendas
    - Si la fecha ya fue reservada pon la reserva en la agenda mas cercana.
    - Solo puede ser reservadas entre las 5pm y las 11pm en intervalos de minimo 1 hora empezando desde las 5:00 pm y finalizando a las 10:00 pm,de lunes a domingo y solo para los siguientes 30 días
    - En el campo "idCalendar" debes poner el idCalendar que fue seleccionado anteriormente.
    - Debes tener en cuenta que las reservas no pueden pasar de las 11 pm, es decir si se intenta reservar a las 10 pm solo se podrá reservar 1 hora.

    `

    return prompt
}

const generateJsonParse = (info: string) => {
    const prompt = `tu tarea principal es analizar la información proporcionada en el contexto y generar un objeto JSON que se adhiera a la estructura especificada a continuación. 

    Contexto: "${info}"
    
    {
        "document": "1234",
        "name": "faustino",
        "interest": "n/a", 
        "email": "fef@fef.com",
        "startDate": "2024/02/15 00:00",
        "idCalendar":"148f49367345958fc86390ec0ca5ea35fe373bd7aa5b47f434f968232865bd3c@group.calendar.google.com",
        "duration":"30",
        "idParent": 2
        "phone": "3103029301"
    }
    
    Objeto JSON a generar:`

    return prompt
}


/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
    await flowDynamic('Ok, voy a confirmar tu cita')
}).addAction(async (_, { state, flowDynamic, extensions }) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const list = await getCurrentCalendar(state.get("idParent"))
    const calendarSelect = state.get("idParent") === 1 ? calendarVoley : calendarsFutbol
    const text = await ai.createChat([
        {
            role: 'system',
            content: generatePromptToFormatDate(history, list?.length ? list : 'ninguna', getCalendar(calendarSelect))
        }
    ], 'gpt-4')
    const value = text.replace("fecha:", "").toLowerCase().split("calendario:")
    const parsedText = value[1] === undefined ? text.replace("fecha:", "").toLowerCase().split("idcalendario:") : value;
    const date = parsedText[0]
    const realDate = date.split("horas:")
    await handleHistory({ content: date, role: 'assistant' }, state)
    const time = (isNaN(Number(realDate[1])) ? 1 : Number(realDate[1]))
    const nombreCalendar = calendarSelect.find(x => x.id === parsedText[1].trim())
    if (nombreCalendar) await state.update({ calendarName: nombreCalendar.name + "\n" })
    await state.update({ idCalendar: parsedText[1] })
    await state.update({ startDate: realDate[0] })
    await state.update({ time: time })
    await flowDynamic('¿Cómo es tu número de documento?')
}).addAction({ capture: true }, async (ctx, { flowDynamic, fallBack, state }) => {
    if (!/^\d+$/g.test(ctx.body))
        return fallBack("Por favor digita un documento válido. Recuerda que debes digitarlo sin puntos ni guiones")
    await state.update({ document: ctx.body })
    await flowDynamic('¿Cómo es tu nombre completo?')
}).addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ name: ctx.body })
    await flowDynamic('¿Cómo es tu número de telefono?')
}).addAction({ capture: true }, async (ctx, { flowDynamic, fallBack, state }) => {
    if (!/^\d{10}$/g.test(ctx.body))
        return fallBack("Por favor digita un teléfono válido válido.")
    await state.update({ phone: ctx.body })
    await flowDynamic('¿Cómo es tu correo electronico?')
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(ctx.body))
        return fallBack("Por favor digita un correo eléctronico válido.")

    await state.update({ email: ctx.body })
    await flowDynamic(`¿Me confirmas fecha y hora?: ${state.get('startDate')} horas: ${state.get('time')} \nPor favor responde si o no.`)
})
    .addAction({ capture: true }, async (ctx, { state, extensions, endFlow, flowDynamic, fallBack }) => {
        if (!ctx.body.toLocaleLowerCase().includes("si") && !ctx.body.toLocaleLowerCase().includes("no")) {
            fallBack("¡Opción no válida! \nPor favor responde si o no")
            return
        }
        if (!ctx.body.toLocaleLowerCase().includes("si")) {
            endFlow("¡Tu cita no ha sido confirmada!")
            clearHistory(state)
            return
        }
        const infoCustomer = `name: ${state.get("name")}, document: ${state.get('document')}, StarteDate: ${state.get('startDate')}, email: ${state.get('email')}, interest: ${state.get("interest")}, duration:${state.get("time") * 60}, idCalendar:${state.get("idCalendar")}, idParent:${state.get("idParent")},phone:${state.get("phone")}`
        const ai = extensions.ai as AIClass
        const text = await ai.createChat([
            {
                role: 'system',
                content: generateJsonParse(infoCustomer)
            }
        ])
        try {
            await appToCalendar(text)
            let fecha = new Date(state.get('startDate'));
            let fechaEnLetras = fecha.toLocaleDateString('es-ES', opciones);
            flowDynamic([`Tu reserva quedó Lista!`,
                'Datos de la reserva:',
                `${state.get("interest")}`,
                `${fechaEnLetras}`,
                `${state.get("calendarName")}`,
                `duration:${state.get("time")} hora(s)`,
                `nombre reserva: ${state.get("name")}`,
            ].join("\n"))
            endFlow()
        } catch (e) {
            console.log(e)
            endFlow(`Ha ocurrido un error al intentar crear la agenda.`)
        }
        clearHistory(state)

    })

export { flowConfirm }