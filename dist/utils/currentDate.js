"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullCurrentDate = void 0;
const date_fns_1 = require("date-fns");
const getFullCurrentDate = () => {
    const currentD = new Date();
    const formatDate = (0, date_fns_1.format)(currentD, 'yyyy/MM/dd HH:mm'); // Formato "dd/MM/yyyy HH:mm:ss"
    const day = (0, date_fns_1.format)(currentD, 'EEEE'); // Obtener el día de la semana
    return [
        formatDate,
        day,
    ].join(' ');
};
exports.getFullCurrentDate = getFullCurrentDate;
