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
/**
 * Su funcion es almancenar en el state todos los mensajes que el usuario  escriba
 */
exports.default = (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ body }, { state, }) {
    yield (0, handleHistory_1.handleHistory)({ content: body, role: 'user' }, state);
});
