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
exports.flowConfirm = void 0;
const bot_1 = require("@bot-whatsapp/bot");
const handleHistory_1 = require("../utils/handleHistory");
const currentDate_1 = require("../utils/currentDate");
const calendar_1 = require("../services/calendar");
const constants_1 = require("../utils/constants");
const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};
const generatePromptToFormatDate = (history, agendaActual, availableCalendar) => {
    const prompt = `Fecha de Hoy:${(0, currentDate_1.getFullCurrentDate)()}, Basado en el Historial de conversacion: 
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
    - Siempre se debe responder en el formato de la fecha YYYY/dd/mm hh:mm
    - Siempre debe devolver el id calendar así calendario:idCalendar
    - Siempre debe devolver la cantidad de horas de reserva así horas: Cantidad de horas
    `;
    return prompt;
};
const generateJsonParse = (info) => {
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
    
    Objeto JSON a generar:`;
    return prompt;
};
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = (0, bot_1.addKeyword)(bot_1.EVENTS.ACTION).addAction((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { flowDynamic }) {
    yield flowDynamic('Ok, voy a confirmar tu cita');
})).addAction((_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { state, flowDynamic, extensions }) {
    const ai = extensions.ai;
    const history = (0, handleHistory_1.getHistoryParse)(state);
    const list = yield (0, calendar_1.getCurrentCalendar)(state.get("idParent"));
    const calendarSelect = state.get("idParent") === 1 ? constants_1.calendarVoley : constants_1.calendarsFutbol;
    const text = yield ai.createChat([
        {
            role: 'system',
            content: generatePromptToFormatDate(history, (list === null || list === void 0 ? void 0 : list.length) ? list : 'ninguna', (0, constants_1.getCalendar)(calendarSelect))
        }
    ], 'gpt-4');
    if (text === null)
        return;
    const value = text.replace("fecha:", "").toLowerCase().split("calendario:");
    const parsedText = value[1] === undefined ? text.replace("fecha:", "").toLowerCase().split("idcalendario:") : value;
    const date = parsedText[0];
    const realDate = date.split("horas:");
    yield (0, handleHistory_1.handleHistory)({ content: date, role: 'assistant' }, state);
    const time = (isNaN(Number(realDate[1])) ? 1 : Number(realDate[1]));
    const nombreCalendar = calendarSelect.find(x => x.id === parsedText[1].trim());
    if (nombreCalendar)
        yield state.update({ calendarName: nombreCalendar.name + "\n" });
    yield state.update({ idCalendar: parsedText[1] });
    yield state.update({ startDate: realDate[0] });
    yield state.update({ time: time });
    yield flowDynamic('¿Cómo es tu número de documento?');
})).addAction({ capture: true }, (ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { flowDynamic, fallBack, state }) {
    if (!/^\d+$/g.test(ctx.body))
        return fallBack("Por favor digita un documento válido. Recuerda que debes digitarlo sin puntos ni guiones");
    yield state.update({ document: ctx.body });
    yield flowDynamic('¿Cómo es tu nombre completo?');
})).addAction({ capture: true }, (ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { flowDynamic, state }) {
    yield state.update({ name: ctx.body });
    yield flowDynamic('¿Cómo es tu número de telefono?');
})).addAction({ capture: true }, (ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { flowDynamic, fallBack, state }) {
    if (!/^\d{10}$/g.test(ctx.body))
        return fallBack("Por favor digita un teléfono válido válido.");
    yield state.update({ phone: ctx.body });
    yield flowDynamic('¿Cómo es tu correo electronico?');
})).addAction({ capture: true }, (ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { state, flowDynamic, fallBack }) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(ctx.body))
        return fallBack("Por favor digita un correo eléctronico válido.");
    yield state.update({ email: ctx.body });
    yield flowDynamic(`¿Me confirmas fecha y hora?: ${state.get('startDate')} horas: ${state.get('time')} \nPor favor responde si o no.`);
}))
    .addAction({ capture: true }, (ctx_1, _a) => __awaiter(void 0, [ctx_1, _a], void 0, function* (ctx, { state, extensions, endFlow, flowDynamic, fallBack }) {
    if (!ctx.body.toLocaleLowerCase().includes("si") && !ctx.body.toLocaleLowerCase().includes("no")) {
        fallBack("¡Opción no válida! \nPor favor responde si o no");
        return;
    }
    if (!ctx.body.toLocaleLowerCase().includes("si")) {
        endFlow("¡Tu cita no ha sido confirmada!");
        (0, handleHistory_1.clearHistory)(state);
        return;
    }
    const infoCustomer = `name: ${state.get("name")}, document: ${state.get('document')}, StarteDate: ${state.get('startDate')}, email: ${state.get('email')}, interest: ${state.get("interest")}, duration:${state.get("time") * 60}, idCalendar:${state.get("idCalendar")}, idParent:${state.get("idParent")},phone:${state.get("phone")}`;
    const ai = extensions.ai;
    const text = yield ai.createChat([
        {
            role: 'system',
            content: generateJsonParse(infoCustomer)
        }
    ]);
    if (text === null)
        return;
    try {
        yield (0, calendar_1.appToCalendar)(text);
        let fecha = new Date(state.get('startDate'));
        let fechaEnLetras = fecha.toLocaleDateString('es-ES', opciones);
        flowDynamic([`Tu reserva quedó Lista!`,
            'Datos de la reserva:',
            `${state.get("interest")}`,
            `${fechaEnLetras}`,
            `${state.get("calendarName")}`,
            `duration:${state.get("time")} hora(s)`,
            `nombre reserva: ${state.get("name")}`,
        ].join("\n"));
        endFlow();
    }
    catch (e) {
        console.log(e);
        endFlow(`Ha ocurrido un error al intentar crear la agenda.`);
    }
    (0, handleHistory_1.clearHistory)(state);
}));
exports.flowConfirm = flowConfirm;
