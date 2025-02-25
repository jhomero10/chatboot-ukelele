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
exports.clearHistory = exports.getHistoryParse = exports.getHistory = exports.handleHistory = void 0;
const handleHistory = (inside, _state) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const history = (_a = _state.get('history')) !== null && _a !== void 0 ? _a : [];
    history.push(inside);
    yield _state.update({ history });
});
exports.handleHistory = handleHistory;
const getHistory = (_state, k = 6) => {
    var _a;
    const history = (_a = _state.get('history')) !== null && _a !== void 0 ? _a : [];
    const limitHistory = history.slice(-k);
    return limitHistory;
};
exports.getHistory = getHistory;
const getHistoryParse = (_state, k = 6) => {
    var _a;
    const history = (_a = _state.get('history')) !== null && _a !== void 0 ? _a : [];
    const limitHistory = history.slice(-k);
    return limitHistory.reduce((prev, current) => {
        const msg = current.role === 'user' ? `\nCliente: "${current.content}"` : `\nVendedor: "${current.content}"`;
        prev += msg;
        return prev;
    }, ``);
};
exports.getHistoryParse = getHistoryParse;
const clearHistory = (_state) => __awaiter(void 0, void 0, void 0, function* () {
    _state.clear();
});
exports.clearHistory = clearHistory;
