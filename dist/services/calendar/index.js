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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appToCalendar = exports.getCurrentCalendar = void 0;
const date_fns_1 = require("date-fns");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
var service;
const data = fs_1.default.readFileSync('calendar.json', 'utf8');
const calendar = JSON.parse(data);
/**
 * get calendar
 * @returns
 */
const getCurrentCalendar = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const list = calendar.filter((x) => x.startDate !== null && x.startDate !== undefined && x.idParent === parentId || parentId === undefined).reduce((prev, current) => {
        return prev += [
            `Espacio reservado (no disponible): ID: ${current.idCalendar}`,
            `(Desde ${(0, date_fns_1.format)(current.startDate, 'eeee do h:mm a')} `,
            `Hasta ${(0, date_fns_1.format)((0, date_fns_1.addMinutes)(current.startDate, 30), 'eeee do h:mm a')})\n`,
        ].join(' ');
    }, '');
    return list;
});
exports.getCurrentCalendar = getCurrentCalendar;
/**
 * add to calendar
 * @param text
 * @returns
 */
const appToCalendar = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = JSON.parse(text);
    if (!service) {
        service = axios_1.default.create({
            baseURL: 'https://hook.us2.make.com',
            timeout: 15000,
        });
    }
    return service.post(`${service.defaults.baseURL}/au12hcff27xa6u5sgt6e8qc5sesnv4fn`, Object.assign(Object.assign({}, payload), { idCalendar: payload.idCalendar + "@group.calendar.google.com" }), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            body: Object.assign(Object.assign({}, payload), { idCalendar: payload.idCalendar + "@group.calendar.google.com" })
        },
    }).then(dataApi => {
        const payloadToSave = Object.assign(Object.assign({}, payload), { eventId: dataApi.data });
        calendar.push(payloadToSave);
        console.log(payloadToSave);
        fs_1.default.writeFile('calendar.json', JSON.stringify(calendar, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            }
        });
    });
});
exports.appToCalendar = appToCalendar;
